# Ollama Integration - Arbeitserlaubnis App

## 🚀 Features

- **Mehrsprachiger Chat**: Unterstützt Deutsch, Englisch, Türkisch, Arabisch, Polnisch und Ukrainisch
- **Lokale KI**: Nutzt Ollama mit dem qwen2.5:7b Modell (empfohlen)
- **Streaming Responses**: Echtzeitantworten mit Stream-Support
- **Modellauswahl**: Wähle zwischen verschiedenen lokalen Modellen
- **Temperature Control**: Anpassbare Kreativität der Antworten

## 📋 Voraussetzungen

1. **Ollama installiert und läuft**
   ```bash
   # Prüfen ob Ollama läuft
   curl http://localhost:11434/api/tags
   ```

2. **Empfohlenes Modell installiert**
   ```bash
   ollama pull qwen2.5:7b
   ```

## 🎯 Verwendung

1. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

2. **App öffnen**
   - Gehe zu http://localhost:3001
   - Klicke auf "Ollama Chat" Button (unten rechts)

3. **Chat-Interface**
   - Wähle deine Sprache
   - Wähle ein Modell aus deiner Ollama-Installation
   - Stelle Fragen zur Arbeitserlaubnis in deiner Sprache

## 🛠️ Konfiguration

### Umgebungsvariablen (.env.local)
```env
OLLAMA_HOST=http://localhost:11434  # Standard Ollama Host
```

### Verfügbare Modelle

Die App zeigt automatisch alle installierten Ollama-Modelle an. Empfohlen:

- **qwen2.5:7b** - Beste Mehrsprachigkeit (Standard)
- **mistral:latest** - Gute Alternative
- **llama3:8b** - Starke Performance

### API Endpoints

- `GET /api/ollama` - Status und Modellliste
- `POST /api/ollama` - Chat-Anfragen (mit/ohne Streaming)

## 🌐 Unterstützte Sprachen

- 🇩🇪 Deutsch
- 🇬🇧 Englisch  
- 🇹🇷 Türkisch
- 🇸🇦 Arabisch
- 🇵🇱 Polnisch
- 🇺🇦 Ukrainisch

## 📁 Projektstruktur

```
arbeitserlaubnis-app/
├── lib/
│   └── ollamaService.ts        # Ollama Service Layer
├── app/
│   └── api/
│       └── ollama/
│           └── route.ts         # API Endpoint
├── components/
│   └── OllamaChatInterface.tsx # Chat UI Komponente
└── app/
    └── page.tsx                 # Integration in Hauptseite
```

## 🔧 Technische Details

### Service Layer (`lib/ollamaService.ts`)
- Verbindung zu Ollama API
- Streaming und normale Chat-Funktionen
- Sprachspezifische System-Prompts
- Modell-Management

### API Route (`app/api/ollama/route.ts`)
- Next.js Route Handler
- Server-Sent Events für Streaming
- Error Handling

### Frontend (`components/OllamaChatInterface.tsx`)
- React Chat-Interface
- Real-time Streaming Display
- Modell- und Temperature-Einstellungen
- Mehrsprachige UI

## 🐛 Fehlerbehebung

**Ollama nicht erreichbar:**
```bash
# Ollama neustarten
ollama serve

# Status prüfen
curl http://localhost:11434/api/tags
```

**Modell nicht gefunden:**
```bash
# Verfügbare Modelle anzeigen
ollama list

# Neues Modell installieren
ollama pull qwen2.5:7b
```

**Port-Konflikt:**
- Die App nutzt Port 3001 (falls 3000 belegt)
- Ollama Standard-Port: 11434

## 📈 Performance-Tipps

1. **Modellgröße**: Kleinere Modelle (7B) für schnellere Antworten
2. **Temperature**: Niedrigere Werte (0.3-0.5) für konsistentere Antworten
3. **Streaming**: Aktiviert für bessere UX bei längeren Antworten

## 🔐 Sicherheit

- Alle Anfragen laufen lokal
- Keine Daten verlassen deinen Computer
- Ollama läuft im lokalen Netzwerk

## 🚀 Weitere Entwicklung

Mögliche Erweiterungen:
- [ ] Chat-Historie speichern
- [ ] Export von Gesprächen
- [ ] Fine-tuning für Arbeitserlaubnis-Fragen
- [ ] Voice Input/Output
- [ ] Dokumenten-Upload für Kontext