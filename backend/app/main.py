from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.config import settings
from app.core.ollama_client import ollama_client

app = FastAPI(
    title="AgentFlow AI API",
    description="Multi-Agent LLM Research Assistant Backend",
    version="0.1.0",
)

# CORS middleware for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TestPromptRequest(BaseModel):
    prompt: str
    model: Optional[str] = None
    temperature: Optional[float] = 0.7


@app.get("/api/health")
async def health_check():
    """Verify backend and Ollama connectivity status."""
    ollama_status = await ollama_client.check_health()
    return {
        "status": "online",
        "service": "AgentFlow AI Backend",
        "version": "0.1.0",
        "ollama": ollama_status,
        "default_model": settings.default_model,
        "fast_model": settings.fast_model,
    }


@app.get("/api/models")
async def get_models():
    """List all available models in local Ollama and identify configured models."""
    try:
        models = await ollama_client.list_models()
        return {
            "default_model": settings.default_model,
            "fast_model": settings.fast_model,
            "models": models,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch models from Ollama: {str(e)}")


@app.post("/api/test-generate")
async def test_generate(req: TestPromptRequest):
    """Test generation endpoint for model verification."""
    try:
        response = await ollama_client.generate(
            prompt=req.prompt,
            model=req.model or settings.default_model,
            temperature=req.temperature,
        )
        return {
            "model_used": req.model or settings.default_model,
            "response": response,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")
