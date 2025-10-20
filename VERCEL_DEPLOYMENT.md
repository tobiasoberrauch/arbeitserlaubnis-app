# Vercel Deployment Guide

## ✅ Bereit für Vercel Deployment!

Die Anwendung ist vollständig für Vercel Deployment vorbereitet.

## 🚀 Deployment-Schritte

### 1. Vercel Account & Projekt erstellen

```bash
# Vercel CLI installieren (optional)
npm i -g vercel

# In Vercel einloggen
vercel login
```

Oder nutze das Vercel Dashboard: https://vercel.com

### 2. Repository mit Vercel verbinden

**Option A: Via Vercel Dashboard (empfohlen)**

1. Gehe zu https://vercel.com/new
2. Import dein Git Repository
3. Vercel erkennt automatisch Next.js
4. Konfiguriere Environment Variables (siehe unten)
5. Deploy!

**Option B: Via CLI**

```bash
# Im Projektverzeichnis
vercel

# Folge den Prompts:
# - Set up and deploy? Yes
# - Which scope? Dein Account/Team
# - Link to existing project? No
# - Project name? arbeitserlaubnis-app
# - Directory? ./
# - Override settings? No
```

### 3. Environment Variables konfigurieren

Im Vercel Dashboard → Project Settings → Environment Variables:

**Erforderliche Variables:**

```bash
# GermanAI Configuration
GERMANAI_API_URL=https://germanai.tech/api/v1/chat/completions
GERMANAI_API_KEY=sk-2de5e362798141c6b9aa1b3708b967cf
GERMANAI_MODEL=qwen3:32b
```

**Optional:**

```bash
# Custom Model Settings
GERMANAI_TEMPERATURE=0.7
GERMANAI_MAX_TOKENS=2048
```

### 4. Build-Einstellungen

Vercel erkennt automatisch Next.js, aber hier sind die Einstellungen:

```yaml
# Build Command (automatisch erkannt)
npm run build

# Output Directory (automatisch erkannt)
.next

# Install Command (automatisch erkannt)
npm install

# Development Command (optional)
npm run dev
```

### 5. Deploy

```bash
# Production Deploy
vercel --prod

# Preview Deploy (für Testing)
vercel
```

## 📋 Pre-Deployment Checklist

- [x] ✅ Production Build erfolgreich (`npm run build`)
- [x] ✅ Alle Dependencies installiert
- [x] ✅ Environment Variables dokumentiert
- [x] ✅ API Routes funktionieren
- [x] ✅ GermanAI Integration getestet
- [x] ✅ TypeScript kompiliert ohne Fehler
- [x] ✅ Keine Ollama Dependencies mehr
- [x] ✅ next.config.js konfiguriert
- [x] ✅ Port-Konfiguration für Vercel optimiert

## 🔧 Vercel-spezifische Konfiguration

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
```

✅ Bereits konfiguriert!

### vercel.json (optional)

Falls du Custom Konfiguration brauchst:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

## 🌍 Nach dem Deployment

### URL-Zugriff

Nach dem Deployment erhältst du:
- **Production URL**: `https://dein-projekt.vercel.app`
- **Preview URLs**: `https://dein-projekt-git-branch.vercel.app`

### Testing

```bash
# Production URL testen
curl https://dein-projekt.vercel.app/api/chat/form \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"action": "languages"}'
```

### Custom Domain (optional)

1. Vercel Dashboard → Project → Settings → Domains
2. Add Domain: `deine-domain.de`
3. Folge den DNS-Anweisungen
4. Fertig!

## 🔒 Sicherheit

### Environment Variables

- ✅ Niemals API Keys in Code committen
- ✅ Nutze Vercel Environment Variables
- ✅ Verschiedene Keys für Production/Preview

### API Key Management

```bash
# Production Environment
GERMANAI_API_KEY=sk-prod-key-here

# Preview Environment
GERMANAI_API_KEY=sk-preview-key-here

# Development (local .env.local)
GERMANAI_API_KEY=sk-dev-key-here
```

## 📊 Monitoring

### Vercel Analytics

```bash
# Optional: Analytics aktivieren
npm install @vercel/analytics

# In app/layout.tsx:
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Logs anschauen

```bash
# Via CLI
vercel logs

# Via Dashboard
# Project → Deployments → Click on deployment → Logs
```

## 🐛 Troubleshooting

### Build Fehler

**Problem**: Build fails on Vercel

**Lösung**:
```bash
# Lokal testen
npm run build

# Wenn lokal erfolgreich, prüfe Environment Variables
```

### API Routes funktionieren nicht

**Problem**: `/api/chat/form` gibt 404

**Lösung**:
- Prüfe dass `app/api/chat/form/route.ts` committed ist
- Environment Variables in Vercel gesetzt?
- Redeploy: `vercel --prod`

### GermanAI Verbindung fehlschlägt

**Problem**: "Failed to process form request"

**Lösung**:
1. Prüfe `GERMANAI_API_KEY` in Vercel Environment Variables
2. Teste API Key:
   ```bash
   curl -X POST https://germanai.tech/api/v1/chat/completions \
     -H "Authorization: Bearer $GERMANAI_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model": "qwen3:32b", "messages": [{"role": "user", "content": "test"}]}'
   ```

### Function Timeout

**Problem**: Serverless function times out

**Lösung**:
```json
// vercel.json
{
  "functions": {
    "app/api/chat/form/route.ts": {
      "maxDuration": 60
    }
  }
}
```

## 🚀 Performance Optimierungen

### Edge Runtime (optional)

Für schnellere API Responses:

```typescript
// app/api/chat/form/route.ts
export const runtime = 'edge'; // oder 'nodejs'
```

**Hinweis**: Prüfe ob alle Dependencies Edge-kompatibel sind!

### Caching

```typescript
// In API Routes
export const revalidate = 60; // Cache for 60 seconds
```

## 📈 Scaling

Vercel skaliert automatisch:
- Serverless Functions: Automatisches Scaling
- Static Assets: Global CDN
- API Routes: Auto-scaling bis zu deinem Plan-Limit

## 💰 Kosten

**Hobby Plan** (kostenlos):
- ✅ 100 GB Bandwidth
- ✅ Unlimited Serverless Function Executions*
- ✅ Unlimited Sites
- ✅ Analytics included

*Fair use policy applies

**Pro Plan** ($20/month):
- 1 TB Bandwidth
- Advanced Analytics
- Team collaboration
- Custom Domains

## 📝 Deployment Commands Übersicht

```bash
# Production Deploy
vercel --prod

# Preview Deploy
vercel

# Logs anschauen
vercel logs

# Environment Variables setzen
vercel env add GERMANAI_API_KEY

# Projekt entfernen
vercel remove

# Status prüfen
vercel ls
```

## ✅ Erfolg prüfen

Nach dem Deployment:

1. **App öffnen**: `https://dein-projekt.vercel.app`
2. **Formular testen**: Sprache wählen, Namen eingeben
3. **Console checken**: F12 → Logs prüfen
4. **API testen**:
   ```bash
   curl https://dein-projekt.vercel.app/api/chat/form \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"action": "languages"}'
   ```

## 🎉 Fertig!

Deine App ist jetzt live auf Vercel!

**Nächste Schritte**:
- Custom Domain einrichten
- Analytics aktivieren
- Monitoring setup
- Production API Key setzen

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **GermanAI Support**: https://germanai.tech/support

**Bei Fragen zu dieser App**:
- Siehe `TROUBLESHOOTING.md`
- Siehe `GERMANAI_MIGRATION.md`
- Siehe `QUICK_START.md`
