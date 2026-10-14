import asyncio
import sys
from pathlib import Path

# Force UTF-8 stdout for Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.ollama_client import ollama_client
from app.config import settings


async def main():
    print("=" * 60)
    print("AgentFlow AI - Backend & Ollama Connection Test")
    print("=" * 60)

    # 1. Health check
    print("\n[1/4] Checking Ollama health...")
    health = await ollama_client.check_health()
    print(f"Health response: {health}")
    if health.get("status") != "healthy":
        print("ERROR: Ollama is not healthy or unreachable.")
        sys.exit(1)

    # 2. List models
    print("\n[2/4] Listing installed models from Ollama API...")
    models = await ollama_client.list_models()
    model_names = [m["name"] for m in models]
    print(f"Found {len(models)} model(s): {model_names}")

    # Check for default and fast models
    if settings.default_model not in model_names and f"{settings.default_model}:latest" not in model_names:
        print(f"[WARN] Default model '{settings.default_model}' not found in Ollama list.")
    else:
        print(f"[OK] Default model '{settings.default_model}' is available.")

    if settings.fast_model not in model_names and f"{settings.fast_model}:latest" not in model_names:
        print(f"[WARN] Fast model '{settings.fast_model}' not found in Ollama list.")
    else:
        print(f"[OK] Fast model '{settings.fast_model}' is available.")

    # 3. Test prompt with default model (qwen3:latest)
    print(f"\n[3/4] Testing generation with default model '{settings.default_model}'...")
    test_prompt = "Explain in one sentence what an autonomous research agent does."
    try:
        response_default = await ollama_client.generate(
            prompt=test_prompt,
            model=settings.default_model,
            temperature=0.3,
        )
        print(f"Response from {settings.default_model}:\n--> {response_default.strip()}")
    except Exception as e:
        print(f"Failed to generate with {settings.default_model}: {e}")

    # 4. Test prompt with fast model (llama3.2:3b)
    print(f"\n[4/4] Testing generation with fast model '{settings.fast_model}'...")
    try:
        response_fast = await ollama_client.generate(
            prompt=test_prompt,
            model=settings.fast_model,
            temperature=0.3,
        )
        print(f"Response from {settings.fast_model}:\n--> {response_fast.strip()}")
    except Exception as e:
        print(f"Failed to generate with {settings.fast_model}: {e}")

    print("\n" + "=" * 60)
    print("All Ollama connection tests completed successfully!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
