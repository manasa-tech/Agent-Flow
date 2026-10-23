from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    ollama_base_url: str = "http://localhost:11434"

    default_model: str = "qwen3:latest"
    fast_model: str = "llama3.2:3b"

    backend_host: str = "127.0.0.1"
    backend_port: int = 8000

    allowed_origins: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ]

    ollama_timeout_seconds: float = 180.0

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
