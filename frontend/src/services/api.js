/**
 * AgentFlow AI - Backend API Client
 * Connects to FastAPI backend at VITE_BACKEND_URL (default: http://127.0.0.1:8000)
 * Verified against OpenAPI specifications at http://127.0.0.1:8000/openapi.json
 */

const RAW_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
// Strip trailing slashes to avoid double slashes in request paths
const API_BASE_URL = RAW_BACKEND_URL.replace(/\/+$/, '');

/**
 * Check backend health and Ollama connectivity
 * Endpoint: GET /api/health
 */
export async function getHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      const message = errorBody.detail || `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(message);
    }

    const data = await res.json();
    return {
      status: data.status,
      service: data.service,
      version: data.version,
      ollama: data.ollama,
      default_model: data.default_model,
      fast_model: data.fast_model,
      isOnline: true,
      rawUrl: API_BASE_URL,
    };
  } catch (err) {
    console.warn('API Error (getHealth):', err.message);
    return {
      status: 'offline',
      service: 'AgentFlow AI Backend',
      version: '0.1.0',
      ollama: { status: 'unreachable', error: err.message },
      default_model: 'qwen3:latest',
      fast_model: 'llama3.2:3b',
      isOnline: false,
      isError: true,
      errorMessage: err.message,
      rawUrl: API_BASE_URL,
    };
  }
}

/**
 * Fetch available Ollama models from backend
 * Endpoint: GET /api/models
 */
export async function getModels() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/models`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      const message = errorBody.detail || `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(message);
    }

    const data = await res.json();
    return {
      default_model: data.default_model,
      fast_model: data.fast_model,
      models: data.models || [],
      isError: false,
    };
  } catch (err) {
    console.warn('API Error (getModels):', err.message);
    return {
      default_model: 'qwen3:latest',
      fast_model: 'llama3.2:3b',
      models: [],
      isError: true,
      errorMessage: err.message,
    };
  }
}

/**
 * Send a prompt for real LLM inference
 * Endpoint: POST /api/test-generate
 * Request Body: { prompt: string, model?: string, temperature?: number }
 */
export async function testGenerate(prompt, model = null, temperature = 0.7) {
  const startTime = Date.now();
  try {
    const payload = {
      prompt,
      model: model || undefined,
      temperature: typeof temperature === 'number' ? temperature : 0.7,
    };

    const res = await fetch(`${API_BASE_URL}/api/test-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const elapsedMs = Date.now() - startTime;

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const detail = errorData.detail || `Server error: HTTP ${res.status} (${res.statusText})`;
      throw new Error(detail);
    }

    const data = await res.json();
    return {
      success: true,
      model_used: data.model_used,
      response: data.response,
      elapsedMs,
    };
  } catch (err) {
    const elapsedMs = Date.now() - startTime;
    console.error('API Error (testGenerate):', err);
    return {
      success: false,
      error: err.message,
      elapsedMs,
    };
  }
}

/**
 * Check if the multi-agent pipeline endpoint exists.
 * Does not fake data or simulate execution if endpoint is not implemented on the backend.
 */
export async function checkMultiAgentPipelineStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/research`, {
      method: 'OPTIONS',
    });
    return {
      available: res.status !== 404 && res.status !== 405,
      status: res.status,
    };
  } catch (err) {
    return { available: false, error: err.message };
  }
}

export { API_BASE_URL };
