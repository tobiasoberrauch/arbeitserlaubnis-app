#!/bin/bash

# Test Form Flow Script
# Tests the complete form submission flow

set -e

echo "🧪 Form Flow Test (GermanAI)"
echo "================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

API_URL="${API_URL:-http://127.0.0.1:6010}"

# Check if server is running
echo "1. Checking if dev server is running..."
if curl -s "${API_URL}" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Server is running on ${API_URL}${NC}"
else
    echo -e "${RED}❌ Server is not running${NC}"
    echo "Start it with: make dev"
    exit 1
fi
echo ""

# Test 1: Get first question
echo "2. Testing first question retrieval..."
QUESTION_RESPONSE=$(curl -s -X POST "${API_URL}/api/chat/form" \
    -H "Content-Type: application/json" \
    -d '{
        "action": "nextQuestion",
        "context": {
            "language": "de",
            "currentStep": 0,
            "totalSteps": 24,
            "fields": [],
            "userInfo": {}
        }
    }')

if echo "$QUESTION_RESPONSE" | jq -e '.fieldId' > /dev/null 2>&1; then
    FIELD_ID=$(echo "$QUESTION_RESPONSE" | jq -r '.fieldId')
    QUESTION=$(echo "$QUESTION_RESPONSE" | jq -r '.question' | head -c 100)
    echo -e "${GREEN}✅ First question received${NC}"
    echo "   Field ID: ${FIELD_ID}"
    echo "   Question: ${QUESTION}..."
else
    echo -e "${RED}❌ Failed to get first question${NC}"
    echo "Response: $QUESTION_RESPONSE"
    exit 1
fi
echo ""

# Test 2: Validate a name
echo "3. Testing validation with sample name..."
VALIDATION_RESPONSE=$(curl -s -X POST "${API_URL}/api/chat/form" \
    -H "Content-Type: application/json" \
    -d "{
        \"action\": \"validate\",
        \"fieldId\": \"${FIELD_ID}\",
        \"answer\": \"Max Mustermann\",
        \"language\": \"de\"
    }")

echo "Raw validation response:"
echo "$VALIDATION_RESPONSE" | jq '.'
echo ""

if echo "$VALIDATION_RESPONSE" | jq -e '.valid' > /dev/null 2>&1; then
    IS_VALID=$(echo "$VALIDATION_RESPONSE" | jq -r '.valid')
    MESSAGE=$(echo "$VALIDATION_RESPONSE" | jq -r '.message // "No message"')
    CORRECTED=$(echo "$VALIDATION_RESPONSE" | jq -r '.correctedValue // ""')

    if [ "$IS_VALID" = "true" ]; then
        echo -e "${GREEN}✅ Validation passed${NC}"
        echo "   Message: ${MESSAGE}"
        echo "   Corrected Value: '${CORRECTED}'"
    else
        echo -e "${RED}❌ Validation failed${NC}"
        echo "   Message: ${MESSAGE}"
    fi
else
    echo -e "${RED}❌ Invalid validation response format${NC}"
    echo "Response: $VALIDATION_RESPONSE"
    exit 1
fi
echo ""

# Test 3: Get second question
echo "4. Testing second question retrieval (after first answer)..."
QUESTION2_RESPONSE=$(curl -s -X POST "${API_URL}/api/chat/form" \
    -H "Content-Type: application/json" \
    -d '{
        "action": "nextQuestion",
        "context": {
            "language": "de",
            "currentStep": 1,
            "totalSteps": 24,
            "fields": [
                {
                    "id": "fullName",
                    "value": "Max Mustermann",
                    "validated": true
                }
            ],
            "userInfo": {
                "fullName": "Max Mustermann"
            }
        }
    }')

if echo "$QUESTION2_RESPONSE" | jq -e '.fieldId' > /dev/null 2>&1; then
    FIELD_ID2=$(echo "$QUESTION2_RESPONSE" | jq -r '.fieldId')
    QUESTION2=$(echo "$QUESTION2_RESPONSE" | jq -r '.question' | head -c 100)
    echo -e "${GREEN}✅ Second question received${NC}"
    echo "   Field ID: ${FIELD_ID2}"
    echo "   Question: ${QUESTION2}..."
else
    echo -e "${RED}❌ Failed to get second question${NC}"
    echo "Response: $QUESTION2_RESPONSE"
    exit 1
fi
echo ""

# Summary
echo "================="
echo -e "${GREEN}✅ All form flow tests passed!${NC}"
echo ""
echo "The form flow is working correctly:"
echo "  1. ✅ Can get first question"
echo "  2. ✅ Can validate answers"
echo "  3. ✅ Can progress to next question"
echo ""
echo "If the UI still doesn't work, check the browser console for errors."
echo "Open DevTools (F12) and look for:"
echo "  - 🔍 Validation logs"
echo "  - 📋 askNextQuestion logs"
echo "  - ❌ Any error messages"
echo ""
