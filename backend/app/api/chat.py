from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging

from app.core.ollama_client import ollama_client
from backend.app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Chat"])


class ChatRequest(BaseModel):
    prompt: str = ""
    message: str = ""
    model: Optional[str] = None
    temperature: float = 0.7


class ChatResponse(BaseModel):
    response: str
    model_used: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    prompt = (request.prompt or request.message).strip()

    if not prompt:
        raise HTTPException(
            status_code=400,
            detail="Please provide a message.",
        )

    model_used = request.model or settings.default_model

    try:
        answer = await ollama_client.generate(
            prompt=prompt,
            model=model_used,
            temperature=request.temperature,
        )

        return ChatResponse(
            response=answer,
            model_used=model_used,
        )

    except Exception as exc:
        logger.exception("Chat generation failed")
        raise HTTPException(
            status_code=503,
            detail=f"AI generation failed: {str(exc)}",
        ) from exc
