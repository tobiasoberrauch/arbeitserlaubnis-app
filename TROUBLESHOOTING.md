# Troubleshooting Guide

## Problem: Form doesn't progress after entering name

### Symptoms
- You enter your name in the chat interface
- The form doesn't move to the next question
- No error message is shown
- The progress bar doesn't update

### Diagnosis Steps

#### 1. Check Browser Console

Open DevTools (F12 or Right-click → Inspect) and check the Console tab for:

**Look for these log messages:**
```
🔍 Validating answer: { fieldId: 'fullName', answer: '...', language: '...' }
✅ Validation result: { valid: true, message: '...', correctedValue: '...' }
💾 Saving value: { fieldId: 'fullName', value: '...' }
➡️ Moving to next question. Current step: 0
🎯 Asking next question...
📋 askNextQuestion called. Step: 1, Total: 24
```

**Common error patterns:**

❌ **Validation fails:**
```
❌ Validation request failed: 500
```
→ Ollama is not responding. Check if Ollama is running: `make ollama-check`

❌ **JSON parse error:**
```
Failed to parse validation response as JSON
```
→ Fixed in the latest version. Make sure dev server is restarted.

❌ **Network error:**
```
TypeError: fetch failed
```
→ Check if dev server is running on port 6010

#### 2. Run Backend Tests

Test the form flow from the command line:

```bash
# Test the complete form flow
./scripts/test-form-flow.sh
```

This will test:
- First question retrieval ✅
- Answer validation ✅
- Second question retrieval ✅

#### 3. Check Ollama Connection

```bash
# Quick check
make ollama-check

# Detailed test
make test-ollama
```

If Ollama is not running:
```bash
make ollama-start
# or
ollama serve
```

### Common Solutions

#### Solution 1: Restart Everything

```bash
# Stop dev server
make kill-port

# Ensure Ollama is running
make ollama-check

# Start dev server with checks
make dev
```

#### Solution 2: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click the reload button
3. Select "Empty Cache and Hard Reload"
4. Or use: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows/Linux)

#### Solution 3: Check for Updated Code

Make sure you have the latest fixes:

```bash
# Check git status
git status

# If there are changes, restart dev server
make kill-port
make dev
```

The latest code includes:
- ✅ Better JSON parsing (handles markdown code blocks)
- ✅ Improved error handling
- ✅ Detailed console logging
- ✅ Better validation for empty correctedValue

#### Solution 4: Verify IPv4 Configuration

Check that Ollama is using IPv4:

```bash
# Should show 127.0.0.1, not ::1
lsof -i :11434 | grep LISTEN
```

Check `.env.local`:
```bash
cat .env.local
# Should show: OLLAMA_HOST=http://127.0.0.1:11434
```

### Detailed Debugging

If the problem persists, enable detailed logging:

1. **Open Browser DevTools** (F12)
2. **Go to Console tab**
3. **Clear console** (Ctrl+L or click the 🚫 icon)
4. **Try entering a name again**
5. **Look for the log sequence:**

Expected successful flow:
```
🔍 Validating answer: ...          ← Validation starts
✅ Validation result: ...          ← Validation succeeds
💾 Saving value: ...               ← Value is saved
➡️ Moving to next question. ...   ← Incrementing step
🎯 Asking next question...         ← Calling askNextQuestion
📋 askNextQuestion called. ...     ← Function executed
📤 Requesting next question: ...   ← API call starts
📥 Received question: ...          ← API call succeeds
✅ Question added to messages      ← New question displayed
```

If any step is missing, that's where the problem is.

### Backend API Testing

Test the API endpoints directly:

```bash
# 1. Test getting first question
curl -X POST http://127.0.0.1:6010/api/ollama/form \
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
  }' | jq '.'

# 2. Test validation
curl -X POST http://127.0.0.1:6010/api/ollama/form \
  -H "Content-Type: application/json" \
  -d '{
    "action": "validate",
    "fieldId": "fullName",
    "answer": "Max Mustermann",
    "language": "de"
  }' | jq '.'

# 3. Test getting second question
curl -X POST http://127.0.0.1:6010/api/ollama/form \
  -H "Content-Type: application/json" \
  -d '{
    "action": "nextQuestion",
    "context": {
      "language": "de",
      "currentStep": 1,
      "totalSteps": 24,
      "fields": [{"id": "fullName", "value": "Max Mustermann", "validated": true}],
      "userInfo": {"fullName": "Max Mustermann"}
    }
  }' | jq '.'
```

All three should return valid JSON responses.

### Still Not Working?

If none of the above helps:

1. **Check Ollama model:**
   ```bash
   ollama list | grep qwen2.5:7b
   ```
   If not found:
   ```bash
   ollama pull qwen2.5:7b
   ```

2. **Try a different model:**
   Edit `lib/ollamaFormService.ts` line 27:
   ```typescript
   private defaultModel: string = 'llama3.3:70b'; // or any model you have
   ```

3. **Check server logs:**
   The dev server should show:
   ```
   ○ Compiling /api/ollama/form ...
   ✓ Compiled /api/ollama/form in XXXms
   ```

4. **Create an issue:**
   If the problem persists, please report it with:
   - Browser console logs (full output)
   - Output of `./scripts/test-form-flow.sh`
   - Output of `make test-all`
   - Your Ollama version: `ollama --version`

## Other Common Issues

### Port 6010 Already in Use

```bash
make kill-port
make dev
```

### Ollama Not Installed

```bash
# macOS
brew install ollama

# Or download from: https://ollama.ai
```

### Model Not Available

```bash
ollama pull qwen2.5:7b
```

### TypeScript Errors

```bash
make type-check
```

### Build Errors

```bash
make clean
make build
```
