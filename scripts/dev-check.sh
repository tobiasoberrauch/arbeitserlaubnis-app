#!/bin/bash

# Development Environment Check Script
# This script validates all prerequisites before starting the dev server

set -e

echo "🔍 Development Environment Check"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PORT=6010
OLLAMA_PORT=11434
OLLAMA_HOST="http://127.0.0.1:${OLLAMA_PORT}"

# Track overall status
ALL_CHECKS_PASSED=true

# Function to print status
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "OK" ]; then
        echo -e "${GREEN}✅ ${message}${NC}"
    elif [ "$status" = "WARN" ]; then
        echo -e "${YELLOW}⚠️  ${message}${NC}"
    else
        echo -e "${RED}❌ ${message}${NC}"
        ALL_CHECKS_PASSED=false
    fi
}

# 1. Check Node.js
echo "1️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_status "OK" "Node.js installed: ${NODE_VERSION}"
else
    print_status "FAIL" "Node.js not found. Please install Node.js"
    exit 1
fi
echo ""

# 2. Check npm
echo "2️⃣  Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_status "OK" "npm installed: ${NPM_VERSION}"
else
    print_status "FAIL" "npm not found"
    exit 1
fi
echo ""

# 3. Check node_modules
echo "3️⃣  Checking dependencies..."
if [ -d "node_modules" ]; then
    print_status "OK" "node_modules directory exists"
else
    print_status "WARN" "node_modules not found. Running npm install..."
    npm install
    print_status "OK" "Dependencies installed"
fi
echo ""

# 4. Check if port 6010 is free
echo "4️⃣  Checking port ${PORT}..."
if lsof -Pi :${PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
    PID=$(lsof -ti :${PORT})
    print_status "WARN" "Port ${PORT} is already in use by process ${PID}"
    echo "   Run: make kill-port to free the port"
else
    print_status "OK" "Port ${PORT} is available"
fi
echo ""

# 5. Check Ollama installation
echo "5️⃣  Checking Ollama installation..."
if command -v ollama &> /dev/null; then
    OLLAMA_VERSION=$(ollama --version 2>&1 | head -n 1 || echo "unknown")
    print_status "OK" "Ollama installed: ${OLLAMA_VERSION}"
else
    print_status "FAIL" "Ollama not found. Install from: https://ollama.ai"
    ALL_CHECKS_PASSED=false
fi
echo ""

# 6. Check if Ollama is running
echo "6️⃣  Checking Ollama service..."
if curl -s "${OLLAMA_HOST}/api/tags" > /dev/null 2>&1; then
    print_status "OK" "Ollama is running on ${OLLAMA_HOST}"

    # Get available models
    MODELS=$(curl -s "${OLLAMA_HOST}/api/tags" | grep -o '"name":"[^"]*"' | cut -d'"' -f4 | head -5)
    if [ ! -z "$MODELS" ]; then
        echo "   📦 Available models:"
        echo "$MODELS" | while read model; do
            echo "      - $model"
        done

        # Check if default model exists
        if echo "$MODELS" | grep -q "qwen2.5:7b"; then
            print_status "OK" "Default model 'qwen2.5:7b' is available"
        else
            print_status "WARN" "Default model 'qwen2.5:7b' not found"
            echo "   Download it with: ollama pull qwen2.5:7b"
        fi
    fi
else
    print_status "FAIL" "Ollama is not running"
    echo "   Start it with: ollama serve"
    echo "   Or use: make ollama-start"
    ALL_CHECKS_PASSED=false
fi
echo ""

# 7. Test Ollama connection with exact same config as app
echo "7️⃣  Testing Ollama connection (IPv4)..."
if curl -s -X POST "${OLLAMA_HOST}/api/tags" > /dev/null 2>&1; then
    print_status "OK" "Ollama API responding on IPv4 (127.0.0.1)"
else
    print_status "FAIL" "Cannot connect to Ollama on IPv4"
    ALL_CHECKS_PASSED=false
fi
echo ""

# 8. Check TypeScript configuration
echo "8️⃣  Checking TypeScript..."
if [ -f "tsconfig.json" ]; then
    print_status "OK" "tsconfig.json exists"
else
    print_status "WARN" "tsconfig.json not found"
fi
echo ""

# 9. Check Next.js configuration
echo "9️⃣  Checking Next.js..."
if [ -f "next.config.js" ] || [ -f "next.config.mjs" ]; then
    print_status "OK" "Next.js config exists"
else
    print_status "WARN" "Next.js config not found"
fi
echo ""

# 10. Check environment variables
echo "🔟 Checking environment variables..."
if [ -f ".env.local" ]; then
    print_status "OK" ".env.local exists"
    if grep -q "OLLAMA_HOST" .env.local 2>/dev/null; then
        OLLAMA_HOST_ENV=$(grep "OLLAMA_HOST" .env.local | cut -d'=' -f2)
        echo "   OLLAMA_HOST=${OLLAMA_HOST_ENV}"
    fi
else
    print_status "WARN" ".env.local not found (optional)"
    echo "   Using default: OLLAMA_HOST=http://127.0.0.1:11434"
fi
echo ""

# Summary
echo "================================="
echo "📊 Summary"
echo "================================="

if [ "$ALL_CHECKS_PASSED" = true ]; then
    echo -e "${GREEN}✅ All critical checks passed!${NC}"
    echo ""
    echo -e "${BLUE}🚀 Ready to start development server${NC}"
    echo ""
    echo "Run one of these commands:"
    echo "  • make dev"
    echo "  • npm run dev"
    echo ""
    echo "Server will start on: http://localhost:${PORT}"
    exit 0
else
    echo -e "${RED}❌ Some checks failed${NC}"
    echo ""
    echo "Please fix the issues above before running the dev server"
    exit 1
fi
