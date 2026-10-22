# AgentFlow AI - Frontend

React + Vite frontend dashboard for the AgentFlow AI multi-agent research assistant.

## Features

- **Header & Connectivity**: Live connection status pills for the FastAPI backend (`http://127.0.0.1:8000`) and local Ollama service (`http://localhost:11434`), plus real-time model switching (`qwen3:latest`, `llama3.2:3b`, etc.).
- **Agent Workflow Panel**: Visual representation of the 4 specialized agents:
  1. **Research Agent**: Query decomposition & factual discovery
  2. **Analysis Agent**: Evidence synthesis & trade-off identification
  3. **Report Writer Agent**: Structured executive drafting
  4. **Verification Agent**: Fact checking & anti-hallucination guardrails
- **Status Indicators**: `Waiting`, `Running`, `Completed`, and `Failed` badges.
- **Research Chat Interface**: Live inquiry submissions, temperature control, real model inference from Ollama, latency timing, and message actions.
- **Report Panel**: Compiles research findings into an executive report with Markdown copy and `.md` download.
- **Evidence & Grounding Panel**: Tracks verifiable claims, confidence scoring, and source attribution.
- **Responsive Dark Theme Layout**: Optimized for both laptop dual-pane view and mobile screens.

## Quick Start

### 1. Configure Environment

Copy `.env.example` to `.env` (already configured to `http://127.0.0.1:8000`):

```bash
cp .env.example .env
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The frontend will be available at: **`http://localhost:5173`**

### 4. Build for Production

```bash
npm run build
```
