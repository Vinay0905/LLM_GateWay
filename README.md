# Polyglot LLM API Gateway Showcase

This project is a polyglot, production-grade LLM API Gateway written in Go, secured by a Python FastAPI safety sidecar, and fronted by a retro-futuristic Next.js showcase user interface.

---

## ⚡ Quick Start Command Cheat Sheet

Open **three separate terminal windows** and run the following command groups to start the entire system:

### Terminal 1: Python Safety Sidecar (Port `8000`)
```bash
# 1. Navigate to the sidecar folder
cd llm-gateway/safety_sidecar

# 2. Copy the root .env file so the sidecar loads your API keys natively
cp ../../.env .env

# 3. Activate the virtual environment
source .venv/bin/activate

# 4. Start the sidecar server
uvicorn main:app --host 127.0.0.1 --port 8000
```

### Terminal 2: Go Gateway (Port `8080`)
```bash
# 1. Navigate to the gateway folder
cd llm-gateway/gateway

# 2. Start the gateway pointing to the root .env file
export SAFETY_BASE_URL="http://127.0.0.1:8000"
export ENV_FILE=../../.env
export DEBUG_HEADERS=true
go run ./cmd
```

### Terminal 3: Next.js Showcase UI (Port `3000`)
```bash
# 1. Navigate to the improved showcase UI folder
cd showcase_ui_improved

# 2. Start the Next.js development server
npm run dev
```

---

## 🔍 Why you saw "Upstream Unavailable" (503) & Dotenv Analysis

In your Go and Python configurations:

1. **You did NOT miss any dotenv imports!** 
   * The Python sidecar has the correct `load_dotenv()` import and call in [main.py](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/safety_sidecar/main.py#L9-L10).
   * The Go gateway uses a custom file scanner inside [main.go](file:///Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/gateway/cmd/main.go#L22-L52) that mimics dotenv behavior.

2. **The issue was the `.env` file location:**
   * When you run `uvicorn` inside `llm-gateway/safety_sidecar`, `dotenv` searches for a `.env` file inside that directory and fails because the file is in the root directory.
   * When you ran the Go gateway using `ENV_FILE=../../../.env`, it resolved to `/Users/mast/Documents/VInayPrograming/.env` (which does not exist) instead of `/Users/mast/Documents/VInayPrograming/LLM_GateWay/.env`. 

Since no API keys were loaded on either the gateway or the sidecar, the calls returned `upstream unavailable`.

---

## 🛠️ Verification Commands

You can verify each connection layer is running correctly by executing these commands in a separate terminal:

### 1. Test the Safety Sidecar Directly
```bash
curl -i -X POST http://127.0.0.1:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Say hi"}'
```
*Expected Response:* `200 OK` with JSON containing `"verdict": "PASS"`.

### 2. Test the Go Gateway (Bypassing Frontend)
```bash
curl -i -X POST http://127.0.0.1:8080/v1/chat \
  -H "X-API-Key: dev-key" \
  -H "Content-Type: application/json" \
  -d '{"model": "gemini", "prompt": "Say hi"}'
```
*Expected Response:* `200 OK` with generated response from Google Gemini.
