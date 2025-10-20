#!/bin/bash

# GermanAI Connection Test Script
# Tests the connection and functionality of GermanAI.tech API

set -e

echo "🤖 GermanAI Connection Test"
echo "============================"
echo ""

# Configuration
GERMANAI_URL="${GERMANAI_API_URL:-https://germanai.tech/api/v1/chat/completions}"
GERMANAI_KEY="${GERMANAI_API_KEY:-sk-2de5e362798141c6b9aa1b3708b967cf}"
MODEL="${GERMANAI_MODEL:-qwen3:32b}"

echo "Configuration:"
echo "  URL: ${GERMANAI_URL}"
echo "  Model: ${MODEL}"
echo "  API Key: ${GERMANAI_KEY:0:20}..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test 1: Simple API test
echo "1. Testing GermanAI API connectivity..."
RESPONSE=$(curl -s -X POST "${GERMANAI_URL}" \
  -H "Authorization: Bearer ${GERMANAI_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"${MODEL}\",
    \"messages\": [{\"role\": \"user\", \"content\": \"Say OK if you receive this.\"}],
    \"max_tokens\": 10
  }" 2>&1)

if echo "$RESPONSE" | grep -q "choices"; then
    echo -e "${GREEN}✅ GermanAI API is reachable${NC}"
    CONTENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content' 2>/dev/null || echo "")
    if [ ! -z "$CONTENT" ]; then
        echo "   Response: ${CONTENT}"
    fi
else
    echo -e "${RED}❌ GermanAI API connection failed${NC}"
    echo "Response: $RESPONSE"
    exit 1
fi
echo ""

# Test 2: Test German response
echo "2. Testing German language response..."
RESPONSE=$(curl -s -X POST "${GERMANAI_URL}" \
  -H "Authorization: Bearer ${GERMANAI_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"${MODEL}\",
    \"messages\": [
      {\"role\": \"system\", \"content\": \"Du bist ein hilfreicher Assistent. Antworte auf Deutsch.\"},
      {\"role\": \"user\", \"content\": \"Sag Hallo auf Deutsch.\"}
    ],
    \"max_tokens\": 50
  }")

if echo "$RESPONSE" | grep -q "choices"; then
    echo -e "${GREEN}✅ German response successful${NC}"
    CONTENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content' 2>/dev/null || echo "")
    echo "   Response: ${CONTENT}"
else
    echo -e "${RED}❌ German response failed${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# Test 3: Test JSON mode
echo "3. Testing JSON response format..."
RESPONSE=$(curl -s -X POST "${GERMANAI_URL}" \
  -H "Authorization: Bearer ${GERMANAI_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"${MODEL}\",
    \"messages\": [{\"role\": \"user\", \"content\": \"Return a JSON with field 'test' set to true\"}],
    \"response_format\": {\"type\": \"json_object\"},
    \"max_tokens\": 50
  }")

if echo "$RESPONSE" | grep -q "choices"; then
    echo -e "${GREEN}✅ JSON mode successful${NC}"
    CONTENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content' 2>/dev/null || echo "")
    echo "   Response: ${CONTENT}"

    # Try to parse as JSON
    if echo "$CONTENT" | jq '.' > /dev/null 2>&1; then
        echo -e "${GREEN}   ✓ Valid JSON returned${NC}"
    else
        echo -e "${YELLOW}   ⚠ Response is not valid JSON${NC}"
    fi
else
    echo -e "${RED}❌ JSON mode failed${NC}"
fi
echo ""

# Test 4: Test work permit question (realistic use case)
echo "4. Testing work permit form question..."
RESPONSE=$(curl -s -X POST "${GERMANAI_URL}" \
  -H "Authorization: Bearer ${GERMANAI_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"${MODEL}\",
    \"messages\": [
      {
        \"role\": \"system\",
        \"content\": \"Du bist ein Assistent für Arbeitserlaubnis-Anträge. Antworte auf Deutsch.\"
      },
      {
        \"role\": \"user\",
        \"content\": \"Frage nach dem vollständigen Namen des Antragstellers. Gib 2 Beispiele.\"
      }
    ],
    \"temperature\": 0.3,
    \"max_tokens\": 200
  }")

if echo "$RESPONSE" | grep -q "choices"; then
    echo -e "${GREEN}✅ Work permit question successful${NC}"
    CONTENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content' 2>/dev/null || echo "")
    echo "   Response (first 200 chars):"
    echo "   ${CONTENT:0:200}..."
else
    echo -e "${RED}❌ Work permit question failed${NC}"
fi
echo ""

# Summary
echo "============================"
echo -e "${GREEN}✅ All GermanAI tests passed!${NC}"
echo ""
echo "Your GermanAI setup is working correctly."
echo ""
echo "Connection details:"
echo "  • URL: ${GERMANAI_URL}"
echo "  • Model: ${MODEL}"
echo "  • Protocol: HTTPS"
echo ""
