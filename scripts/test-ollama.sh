#!/bin/bash

# Ollama Connection Test Script
# Tests the exact connection setup used by the application

set -e

echo "🤖 Ollama Connection Test"
echo "=========================="
echo ""

# Configuration
OLLAMA_HOST="${OLLAMA_HOST:-http://127.0.0.1:11434}"
MODEL="${OLLAMA_MODEL:-qwen2.5:7b}"

echo "Configuration:"
echo "  Host: ${OLLAMA_HOST}"
echo "  Model: ${MODEL}"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test 1: Check if Ollama is reachable
echo "1. Testing Ollama API connectivity..."
if curl -s -f "${OLLAMA_HOST}/api/tags" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Ollama API is reachable${NC}"
else
    echo -e "${RED}❌ Cannot reach Ollama API${NC}"
    echo "Make sure Ollama is running: ollama serve"
    exit 1
fi
echo ""

# Test 2: List available models
echo "2. Listing available models..."
MODELS_JSON=$(curl -s "${OLLAMA_HOST}/api/tags")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully retrieved model list${NC}"
    echo ""
    echo "Available models:"
    echo "$MODELS_JSON" | grep -o '"name":"[^"]*"' | cut -d'"' -f4 | while read model; do
        echo "  • $model"
    done
else
    echo -e "${RED}❌ Failed to retrieve models${NC}"
    exit 1
fi
echo ""

# Test 3: Check if default model exists
echo "3. Checking for model: ${MODEL}..."
if echo "$MODELS_JSON" | grep -q "\"name\":\"${MODEL}\""; then
    echo -e "${GREEN}✅ Model '${MODEL}' is available${NC}"
else
    echo -e "${YELLOW}⚠️  Model '${MODEL}' not found${NC}"
    echo "Download it with: ollama pull ${MODEL}"
    echo ""
    read -p "Download ${MODEL} now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ollama pull "${MODEL}"
    else
        echo "Continuing without downloading..."
    fi
fi
echo ""

# Test 4: Test simple chat completion
echo "4. Testing chat completion..."
TEST_RESPONSE=$(curl -s -X POST "${OLLAMA_HOST}/api/chat" \
    -H "Content-Type: application/json" \
    -d "{
        \"model\": \"${MODEL}\",
        \"messages\": [{\"role\": \"user\", \"content\": \"Say 'OK' if you receive this.\"}],
        \"stream\": false
    }" 2>&1)

if [ $? -eq 0 ] && echo "$TEST_RESPONSE" | grep -q "message"; then
    echo -e "${GREEN}✅ Chat completion successful${NC}"
    RESPONSE_TEXT=$(echo "$TEST_RESPONSE" | grep -o '"content":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "   Response: ${RESPONSE_TEXT}"
else
    echo -e "${RED}❌ Chat completion failed${NC}"
    echo "   Response: ${TEST_RESPONSE}"
    exit 1
fi
echo ""

# Test 5: Test with Node.js (simulate app behavior)
echo "5. Testing Node.js Ollama client..."
cat > /tmp/test-ollama-node.js << 'EOF'
const { Ollama } = require('ollama');

const ollama = new Ollama({
    host: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434'
});

async function test() {
    try {
        console.log('Testing Ollama connection from Node.js...');
        const models = await ollama.list();
        console.log('✅ Successfully connected to Ollama');
        console.log(`   Found ${models.models.length} models`);

        // Test chat
        console.log('\nTesting chat...');
        const response = await ollama.chat({
            model: process.env.OLLAMA_MODEL || 'qwen2.5:7b',
            messages: [{ role: 'user', content: 'Say OK' }],
        });
        console.log('✅ Chat successful');
        console.log(`   Response: ${response.message.content.substring(0, 50)}...`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.cause) {
            console.error('   Cause:', error.cause.message);
        }
        process.exit(1);
    }
}

test();
EOF

if [ -f "node_modules/ollama/dist/index.js" ]; then
    OLLAMA_HOST="${OLLAMA_HOST}" OLLAMA_MODEL="${MODEL}" node /tmp/test-ollama-node.js
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Node.js Ollama client working${NC}"
    else
        echo -e "${RED}❌ Node.js Ollama client failed${NC}"
        rm /tmp/test-ollama-node.js
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Ollama npm package not found, skipping Node.js test${NC}"
fi
rm -f /tmp/test-ollama-node.js
echo ""

# Summary
echo "=========================="
echo -e "${GREEN}✅ All Ollama tests passed!${NC}"
echo ""
echo "Your Ollama setup is working correctly and ready for the application."
echo ""
echo "Connection details:"
echo "  • Host: ${OLLAMA_HOST}"
echo "  • Model: ${MODEL}"
echo "  • Protocol: IPv4 (127.0.0.1)"
echo ""
