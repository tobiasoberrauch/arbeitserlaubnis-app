# Development Scripts

This directory contains utility scripts for development and testing.

## Scripts

### `dev-check.sh`
**Comprehensive development environment validation**

Checks all prerequisites before starting the development server:
- ✅ Node.js and npm installation
- ✅ Dependencies (node_modules)
- ✅ Port availability (6010)
- ✅ Ollama installation and service status
- ✅ Ollama API connectivity (IPv4 127.0.0.1)
- ✅ Required models availability
- ✅ TypeScript and Next.js configuration
- ✅ Environment variables

**Usage:**
```bash
# Run directly
./scripts/dev-check.sh

# Or via Makefile
make dev-check
```

**Exit codes:**
- `0` - All checks passed
- `1` - Critical checks failed

### `test-ollama.sh`
**Ollama connection and functionality test**

Tests the exact Ollama setup used by the application:
- ✅ API connectivity
- ✅ Model availability
- ✅ Chat completion
- ✅ Node.js client compatibility
- ✅ IPv4 connection (127.0.0.1)

**Usage:**
```bash
# Run directly
./scripts/test-ollama.sh

# Or via Makefile
make test-ollama

# With custom configuration
OLLAMA_HOST=http://127.0.0.1:11434 OLLAMA_MODEL=qwen2.5:7b ./scripts/test-ollama.sh
```

**Environment variables:**
- `OLLAMA_HOST` - Ollama server URL (default: http://127.0.0.1:11434)
- `OLLAMA_MODEL` - Model to test with (default: qwen2.5:7b)

## Integration with Makefile

All scripts are integrated into the Makefile for easy access:

```bash
# Run pre-flight checks only
make dev-check

# Test Ollama setup
make test-ollama

# Run all checks and tests
make test-all

# Start dev server with automatic checks
make dev

# Start dev server without checks (faster)
make dev-force
```

## Troubleshooting

### Port 6010 in use
```bash
make kill-port
```

### Ollama not running
```bash
make ollama-start
# or
ollama serve
```

### Missing default model
```bash
ollama pull qwen2.5:7b
```

### IPv6 connection issues
The app is configured to use IPv4 (127.0.0.1) explicitly to avoid IPv6 connection issues. If you see `ECONNREFUSED ::1:11434`, ensure:
1. Ollama services are using IPv4 in code (already fixed in lib/*.ts)
2. Use `127.0.0.1` instead of `localhost` in configurations

## Adding New Scripts

When adding new scripts:
1. Place them in this directory
2. Make them executable: `chmod +x scripts/your-script.sh`
3. Add documentation here
4. Integrate into Makefile if appropriate
5. Use consistent exit codes (0 = success, 1 = failure)
6. Include helpful error messages

## Script Standards

All scripts should:
- Use `#!/bin/bash` shebang
- Set `set -e` for error handling
- Provide colored output (using ANSI codes)
- Display clear status messages
- Exit with appropriate codes
- Document required environment variables
- Be idempotent when possible
