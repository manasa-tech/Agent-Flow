import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

OLLAMA_BASE_URL = os.getenv(
    "OLLAMA_BASE_URL",
    "http://localhost:11434"
)

DEFAULT_MODEL = os.getenv(
    "DEFAULT_MODEL",
    "qwen3:latest"
)

FAST_MODEL = os.getenv(
    "FAST_MODEL",
    "llama3.2:3b"
)

APP_NAME = "AgentFlow AI"
APP_VERSION = "1.0.0"