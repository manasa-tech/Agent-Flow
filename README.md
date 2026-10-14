# 🤖 AgentFlow AI
### Autonomous Multi-Agent Research Assistant

AgentFlow AI is an AI-powered research assistant designed to help users research complex questions, analyze information, generate structured reports, and verify claims using a multi-agent workflow.

The project combines a React frontend, a FastAPI backend, and locally running language models through Ollama to create an interactive research experience.

## ✨ Features

- **Multi-Agent Workflow:** Organizes research tasks into specialized agents for research, analysis, writing, and verification.
- **AI-Powered Research:** Helps investigate questions and organize relevant information.
- **Analysis and Reasoning:** Analyzes collected information to generate useful insights.
- **Report Generation:** Produces structured research reports.
- **Claim Verification:** Includes a verification stage to help identify unsupported claims.
- **Local LLM Support:** Uses Ollama to run compatible language models locally.
- **Interactive Dashboard:** Provides a user-friendly interface for submitting research questions and viewing results.
- **Model Selection:** Supports choosing from models configured in the application.
- **Temperature Control:** Allows users to adjust the model's response creativity.

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Backend | Python, FastAPI |
| AI Models | Ollama |
| Language | Python, JavaScript |
| Version Control | Git and GitHub |

## 🏗️ Architecture

The application follows a frontend-backend architecture.

1. **User Interface:** The React dashboard accepts research questions.
2. **Backend API:** FastAPI receives requests and coordinates processing.
3. **Research Agent:** Collects or organizes information relevant to the question.
4. **Analysis Agent:** Examines information and identifies important findings.
5. **Writer Agent:** Structures findings into a readable report.
6. **Verifier Agent:** Checks claims against available evidence.
7. **Results:** The frontend displays the generated research output.

*Note: Actual agent behavior depends on the implementation and tools configured in the project.*

## 📁 Project Structure

```text
AgentFlow-AI/
├── backend/
│   ├── app/
│   │   └── main.py
│   └── venv/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.html
├── .gitignore
└── README.md
```

The structure above is illustrative. Your actual files may differ.

## ⚙️ Prerequisites

Install the following before running the project:

- Python 3.10 or later
- Node.js and npm
- Ollama
- Git

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/manasa-tech/Agent-Flow.git
cd Agent-Flow
```

If your repository URL is different, replace it with your actual GitHub URL.

### 2. Set up the backend

Open a terminal in the project root.

Create a virtual environment if one does not already exist:

```powershell
python -m venv backend/venv
```

Activate it:

```powershell
.\backend\venv\Scripts\Activate.ps1
```

Install the backend dependencies if `backend/requirements.txt` exists:

```powershell
pip install -r backend/requirements.txt
```

Start the FastAPI server:

```powershell
python -m uvicorn app.main:app --reload --app-dir backend
```

The backend should be available at:

- API: http://127.0.0.1:8000
- Interactive API documentation: http://127.0.0.1:8000/docs

### 3. Set up the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

http://localhost:5173

Keep both terminals running while using the application.

### 4. Set up Ollama

Install Ollama from https://ollama.com/.

Check whether Ollama is installed:

```powershell
ollama --version
```

List locally available models:

```powershell
ollama list
```

If the model configured in your application is not installed, download it. For example:

```powershell
ollama pull qwen3:latest
```

Make sure the selected model matches the model name configured in AgentFlow AI.

## 🔄 How to Use

1. Start Ollama and ensure the selected model is available.
2. Start the FastAPI backend.
3. Start the React frontend.
4. Open the application in your browser.
5. Enter a research question or choose a suggested topic.
6. Submit the question and wait for the configured workflow to process it.
7. Review the available analysis, report, and verification results.

## 🔐 Security and Privacy

- Do not commit passwords, API keys, or other secrets to GitHub.
- Keep environment files such as `.env` out of version control.
- Use `.env.example` to document required environment variables without including real credentials.
- Local model execution can help keep prompts on your machine, but privacy also depends on the application's tools and network connections.

## 🗺️ Future Improvements

Potential improvements include:

- Retrieval-Augmented Generation (RAG).
- Document upload and research over personal documents.
- ChromaDB vector search.
- Source citations and evidence tracking.
- Improved claim verification and confidence scoring.
- Research history and report export.
- Automated evaluation of answer quality.
- Deployment for remote access.

These are planned improvements unless already implemented in the codebase.

## 🎯 Project Goal

The goal of AgentFlow AI is to make AI-assisted research more organized, transparent, and useful by separating research, analysis, writing, and verification into a coordinated workflow.

## 👩‍💻 Author

**Videesha A G**

Built with React, FastAPI, Python, and Ollama.

## 📄 License

Choose a license before distributing the project publicly. For example, an MIT License can be added if that matches your intended use.
