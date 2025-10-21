# AI Provider Wechseln

Die App unterstützt jetzt flexible AI Provider! Du kannst einfach zwischen GermanAI und OpenAI wechseln.

## Schnell zwischen GermanAI und OpenAI wechseln

### Option 1: GermanAI (Standard)

In `.env.local`:
```bash
AI_PROVIDER=germanai
GERMANAI_API_URL=https://germanai.tech/api/v1/chat/completions
GERMANAI_API_KEY=sk-2de5e362798141c6b9aa1b3708b967cf
GERMANAI_MODEL=qwen3:32b
```

### Option 2: OpenAI

In `.env.local`:
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini
```

## Technische Details

Die App verwendet ein **Provider Pattern** mit folgenden Komponenten:

- `lib/aiService.ts` - Interface für alle AI Services
- `lib/germanAIService.ts` - GermanAI Implementation
- `lib/openAIService.ts` - OpenAI Implementation
- `lib/aiProvider.ts` - Factory zur Auswahl des Providers
- `lib/germanAIFormService.ts` - Verwendet den ausgewählten Provider automatisch

## Verfügbare Modelle

### GermanAI Modelle:
- `qwen3:32b` (Standard - beste Balance)
- `qwen3:14b`
- `qwen2.5:7b`
- `llama3.3:70b`

### OpenAI Modelle:
- `gpt-4o-mini` (Standard - günstig, schnell)
- `gpt-4o` (Beste Qualität)
- `gpt-4-turbo`
- `gpt-3.5-turbo` (Am günstigsten)

## Kosten Vergleich (ca.)

### GermanAI:
- Kostenlos / sehr günstig
- Selbst-gehostet möglich
- EU-Server (DSGVO-konform)

### OpenAI:
- gpt-4o-mini: ~$0.15 / 1M tokens input, ~$0.60 / 1M tokens output
- gpt-4o: ~$5 / 1M tokens input, ~$15 / 1M tokens output
- Gehostet in USA

## Wechseln (3 Schritte):

1. **`.env.local` editieren**:
   ```bash
   # Von GermanAI zu OpenAI:
   AI_PROVIDER=openai
   OPENAI_API_KEY=dein-key-hier
   ```

2. **Server neu starten**:
   ```bash
   npm run dev
   ```

3. **Fertig!** Die App verwendet jetzt OpenAI.

## Zurück zu GermanAI:

```bash
# In .env.local:
AI_PROVIDER=germanai
```

Server neu starten - fertig!

## Beide parallel nutzen:

Du kannst beide API-Keys in `.env.local` haben und nur `AI_PROVIDER` ändern:

```bash
# Beide Keys konfiguriert
AI_PROVIDER=germanai  # <- Ändere nur diese Zeile

GERMANAI_API_KEY=sk-xxxx
OPENAI_API_KEY=sk-yyyy
```

Wechsel zwischen `germanai` und `openai` nach Bedarf!
