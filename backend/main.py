from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import ollama

app = FastAPI(
    title="AgentFlow AI",
    description="Multi-Agent AI Research Assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=10000)

@app.get("/")
def home():
    return {
        "message": "Welcome to AgentFlow AI",
        "docs": "/docs"
    }

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "application": "AgentFlow AI"
    }

@app.post("/api/chat")
def chat(request: ChatRequest):
    try:
        response = ollama.chat(
            model="llama3.2",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are AgentFlow AI, a research assistant. "
                        "Give clear, structured answers. "
                        "Never invent sources or facts."
                    )
                },
                {
                    "role": "user",
                    "content": request.message
                }
            ]
        )

        return {
            "reply": response["message"]["content"],
            "model": "llama3.2"
        }

    except Exception as exc:
        print(f"Ollama error: {exc}")
        raise HTTPException(
            status_code=503,
            detail=(
                "Ollama is unavailable. Start Ollama and "
                "ensure llama3.2 is installed."
            )
        ) from exc
