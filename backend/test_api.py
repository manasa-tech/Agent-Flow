import asyncio
import sys
from pathlib import Path

# Force UTF-8 stdout
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, str(Path(__file__).parent))

import httpx
from app.main import app


async def test_fastapi_endpoints():
    print("=" * 60)
    print("Testing AgentFlow AI FastAPI Endpoints (In-Process ASGI)")
    print("=" * 60)

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        # 1. Health check endpoint
        print("\n[1/3] GET /api/health...")
        res = await client.get("/api/health")
        print(f"Status Code: {res.status_code}")
        print(f"Response: {res.json()}")
        assert res.status_code == 200
        assert res.json()["status"] == "online"
        assert res.json()["ollama"]["status"] == "healthy"
        print("[OK] Health check passed!")

        # 2. Models endpoint
        print("\n[2/3] GET /api/models...")
        res = await client.get("/api/models")
        print(f"Status Code: {res.status_code}")
        print(f"Response: {res.json()}")
        assert res.status_code == 200
        assert len(res.json()["models"]) > 0
        print("[OK] Models endpoint passed!")

        # 3. Test generate endpoint
        print("\n[3/3] POST /api/test-generate...")
        payload = {
            "prompt": "Say hello from AgentFlow in 3 words.",
            "model": "llama3.2:3b",
            "temperature": 0.2,
        }
        res = await client.post("/api/test-generate", json=payload)
        print(f"Status Code: {res.status_code}")
        print(f"Response: {res.json()}")
        assert res.status_code == 200
        assert "response" in res.json()
        print("[OK] Test generate endpoint passed!")

    print("\n" + "=" * 60)
    print("All FastAPI endpoint tests passed successfully!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(test_fastapi_endpoints())
