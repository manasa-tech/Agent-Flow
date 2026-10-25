
import logging
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.config import settings
from app.core.ollama_client import ollama_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Chat"])


class ChatRequest(BaseModel):
    prompt: str = ""
    message: str = ""
    model: Optional[str] = None
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)


class ChatResponse(BaseModel):
    response: str
    model_used: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # Accept either "prompt" or "message" from the frontend.
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
            detail=(
                "AI generation failed. Check that Ollama is running "
                "and the selected model is installed."
            ),
        ) from exc
