import asyncio
from app.core.ollama_client import ollama_client

async def main():
    print("Checking Ollama connection...")

    health = await ollama_client.check_health()
    print("Health:", health)

    if health.get("status") != "healthy":
        print("Ollama is not running. Start Ollama and try again.")
        return

    print("\nGenerating test response...")
    try:
        answer = await ollama_client.generate(
            prompt="Introduce yourself as AgentFlow AI.",
        )
        print("\nAI Response:")
        print(answer)
    except Exception as error:
        print("Generation failed:", error)

if __name__ == "__main__":
    asyncio.run(main())
