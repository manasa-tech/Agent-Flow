import sys
import httpx

def main():
    print("=" * 60)
    print("AgentFlow AI - Frontend <-> Backend Integration Check")
    print("=" * 60)
    
    base_url = "http://127.0.0.1:8000"
    origin = "http://localhost:5173"
    
    headers = {
        "Origin": origin,
    }
    
    with httpx.Client(base_url=base_url, timeout=30.0) as client:
        # 1. CORS Preflight check
        print("\n[1/4] Testing CORS OPTIONS Preflight on /api/test-generate...")
        preflight_headers = {
            "Origin": origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        }
        res_preflight = client.options("/api/test-generate", headers=preflight_headers)
        print(f"Preflight Status: {res_preflight.status_code}")
        print(f"Access-Control-Allow-Origin: {res_preflight.headers.get('access-control-allow-origin')}")
        print(f"Access-Control-Allow-Methods: {res_preflight.headers.get('access-control-allow-methods')}")
        assert res_preflight.status_code == 200
        assert res_preflight.headers.get("access-control-allow-origin") == origin
        print("[OK] CORS preflight passed!")

        # 2. Health check
        print("\n[2/4] Testing GET /api/health with Origin header...")
        res_health = client.get("/api/health", headers=headers)
        print(f"Status: {res_health.status_code}")
        data_health = res_health.json()
        print(f"Health Response: {data_health}")
        assert res_health.status_code == 200
        assert data_health["status"] == "online"
        assert res_health.headers.get("access-control-allow-origin") == origin
        print("[OK] Health check endpoint passed with CORS!")

        # 3. Models list
        print("\n[3/4] Testing GET /api/models with Origin header...")
        res_models = client.get("/api/models", headers=headers)
        print(f"Status: {res_models.status_code}")
        data_models = res_models.json()
        print(f"Models: {[m['name'] for m in data_models.get('models', [])]}")
        assert res_models.status_code == 200
        assert len(data_models["models"]) > 0
        assert res_models.headers.get("access-control-allow-origin") == origin
        print("[OK] Models endpoint passed with CORS!")

        # 4. Generate test
        print("\n[4/4] Testing POST /api/test-generate (model: qwen3:latest)...")
        payload = {
            "prompt": "Say 'AgentFlow connected successfully!'",
            "model": "qwen3:latest",
            "temperature": 0.3,
        }
        res_gen = client.post("/api/test-generate", json=payload, headers=headers)
        print(f"Status: {res_gen.status_code}")
        data_gen = res_gen.json()
        print(f"Inference result: {data_gen}")
        assert res_gen.status_code == 200
        assert "response" in data_gen
        assert res_gen.headers.get("access-control-allow-origin") == origin
        print("[OK] Generation endpoint passed with CORS!")

    print("\n" + "=" * 60)
    print("ALL FRONTEND <-> BACKEND INTEGRATION CHECKS PASSED!")
    print("=" * 60)

if __name__ == "__main__":
    main()
