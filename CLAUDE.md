# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 application that helps non-German speakers fill out German work permit forms ("Erklärung zum Beschäftigungsverhältnis"). The app provides a multilingual chatbot interface powered by Ollama for local AI assistance, with support for 8 languages and multiple export formats.

## Development Commands

### Using Makefile (Recommended)

```bash
# Show all available commands
make help

# Development
make install         # Install dependencies
make dev             # Start dev server with pre-flight checks (port 6010)
make dev-check       # Run all checks without starting server
make dev-force       # Start dev server without checks (faster)
make build           # Build for production
make start           # Start production server (port 6010)
make lint            # Run ESLint
make type-check      # Run TypeScript type checking

# Testing
make test-ollama     # Test Ollama connection and setup
make test-all        # Run all checks and tests
make test            # Run unit tests (when configured)

# Cleanup
make clean           # Remove build artifacts (.next)
make clean-all       # Remove build artifacts and node_modules

# Ollama (AI Integration)
make ollama-check    # Check if Ollama is running
make ollama-start    # Start Ollama service
make ollama-stop     # Stop Ollama service

# Utilities
make port-check      # Check what's running on port 6010
make kill-port       # Kill process on port 6010
```

### Using npm directly

```bash
npm run dev          # Development server (runs on port 6010)
npm run build        # Production build
npm run start        # Start production server (port 6010)
npm run lint         # Run linting
```

### Using Scripts Directly

```bash
# Comprehensive environment check
./scripts/dev-check.sh

# Test Ollama connection
./scripts/test-ollama.sh
```

**Note**: This project uses **port 6010** for both dev and production servers, not the default Next.js port 3000.

### Pre-flight Checks

When running `make dev`, the following checks are automatically performed:
- ✅ Node.js and npm installation
- ✅ Dependencies (node_modules)
- ✅ Port 6010 availability
- ✅ Ollama installation and running status
- ✅ Ollama API connectivity (IPv4)
- ✅ Default model (qwen2.5:7b) availability
- ✅ Project configuration files

Use `make dev-force` to skip these checks and start immediately.

## Architecture

### Tech Stack
- **Framework**: Next.js 14.2.31 with App Router (TypeScript)
- **Styling**: Tailwind CSS with custom CSS variables in `styles/globals.css`
- **Forms**: React Hook Form for state management and validation
- **AI Integration**: Ollama (local LLM) via API routes at `/app/api/ollama/*`
- **Document Generation**:
  - PDF: `pdf-lib` and `jsPDF` with character transliteration
  - Word: `docx` library with Unicode cleaning
  - Excel: `exceljs` for spreadsheet export
  - JSON: Native export for data backup

### Core Flow
1. **Landing Page** (`app/page.tsx`) → Language selection
2. **Form Interaction** (`components/ChatbotInterface.tsx`, `components/OllamaFormChat.tsx`) → AI-guided field collection
3. **Preview** (`components/FormPreview.tsx`) → Review filled data
4. **Export** (`components/ExportModal.tsx`, `lib/exportService.ts`) → Generate PDF/Word/Excel/JSON

### Key Directories

**`/app/api/ollama/`**: Backend API routes for AI features
- `route.ts` - Main chat endpoint
- `form/route.ts` - Form data processing
- `translate/route.ts` - Translation service

**`/components/`**: React UI components (mix of client and server components)
- Use `'use client'` directive for interactive components
- `ClientLayout.tsx` provides language context to the app
- `WorkPermitForm.tsx` is the core form component (25+ fields)

**`/lib/`**: Business logic and utilities
- `i18n.ts` - Internationalization setup (8 languages)
- `formQuestions.ts` - Complete form field definitions
- `exportService.ts` - Multi-format export logic
- `ollamaService.ts` & `ollamaFormService.ts` - AI integration

**`/locales/`**: Translation files for all supported languages
- Supported: German (de), English (en), Turkish (tr), Arabic (ar), Polish (pl), Ukrainian (uk), Spanish (es), French (fr)
- RTL support configured for Arabic

### State Management
- **Global Language State**: React Context via `ClientLayout` component
- **Form State**: React Hook Form (`useForm` hook)
- **Component State**: Standard React `useState` for UI interactions

## Important Implementation Details

### Internationalization
- Language selection persists through context
- All UI strings must have translations in `/locales/{lang}/common.json`
- Access translations via `useLanguage()` hook
- RTL support is enabled for Arabic

### Export System
The export system (`lib/exportService.ts`) handles character encoding carefully:
- **PDF**: Uses transliteration to convert special characters (e.g., ä → ae)
- **Word**: Cleans Unicode characters while preserving readability
- **Excel**: Groups fields into logical sections with formatted headers
- **JSON**: Raw data export for backup/transfer

All exports include:
- Multilingual field labels
- Timestamp-based filenames
- Organized field groupings (personal info, employment, qualifications, etc.)

### Form Fields Structure
25+ form fields organized in logical sections:
1. Personal Information (name, DOB, nationality, passport)
2. Contact Information (address, phone, email)
3. Employment Details (employer, position, salary, duration)
4. Qualifications (experience, skills, German language level)
5. Additional Information (criminal record, insurance, accommodation)

See `lib/formQuestions.ts` for complete field definitions.

### Ollama AI Integration
- Local AI inference (no external API keys required for basic features)
- Streaming support for real-time chat responses
- Form-specific prompts for guided data collection
- Translation assistance for multilingual users
- Endpoints are in `/app/api/ollama/*`

### Client vs Server Components
- **Server Components** (default): Used for static content and initial rendering
- **Client Components** (`'use client'`): Required for:
  - Interactive forms (ChatbotInterface, WorkPermitForm)
  - State management (ClientLayout)
  - Browser APIs (ExportModal, LandingPage)
  - Hooks (useLanguage, useForm)

### TypeScript Configuration
- Strict mode enabled
- Path alias `@/*` maps to project root
- Target: ES5 for broad compatibility
- JSX preserved for Next.js compilation

## Common Development Tasks

### Adding a New Language
1. Create `/locales/{lang}/common.json` with all translation keys
2. Add language option to `components/LanguageSelector.tsx`
3. Update `lib/i18n.ts` if RTL support needed
4. Test all UI flows in the new language

### Adding a New Form Field
1. Define field in `lib/formQuestions.ts`
2. Add to form interface in `components/WorkPermitForm.tsx`
3. Update translations in all `/locales/{lang}/common.json` files
4. Add field to export logic in `lib/exportService.ts`
5. Update FormPreview display if needed

### Modifying Export Formats
- **PDF**: Edit `lib/pdfGenerator.ts` and `lib/exportService.ts`
- **Word/Excel/JSON**: Edit `lib/exportService.ts`
- Test character encoding with non-Latin scripts (Arabic, Ukrainian)

## Known Constraints

- Application uses **port 6010** (not 3000)
- Ollama must be running locally for AI features to work
- PDF generation uses transliteration - special characters become ASCII equivalents
- No testing framework currently configured
- Single main branch workflow

## Recent Changes

Last commit: "Fix export and chat issues"
- Modified: layout.tsx, page.tsx, Header.tsx, exportService.ts
- Focus areas: Export functionality and chat interface stability
