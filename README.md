# AgentFlow AI

AgentFlow AI is a local multi-agent LLM research assistant powered by **Ollama**, **FastAPI**, and **React + Vite**.

---

## Architecture Overview

```
AgentFlow-AI/
├── backend/                  # Python 3.14 + FastAPI backend
│   ├── app/
│   │   ├── main.py           # FastAPI entry point, CORS, and API routes
│   │   ├── config.py         # Settings & model configuration
│   │   ├── core/
│   │   │   └── ollama_client.py # Async Ollama API client (health, models, generation)
│   │   ├── agents/           # Specialized agent classes (Phase 2)
│   │   └── schemas/          # Data schemas
│   ├── requirements.txt
│   ├── test_ollama.py        # Ollama connection test script
│   └── test_api.py           # In-process ASGI API tests
│
└── frontend/                 # React 19 + Vite dashboard
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx              # System status, branding & model switcher
    │   │   ├── AgentWorkflowPanel.jsx  # 4-Agent visual pipeline & status badges
    │   │   ├── ChatInterface.jsx       # Research inquiries & real Ollama inference
    │   │   ├── ReportPanel.jsx         # Executive report synthesis & export
    │   │   ├── EvidencePanel.jsx       # Verified references & confidence tracking
    │   │   └── StatusBadge.jsx         # Waiting, Running, Completed, Failed badges
    │   ├── services/
    │   │   └── api.js                  # Backend API client
    │   ├── App.jsx
    │   └── App.css
    ├── package.json
    └── vite.config.js
```

---

## How to Run AgentFlow AI

### 1. Ensure Ollama is Running

Make sure Ollama is active with your models installed:

```bash
ollama list
```

*(Default model: `qwen3:latest` | Fast model: `llama3.2:3b`)*

---

### 2. Start the Backend (Terminal 1)

Open a terminal in the project root:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

*Or without activating the venv:*
```powershell
.\backend\venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```

The backend API will be available at: **`http://127.0.0.1:8000`**
Interactive Swagger documentation: **`http://127.0.0.1:8000/docs`**

---

### 3. Start the Frontend (Terminal 2)

Open a second terminal in the project root:

```powershell
cd frontend
npm run dev
```

The frontend dashboard will be available at: **`http://localhost:5173`**
