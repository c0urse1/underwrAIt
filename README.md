# underwrAIt - Medical Risk Assessment Chat Interface

Ein KI-gestütztes Chat-Interface für medizinische Risikoprüfung mit n8n Webhook-Integration.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

## 📋 Übersicht

underwrAIt ist eine moderne Web-Anwendung für medizinische Risikoprüfung, die es ermöglicht:
- 💬 Interaktive Chat-Kommunikation mit einem KI-Assistenten (RiskAssist)
- 📄 Upload und Verarbeitung medizinischer Dokumente (PDF, DOCX, Bilder)
- 🔬 Automatische Extraktion von Diagnosen, Medikationen und Laborwerten
- 🔗 Integration mit n8n über Webhooks für Workflow-Automatisierung
- 📊 Übersichtliche Darstellung medizinischer Daten
- 💾 Export von Fall-Zusammenfassungen

## 🚀 Schnellstart

### Voraussetzungen

- Node.js (Version 16 oder höher)
- npm oder yarn
- (Optional) n8n Installation für Webhook-Integration

### Installation

1. Repository klonen:
```bash
git clone <repository-url>
cd underwrAIt
```

2. Dependencies installieren:
```bash
npm install
```

3. Umgebungsvariablen konfigurieren:
```bash
cp .env.example .env
```

Bearbeiten Sie die `.env` Datei und setzen Sie Ihre n8n Webhook URL:
```
N8N_WEBHOOK_URL=http://your-n8n-instance.com/webhook/medical-assessment
```

4. Server starten:
```bash
npm start
```

Die Anwendung läuft nun auf: `http://localhost:3000`

### Entwicklungsmodus

Für automatisches Neuladen bei Code-Änderungen:
```bash
npm run dev
```

## 🏗️ Projektstruktur

```
underwrAIt/
├── public/                 # Frontend-Dateien
│   ├── index.html         # Haupt-HTML-Interface
│   ├── styles.css         # Styling
│   └── app.js             # Frontend-Logik
├── uploads/               # Hochgeladene Dokumente (auto-generiert)
├── server.js              # Backend-Server mit Express
├── package.json           # Projekt-Dependencies
├── .env.example           # Beispiel Umgebungsvariablen
└── README.md              # Diese Datei
```

## 🔧 Funktionen

### 1. Chat-Interface
- Interaktive Kommunikation mit RiskAssist
- Echtzeit-Messaging
- Automatische Zeitstempel
- Responsive Design

### 2. Dokument-Upload
- Unterstützte Formate: PDF, DOC, DOCX, JPG, JPEG, PNG
- Multi-File-Upload (bis zu 5 Dateien)
- Max. Dateigröße: 10MB pro Datei
- Drag & Drop Support (optional erweiterbar)

### 3. Medizinische Extraktion
Automatische Erkennung und Strukturierung von:
- **Diagnosen**: Mit Status und Severity-Level
- **Medikation**: Name, Dosierung, Behandlungszeitraum
- **Laborwerte**: Werte mit Einheiten und Status-Indikatoren

### 4. n8n Webhook Integration
Sendet strukturierte Daten an n8n:
```json
{
  "caseNumber": "UW-2024-00042",
  "patientInfo": { ... },
  "messages": [ ... ],
  "documents": [ ... ],
  "medicalExtraction": { ... },
  "timestamp": "2024-11-12T14:32:00.000Z"
}
```

### 5. Export-Funktionen
- JSON-Export der Fall-Zusammenfassung
- Vorbereitung für PDF-Export
- Zeitersparnis-Tracking (Manual vs. Automatisch)

## 🔌 API-Endpunkte

### POST `/api/upload`
Upload medizinischer Dokumente.

**Request**: multipart/form-data mit `documents` Feld

**Response**:
```json
{
  "success": true,
  "message": "3 Dokument(e) erfolgreich hochgeladen",
  "files": [...]
}
```

### POST `/api/process-case`
Sendet Fall-Daten an n8n Webhook.

**Request**:
```json
{
  "caseNumber": "UW-2024-00042",
  "patientInfo": { ... },
  "messages": [ ... ],
  "documents": [ ... ],
  "medicalExtraction": { ... }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Fall erfolgreich an n8n übermittelt",
  "webhookResponse": { ... }
}
```

### POST `/api/extract-medical-data`
Extrahiert medizinische Daten aus Dokumenten (aktuell Mock-Implementation).

**Request**:
```json
{
  "documents": [...]
}
```

**Response**:
```json
{
  "success": true,
  "extractedData": {
    "diagnosen": [...],
    "medikation": [...],
    "laborwerte": [...]
  }
}
```

### GET `/api/health`
Health-Check Endpunkt.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-11-12T14:32:00.000Z",
  "webhookUrl": "..."
}
```

## 🔐 n8n Webhook Setup

### 1. n8n Workflow erstellen

1. Erstellen Sie einen neuen Workflow in n8n
2. Fügen Sie einen **Webhook** Node hinzu
3. Konfigurieren Sie den Webhook:
   - Method: `POST`
   - Path: `medical-assessment`
   - Response Mode: `On Response`

### 2. Datenverarbeitung

Beispiel n8n Workflow:
```
Webhook → JSON Parser → Data Processing → Database/Email/etc.
```

### 3. Webhook URL kopieren

Die Webhook URL hat normalerweise das Format:
```
http://your-n8n-instance.com/webhook/medical-assessment
```

Oder für n8n Cloud:
```
https://your-instance.app.n8n.cloud/webhook/medical-assessment
```

### 4. In underwrAIt konfigurieren

Setzen Sie die URL in der `.env` Datei:
```
N8N_WEBHOOK_URL=https://your-instance.app.n8n.cloud/webhook/medical-assessment
```

## 🎨 Anpassung

### Design anpassen
Bearbeiten Sie `/public/styles.css` und ändern Sie die CSS-Variablen:
```css
:root {
    --primary-color: #FF6B35;
    --secondary-color: #4A5F7F;
    /* ... weitere Variablen */
}
```

### Medizinische Extraktion erweitern
Die Mock-Implementation in `server.js` kann durch echte KI/ML-Modelle ersetzt werden:
```javascript
// In server.js, Route: /api/extract-medical-data
// Ersetzen Sie die Mock-Daten durch echte OCR/NLP Verarbeitung
```

### Weitere Dokumenttypen unterstützen
Erweitern Sie den `fileFilter` in `server.js`:
```javascript
const allowedTypes = /pdf|doc|docx|jpg|jpeg|png|xml|txt/;
```

## 🧪 Testing

### Manuelle Tests
1. Starten Sie den Server: `npm start`
2. Öffnen Sie `http://localhost:3000`
3. Testen Sie die verschiedenen Funktionen:
   - Nachrichten senden
   - Dokumente hochladen
   - Fall-Submission

### Demo-Modus aktivieren
Kommentieren Sie in `/public/app.js` die letzte Zeile ein:
```javascript
// Uncomment to auto-start demo on load
setTimeout(startDemoConversation, 500);
```

Dies startet automatisch eine Demo-Konversation beim Laden der Seite.

## 📦 Deployment

### Heroku
```bash
# Heroku CLI installiert?
heroku create your-app-name
git push heroku main
heroku config:set N8N_WEBHOOK_URL=your_webhook_url
```

### Docker
```dockerfile
# Erstellen Sie eine Dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t underwrait .
docker run -p 3000:3000 -e N8N_WEBHOOK_URL=your_url underwrait
```

### VPS/Cloud Server
1. Code auf Server hochladen
2. Dependencies installieren: `npm install`
3. Environment Variables setzen
4. Mit PM2 oder forever starten:
```bash
npm install -g pm2
pm2 start server.js --name underwrait
pm2 save
pm2 startup
```

## 🐛 Troubleshooting

### "n8n Webhook nicht erreichbar"
- Prüfen Sie, ob n8n läuft
- Verifizieren Sie die Webhook URL in `.env`
- Testen Sie die Webhook URL direkt mit curl:
  ```bash
  curl -X POST http://your-n8n-instance/webhook/medical-assessment \
    -H "Content-Type: application/json" \
    -d '{"test": "data"}'
  ```

### "Fehler beim Hochladen der Dateien"
- Prüfen Sie Dateigröße (max 10MB)
- Prüfen Sie Dateiformat (nur PDF, DOCX, JPG, PNG)
- Prüfen Sie Schreibrechte für `/uploads` Verzeichnis

### Port bereits in Verwendung
Ändern Sie den Port in `.env`:
```
PORT=3001
```

## 🤝 Contributing

Contributions sind willkommen! Bitte erstellen Sie einen Pull Request oder öffnen Sie ein Issue.

## 📄 Lizenz

ISC License

## 📞 Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue im Repository.

---

**Made with ❤️ for medical risk assessment automation**