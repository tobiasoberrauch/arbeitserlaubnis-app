# Quick Start Guide

## 🚀 Getting Started

### 1. Start the Development Server

Simply run:

```bash
make dev
```

This will:
- ✅ Check all prerequisites automatically
- ✅ Verify Ollama is running
- ✅ Ensure port 6010 is available
- ✅ Start the Next.js dev server

The server will be available at: **http://localhost:6010**

### 2. Alternative Commands

```bash
# Start without checks (faster, but skip validation)
make dev-force

# Just run the checks without starting the server
make dev-check

# Test Ollama connection specifically
make test-ollama

# Run all checks and tests
make test-all
```

## 📋 What Was Fixed

### IPv4/IPv6 Connection Issue ✅

**Problem**: The app was trying to connect to Ollama using `localhost`, which Node.js resolves to IPv6 `::1`, but Ollama only listens on IPv4 `127.0.0.1`.

**Solution**: Updated both service files to explicitly use IPv4:
- `lib/ollamaFormService.ts` - Line 69
- `lib/ollamaService.ts` - Line 34
- `.env.local` - Updated configuration

```typescript
// Changed from:
host: process.env.OLLAMA_HOST || 'http://localhost:11434'

// To:
host: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434'
```

## 🛠️ New Development Tools

### Makefile Commands

All common operations are now available via `make`:

```bash
make help              # Show all available commands
make dev               # Start dev server with checks
make dev-check         # Run pre-flight checks only
make dev-force         # Start dev without checks
make build             # Build for production
make lint              # Run ESLint
make type-check        # TypeScript validation
make test-ollama       # Test Ollama setup
make test-all          # Run all checks
make clean             # Remove build artifacts
make ollama-check      # Verify Ollama is running
make port-check        # Check port 6010 status
make kill-port         # Free port 6010
```

### Validation Scripts

Located in `scripts/`:

#### `dev-check.sh` - Comprehensive Environment Check
Validates:
- Node.js and npm installation
- Dependencies (node_modules)
- Port availability
- Ollama installation and status
- Ollama API connectivity (IPv4)
- Model availability
- Configuration files

#### `test-ollama.sh` - Ollama Connection Test
Tests:
- API connectivity
- Model availability
- Chat completion
- Node.js client compatibility

Run them directly:
```bash
./scripts/dev-check.sh
./scripts/test-ollama.sh
```

## ✅ Verification

Your setup is working if you see:

```
✅ All critical checks passed!
🚀 Ready to start development server
```

## 🐛 Troubleshooting

### Port 6010 already in use
```bash
make kill-port
```

### Ollama not running
```bash
make ollama-start
# or
ollama serve
```

### Missing qwen2.5:7b model
```bash
ollama pull qwen2.5:7b
```

### Connection still fails
1. Verify Ollama is on IPv4:
   ```bash
   curl http://127.0.0.1:11434/api/tags
   ```

2. Check .env.local uses IPv4:
   ```bash
   cat .env.local
   # Should show: OLLAMA_HOST=http://127.0.0.1:11434
   ```

3. Restart dev server:
   ```bash
   make kill-port
   make dev
   ```

## 📚 Documentation

- **CLAUDE.md** - Complete codebase guide for Claude Code
- **Makefile** - All available commands with documentation
- **scripts/README.md** - Detailed script documentation
- **README.md** - Original project README

## 🎯 Next Steps

1. Start the dev server: `make dev`
2. Open http://localhost:6010
3. Select a language
4. Start filling the work permit form with AI assistance

## 💡 Tips

- Use `make dev-force` when you know everything is set up and want to start quickly
- Run `make test-all` before committing to ensure everything works
- The app automatically checks Ollama on every request, so make sure it's running
- All Ollama communication uses IPv4 (127.0.0.1) to avoid connection issues

---

**All fixed and ready to go!** 🎉

Just run `make dev` and start developing.
