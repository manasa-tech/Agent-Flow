import json
import logging
from typing import AsyncGenerator, Dict, List, Optional, Any
import httpx
from app.config import settings

logger = logging.getLogger(__name__)


class OllamaClient:
    """Async client for interacting with the local Ollama instance."""

    def __init__(self, base_url: Optional[str] = None, timeout: Optional[float] = None):
        self.base_url = (base_url or settings.ollama_base_url).rstrip("/")
        self.timeout = timeout or settings.ollama_timeout_seconds

    async def check_health(self) -> Dict[str, Any]:
        """Check if Ollama service is reachable."""
        async with httpx.AsyncClient(timeout=5.0) as client:
            try:
                response = await client.get(f"{self.base_url}/api/version")
                response.raise_for_status()
                return {
                    "status": "healthy",
                    "version": response.json().get("version", "unknown"),
                    "url": self.base_url,
                }
            except Exception as e:
                logger.error(f"Failed to connect to Ollama: {e}")
                return {
                    "status": "unhealthy",
                    "error": str(e),
                    "url": self.base_url,
                }

    async def list_models(self) -> List[Dict[str, Any]]:
        """Return the list of locally installed models."""
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{self.base_url}/api/tags")
            response.raise_for_status()
            data = response.json()
            models = []
            for item in data.get("models", []):
                models.append({
                    "name": item.get("name"),
                    "size_bytes": item.get("size"),
                    "modified_at": item.get("modified_at"),
                })
            return models

    async def generate(
        self,
        prompt: str,
        model: Optional[str] = None,
        system: Optional[str] = None,
        temperature: float = 0.7,
    ) -> str:
        """Generate a complete text response."""
        chosen_model = model or settings.default_model
        payload = {
            "model": chosen_model,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": temperature},
        }
        if system:
            payload["system"] = system

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{self.base_url}/api/generate",
                json=payload,
            )
            response.raise_for_status()
            data = response.json()
            return data.get("response", "")

    async def generate_stream(
        self,
        prompt: str,
        model: Optional[str] = None,
        system: Optional[str] = None,
        temperature: float = 0.7,
    ) -> AsyncGenerator[str, None]:
        """Stream chunks of generated text from Ollama."""
        chosen_model = model or settings.default_model
        payload = {
            "model": chosen_model,
            "prompt": prompt,
            "stream": True,
            "options": {"temperature": temperature},
        }
        if system:
            payload["system"] = system

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/api/generate",
                json=payload,
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if not line:
                        continue
                    try:
                        chunk = json.loads(line)
                        yield chunk.get("response", "")
                        if chunk.get("done", False):
                            break
                    except json.JSONDecodeError:
                        continue


ollama_client = OllamaClient()
