
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from app.config import settings
from app.core.ollama_client import ollama_client

app = FastAPI(
    title="AgentFlow AI API",
    description="Multi-Agent LLM Research Assistant Backend",
    version="0.1.0",
)

# Allow the React + Vite frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TestPromptRequest(BaseModel):
    prompt: str = ""
    message: str = ""
    model: Optional[str] = None
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)


@app.get("/")
async def root():
    return {"message": "AgentFlow AI backend is running"}


@app.get("/api/health")
async def health_check():
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
    try:
        models = await ollama_client.list_models()

        return {
            "default_model": settings.default_model,
            "fast_model": settings.fast_model,
            "models": models,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Failed to fetch models from Ollama: {exc}",
        ) from exc


@app.post("/api/test-generate")
async def test_generate(req: TestPromptRequest):
    prompt = (req.prompt or req.message).strip()

    if not prompt:
        raise HTTPException(
            status_code=400,
            detail="Please enter a message.",
        )

    model_used = req.model or settings.default_model

    try:
        response = await ollama_client.generate(
            prompt=prompt,
            model=model_used,
            temperature=req.temperature,
        )

        return {
            "model_used": model_used,
            "response": response,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Generation failed: {exc}",
        ) from exc
