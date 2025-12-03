const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// N8N Webhook URL - can be configured via environment variable
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/medical-assessment';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Nur PDF, DOCX, und Bild-Dateien sind erlaubt!'));
        }
    }
});

// API Routes

// Upload documents
app.post('/api/upload', upload.array('documents', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Keine Dateien hochgeladen' });
        }

        const uploadedFiles = req.files.map(file => ({
            originalName: file.originalname,
            filename: file.filename,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype
        }));

        res.json({
            success: true,
            message: `${req.files.length} Dokument(e) erfolgreich hochgeladen`,
            files: uploadedFiles
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Fehler beim Hochladen der Dateien' });
    }
});

// Process medical case and send to n8n webhook
app.post('/api/process-case', async (req, res) => {
    try {
        const caseData = req.body;

        console.log('Processing case:', caseData.caseNumber);

        // Send data to n8n webhook
        const webhookResponse = await axios.post(N8N_WEBHOOK_URL, {
            caseNumber: caseData.caseNumber,
            patientInfo: caseData.patientInfo,
            messages: caseData.messages,
            documents: caseData.documents,
            medicalExtraction: caseData.medicalExtraction,
            timestamp: new Date().toISOString()
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
        });

        res.json({
            success: true,
            message: 'Fall erfolgreich an n8n übermittelt',
            webhookResponse: webhookResponse.data
        });
    } catch (error) {
        console.error('Error sending to n8n webhook:', error.message);

        // Even if webhook fails, we can still return success to the client
        // In production, you might want to queue this for retry
        if (error.code === 'ECONNREFUSED') {
            res.status(503).json({
                success: false,
                error: 'n8n Webhook nicht erreichbar. Bitte Verbindung prüfen.',
                details: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Fehler beim Senden an n8n',
                details: error.message
            });
        }
    }
});

// Mock endpoint for medical extraction (in real app, this would use AI/ML)
app.post('/api/extract-medical-data', async (req, res) => {
    try {
        const { documents } = req.body;

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock extracted data - in production this would come from AI/OCR processing
        const extractedData = {
            diagnosen: [
                { name: 'Helicobacter-pylori-Gastritis', status: 'bestätigt', severity: 'mittel' }
            ],
            medikation: [
                { name: 'Amoxicillin 1000 mg', dosierung: '1-0-1 bis 21.02.2021', status: 'aktiv' },
                { name: 'Clarithromycin 250 mg', dosierung: '2-0-2 bis 21.02.2021', status: 'aktiv' },
                { name: 'Pantoprazol 40 mg', dosierung: '2-0-2 bis 21.02.2021', status: 'aktiv' }
            ],
            laborwerte: [
                { name: 'Gastritis Typ B', wert: 'n/a' },
                { name: 'CRP 2.1 mg/dL', wert: '2.1', einheit: 'mg/dL', status: 'leicht erhöht' },
                { name: 'Hb 11.9 g/dL', wert: '11.9', einheit: 'g/dL', status: 'leicht erniedrigt' },
                { name: 'Refluxösophagitis Grad D', wert: 'Grad D', status: 'warnung' },
                { name: 'Leukozyten 9.6 /µl', wert: '9.6', einheit: '/µl', status: 'normal' }
            ]
        };

        res.json({
            success: true,
            extractedData: extractedData
        });
    } catch (error) {
        console.error('Extraction error:', error);
        res.status(500).json({ error: 'Fehler bei der medizinischen Extraktion' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        webhookUrl: N8N_WEBHOOK_URL
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server läuft auf Port ${PORT}`);
    console.log(`📊 Frontend: http://localhost:${PORT}`);
    console.log(`🔗 n8n Webhook URL: ${N8N_WEBHOOK_URL}`);
    console.log('\nZum Ändern der n8n Webhook URL: N8N_WEBHOOK_URL=<url> npm start');
});
