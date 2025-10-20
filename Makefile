.PHONY: help install dev dev-check dev-force build start lint clean clean-all test test-germanai test-form test-all type-check format ollama-check ollama-start ollama-stop port-check kill-port

# Variables
PORT := 6010
NODE_MODULES := node_modules
BUILD_DIR := .next
SCRIPTS_DIR := scripts

# Default target - show help
help:
	@echo "📋 Available commands for Arbeitserlaubnis App"
	@echo ""
	@echo "🚀 Development:"
	@echo "  make install         - Install dependencies"
	@echo "  make dev             - Start development server with checks (port $(PORT))"
	@echo "  make dev-check       - Run all pre-flight checks without starting server"
	@echo "  make dev-force       - Start dev server without checks (skip validation)"
	@echo "  make build           - Build for production"
	@echo "  make start           - Start production server (port $(PORT))"
	@echo "  make lint            - Run ESLint"
	@echo "  make type-check      - Run TypeScript type checking"
	@echo ""
	@echo "🧪 Testing:"
	@echo "  make test            - Run unit tests (when configured)"
	@echo "  make test-germanai     - Test Ollama connection and setup"
	@echo "  make test-form       - Test form flow (question → validate → next)"
	@echo "  make test-all        - Run all checks and tests"
	@echo ""
	@echo "🧹 Cleanup:"
	@echo "  make clean           - Remove build artifacts (.next)"
	@echo "  make clean-all       - Remove build artifacts and node_modules"
	@echo ""
	@echo "🤖 GermanAI (AI Integration):"
	@echo "  make germanai-check    - Check if Ollama is running"
	@echo "  # Legacy: make ollama-start (now use germanai-check)    - Start Ollama service (macOS)"
	@echo "  # Legacy: make ollama-stop (deprecated)     - Stop Ollama service (macOS)"
	@echo ""
	@echo "🔧 Utilities:"
	@echo "  make port-check      - Check what's running on port $(PORT)"
	@echo "  make kill-port       - Kill process on port $(PORT)"
	@echo ""

# Installation
install:
	@echo "📦 Installing dependencies..."
	npm install

# Development with pre-flight checks
dev: dev-check
	@echo ""
	@echo "🚀 Starting development server on port $(PORT)..."
	@echo "   Press Ctrl+C to stop"
	@echo ""
	npm run dev

# Run all pre-flight checks
dev-check:
	@echo "🔍 Running pre-flight checks..."
	@bash $(SCRIPTS_DIR)/dev-check.sh

# Start dev server without checks (force)
dev-force:
	@echo "⚡ Starting development server WITHOUT checks..."
	@echo "🚀 Starting on port $(PORT)..."
	npm run dev

# Build
build:
	@echo "🏗️  Building for production..."
	npm run build

# Production
start:
	@echo "▶️  Starting production server on port $(PORT)..."
	npm run start

# Linting
lint:
	@echo "🔍 Running ESLint..."
	npm run lint

# Type checking
type-check:
	@echo "🔍 Running TypeScript type checker..."
	npx tsc --noEmit

# Format check (if you add prettier later)
format:
	@echo "💅 Formatting is not configured. Consider adding Prettier."
	@echo "Run: npm install -D prettier && npx prettier --write ."

# Testing
test:
	@echo "⚠️  No unit testing framework configured yet."
	@echo "Consider adding Jest or Vitest:"
	@echo "  npm install -D jest @testing-library/react @testing-library/jest-dom"

# Test Ollama connection
test-germanai:
	@echo "🤖 Testing Ollama connection..."
	@bash $(SCRIPTS_DIR)/test-germanai.sh

# Test form flow
test-form:
	@echo "🧪 Testing form flow..."
	@bash $(SCRIPTS_DIR)/test-form-flow.sh

# Run all tests and checks
test-all: dev-check test-germanai
	@echo ""
	@echo "✅ All tests completed!"
	@echo ""
	@echo "To test form flow (requires running dev server):"
	@echo "  make test-form"

# Cleanup
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf $(BUILD_DIR)

clean-all: clean
	@echo "🧹 Removing node_modules..."
	rm -rf $(NODE_MODULES)

# Ollama commands
ollama-check:
	@echo "🤖 Checking Ollama status..."
	@if curl -s http://127.0.0.1:11434/api/tags > /dev/null 2>&1; then \
		echo "✅ Ollama is running on 127.0.0.1:11434"; \
		MODEL_COUNT=$$(curl -s http://127.0.0.1:11434/api/tags | grep -o '"name"' | wc -l | tr -d ' '); \
		echo "   Found $$MODEL_COUNT models available"; \
	else \
		echo "❌ Ollama is not running. Start it with '# Legacy: make ollama-start (now use germanai-check)' or 'ollama serve'"; \
		echo "   Install from: https://ollama.ai"; \
		exit 1; \
	fi

ollama-start:
	@echo "🤖 Starting Ollama..."
	@if command -v ollama > /dev/null 2>&1; then \
		ollama serve & \
		echo "✅ Ollama started"; \
	else \
		echo "❌ Ollama not installed. Install from: https://ollama.ai"; \
		exit 1; \
	fi

ollama-stop:
	@echo "🤖 Stopping Ollama..."
	@pkill -f "ollama serve" || echo "Ollama was not running"

# Port utilities
port-check:
	@echo "🔍 Checking port $(PORT)..."
	@lsof -i :$(PORT) || echo "Port $(PORT) is free"

kill-port:
	@echo "🔪 Killing process on port $(PORT)..."
	@lsof -ti :$(PORT) | xargs kill -9 || echo "No process found on port $(PORT)"

# Quick commands
.PHONY: run prod
run: dev
prod: build start
