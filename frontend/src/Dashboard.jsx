const response = await fetch(
  "http://127.0.0.1:8000/api/test-generate",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: userText,
      message: userText,
      model: model
    })
  }
);

const data = await response.json();

if (!response.ok) {
  throw new Error(data.detail || "AI request failed");
}

const answer = data.response;