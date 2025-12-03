// Application State
const appState = {
    caseNumber: 'UW-2024-00042',
    patientInfo: {
        gender: 'M',
        age: 36,
        occupation: 'Softwareentwickler',
        height: 185,
        weight: 72,
        bmi: 21,
        smoker: false
    },
    messages: [],
    documents: [],
    medicalExtraction: null,
    conversationStarted: false
};

// DOM Elements
const chatContainer = document.getElementById('chatContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const attachBtn = document.getElementById('attachBtn');
const fileInput = document.getElementById('fileInput');
const submitBtn = document.getElementById('submitBtn');
const exportBtn = document.getElementById('exportBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // Send message
    sendBtn.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    // File upload
    attachBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);

    // Submit case
    submitBtn.addEventListener('click', handleSubmitCase);

    // Export
    if (exportBtn) {
        exportBtn.addEventListener('click', handleExport);
    }
}

// Handle sending messages
async function handleSendMessage() {
    const message = messageInput.value.trim();

    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');

    // Clear input
    messageInput.value = '';

    // Save to state
    appState.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
    });

    // Show initial conversation if not started
    if (!appState.conversationStarted) {
        appState.conversationStarted = true;
        setTimeout(() => {
            showElement('initialUserMessage');
            showElement('acceptanceMessage');
        }, 500);
    }

    // Simulate assistant response
    setTimeout(() => {
        const response = generateAssistantResponse(message);
        addMessage(response, 'assistant');

        appState.messages.push({
            role: 'assistant',
            content: response,
            timestamp: new Date().toISOString()
        });
    }, 1000);
}

// Generate assistant response (simple logic)
function generateAssistantResponse(userMessage) {
    const lowerMsg = userMessage.toLowerCase();

    if (lowerMsg.includes('dokument') || lowerMsg.includes('upload')) {
        return 'Bitte laden Sie die Dokumente hoch. Ich akzeptiere PDF, DOCX und Bild-Dateien.';
    } else if (lowerMsg.includes('export') || lowerMsg.includes('zusammenfassung')) {
        return 'Die Fall-Zusammenfassung ist bereit. Sie können sie jetzt exportieren oder den Vorgang erstellen.';
    } else if (lowerMsg.includes('patient') || lowerMsg.includes('kunde')) {
        return 'Vielen Dank für die Patienteninformationen. Haben Sie medizinische Dokumente zur Analyse?';
    } else {
        return 'Verstanden. Wie kann ich Ihnen weiter helfen?';
    }
}

// Handle file upload
async function handleFileUpload(event) {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    // Show loading state
    showLoading('Dokumente werden hochgeladen...');

    try {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('documents', file);
        });

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            // Add documents to state
            appState.documents.push(...result.files);

            // Show document section
            displayDocuments(result.files);
            showElement('documentSection');

            // Show acceptance message
            setTimeout(() => {
                showElement('acceptanceMessage');
            }, 500);

            // Start medical extraction
            setTimeout(async () => {
                await performMedicalExtraction(result.files);
            }, 2000);

        } else {
            showError('Fehler beim Hochladen der Dokumente');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showError('Fehler beim Hochladen: ' + error.message);
    } finally {
        hideLoading();
        // Reset file input
        fileInput.value = '';
    }
}

// Display uploaded documents
function displayDocuments(files) {
    const documentList = document.getElementById('documentList');
    const documentHeader = document.querySelector('.document-header');

    documentHeader.textContent = `📎 ${files.length} Dokumente hochgeladen`;

    documentList.innerHTML = '';

    files.forEach(file => {
        const docItem = document.createElement('div');
        docItem.className = 'document-item';

        const sizeKB = (file.size / 1024).toFixed(2);

        docItem.innerHTML = `
            <div class="document-name">
                <span>📄</span>
                <span>${file.originalName}</span>
            </div>
            <span class="document-size">(${sizeKB} KB)</span>
        `;

        documentList.appendChild(docItem);
    });
}

// Perform medical extraction
async function performMedicalExtraction(files) {
    try {
        const response = await fetch('/api/extract-medical-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ documents: files })
        });

        const result = await response.json();

        if (result.success) {
            appState.medicalExtraction = result.extractedData;

            // Display extraction results
            displayMedicalExtraction(result.extractedData);
            showElement('medicalExtraction');

            // Show insight message
            setTimeout(() => {
                showElement('insightMessage');
            }, 1000);

            // Show follow-up messages
            setTimeout(() => {
                showElement('followUpMessage');
            }, 2000);

            setTimeout(() => {
                showElement('correctionMessage');
            }, 3500);

            setTimeout(() => {
                showElement('confirmationMessage');
            }, 5000);

            setTimeout(() => {
                showElement('exportQuestion');
                showElement('exportOptions');
            }, 6500);
        }
    } catch (error) {
        console.error('Extraction error:', error);
        showError('Fehler bei der medizinischen Extraktion');
    }
}

// Display medical extraction results
function displayMedicalExtraction(data) {
    const extractionGrid = document.getElementById('extractionGrid');
    extractionGrid.innerHTML = '';

    // Display Diagnoses
    if (data.diagnosen && data.diagnosen.length > 0) {
        data.diagnosen.forEach(diagnose => {
            const card = createExtractionCard(
                diagnose.name,
                `Status: ${diagnose.status}`,
                diagnose.severity === 'hoch' ? 'danger' : 'warning'
            );
            extractionGrid.appendChild(card);
        });
    }

    // Display Medication
    if (data.medikation && data.medikation.length > 0) {
        data.medikation.forEach(med => {
            const card = createExtractionCard(
                med.name,
                med.dosierung,
                ''
            );
            extractionGrid.appendChild(card);
        });
    }

    // Display Lab Values
    if (data.laborwerte && data.laborwerte.length > 0) {
        data.laborwerte.forEach(labor => {
            let severity = '';
            if (labor.status === 'warnung') {
                severity = 'danger';
            } else if (labor.status === 'leicht erhöht' || labor.status === 'leicht erniedrigt') {
                severity = 'warning';
            }

            const card = createExtractionCard(
                labor.name,
                labor.einheit ? `${labor.wert} ${labor.einheit}` : labor.wert,
                severity
            );
            extractionGrid.appendChild(card);
        });
    }
}

// Create extraction card
function createExtractionCard(title, value, severity = '') {
    const card = document.createElement('div');
    card.className = `extraction-card ${severity}`;

    card.innerHTML = `
        <div class="extraction-card-title">${title}</div>
        <div class="extraction-card-value ${severity ? 'value-' + severity : ''}">${value}</div>
    `;

    return card;
}

// Handle case submission (send to n8n)
async function handleSubmitCase() {
    if (appState.documents.length === 0) {
        showError('Bitte laden Sie zuerst Dokumente hoch.');
        return;
    }

    // Show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Wird gesendet...';

    try {
        const response = await fetch('/api/process-case', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                caseNumber: appState.caseNumber,
                patientInfo: appState.patientInfo,
                messages: appState.messages,
                documents: appState.documents,
                medicalExtraction: appState.medicalExtraction
            })
        });

        const result = await response.json();

        if (result.success) {
            showSuccess('Fall erfolgreich an n8n übermittelt!');

            // Add confirmation message
            addMessage('✅ Fall wurde erfolgreich erstellt und an n8n übermittelt.', 'assistant');
        } else {
            showError(result.error || 'Fehler beim Senden an n8n');
        }
    } catch (error) {
        console.error('Submit error:', error);
        showError('Fehler beim Senden: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Vorgang erstellen';
    }
}

// Handle export
function handleExport() {
    // Generate PDF or export data
    const exportData = {
        caseNumber: appState.caseNumber,
        patientInfo: appState.patientInfo,
        medicalExtraction: appState.medicalExtraction,
        timestamp: new Date().toISOString()
    };

    // Create downloadable JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Fall-${appState.caseNumber}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSuccess('Fall-Zusammenfassung wurde exportiert!');
}

// Add message to chat
function addMessage(content, role) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    messageDiv.innerHTML = `
        <div class="message-content">${content}</div>
        <div class="message-time">${timeStr}</div>
    `;

    chatContainer.appendChild(messageDiv);

    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Utility functions
function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';

        // Scroll into view
        setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

function showLoading(message = 'Lädt...') {
    // Could implement a loading overlay here
    console.log('Loading:', message);
}

function hideLoading() {
    // Hide loading overlay
    console.log('Loading complete');
}

function showError(message) {
    addMessage(`❌ ${message}`, 'assistant');
}

function showSuccess(message) {
    addMessage(`✅ ${message}`, 'assistant');
}

// Auto-start demo conversation (optional)
function startDemoConversation() {
    setTimeout(() => {
        showElement('initialUserMessage');
    }, 1000);

    setTimeout(() => {
        showElement('documentSection');
        // Add mock document
        displayDocuments([
            { originalName: 'Arztbericht_Patient_2024.pdf', size: 2457 * 1024 }
        ]);
    }, 2000);

    setTimeout(() => {
        showElement('acceptanceMessage');
    }, 3000);

    setTimeout(() => {
        // Mock medical extraction data
        const mockData = {
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

        appState.medicalExtraction = mockData;
        displayMedicalExtraction(mockData);
        showElement('medicalExtraction');
    }, 5000);

    setTimeout(() => {
        showElement('insightMessage');
    }, 6500);

    setTimeout(() => {
        showElement('followUpMessage');
    }, 8000);

    setTimeout(() => {
        showElement('correctionMessage');
    }, 9500);

    setTimeout(() => {
        showElement('confirmationMessage');
    }, 11000);

    setTimeout(() => {
        showElement('exportQuestion');
        showElement('exportOptions');
    }, 12500);
}

// Uncomment to auto-start demo on load
// setTimeout(startDemoConversation, 500);
