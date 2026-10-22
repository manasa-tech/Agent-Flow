import React, { useState } from "react";
import { testGenerate } from "../services/api";
import "./Dashboard.css";

const agents = [
  { icon: "⌕", name: "Research Agent", desc: "Research and gather information" },
  { icon: "▥", name: "Analysis Agent", desc: "Analyze data and find insights" },
  { icon: "✎", name: "Writing Agent", desc: "Create structured reports" },
  { icon: "✓", name: "Verification Agent", desc: "Check answers for accuracy" },
];

const suggestions = [
  {
    icon: "▤",
    title: "Summarize a document",
    description: "Understand the key findings of a paper",
    prompt: "Explain how to summarize a research paper and identify its key findings.",
  },
  {
    icon: "⌕",
    title: "Explore a topic",
    description: "Learn about a new technology",
    prompt: "Explain how AI agents work, with practical examples.",
  },
  {
    icon: "▥",
    title: "Analyze information",
    description: "Discover patterns and insights",
    prompt: "Explain a step-by-step approach to analyzing a dataset.",
  },
  {
    icon: "✧",
    title: "Help me build a project",
    description: "Plan an AI or machine learning project",
    prompt: "Suggest a practical AI project using Ollama, Python, and FastAPI.",
  },
];

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [agentsOpen, setAgentsOpen] = useState(false);
  const [model, setModel] = useState("llama3.2");
  const [selectedFile, setSelectedFile] = useState(null);

  async function sendMessage(text = input) {
    const prompt = text.trim();
    if (!prompt || busy) return;

    setInput("");
    setError("");
    setMessages((previous) => [
      ...previous,
      { role: "user", content: prompt },
    ]);
    setBusy(true);

    try {
      const result = await testGenerate(prompt, model);

      if (!result.success) {
        throw new Error(result.error || "The AI request failed.");
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: result.response,
          model: result.model_used || model,
        },
      ]);
    } catch (err) {
      setError(
        `${err.message}. Check that FastAPI and Ollama are running.`
      );
    } finally {
      setBusy(false);
    }
  }

  function newChat() {
    setMessages([]);
    setInput("");
    setError("");
    setSelectedFile(null);
  }

  function attachFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setInput(
      (previous) =>
        `${previous}${previous ? "\n" : ""}Please analyze this document: ${file.name}`
    );
  }

  return (
    <main className={`af-dashboard ${agentsOpen ? "agents-open" : ""}`}>
      <aside className="afd-sidebar">
        <button className="afd-brand" onClick={newChat} type="button">
          <span className="afd-brand-symbol">✦</span>
          <span>AgentFlow <b>AI</b></span>
        </button>

        <button className="afd-new-chat" onClick={newChat} type="button">
          <span>＋</span> New chat
        </button>

        <div className="afd-side-label">WORKSPACE</div>

        <nav className="afd-navigation">
          <button className="afd-nav-item active" onClick={newChat} type="button">
            <span>⌂</span> Chat
          </button>
          <button
            className="afd-nav-item"
            onClick={() => document.getElementById("afd-file")?.click()}
            type="button"
          >
            <span>▤</span> Documents
          </button>
          <button
            className="afd-nav-item"
            onClick={() => setAgentsOpen((open) => !open)}
            type="button"
          >
            <span>♧</span> AI agents
          </button>
        </nav>

        <div className="afd-sidebar-bottom">
          <div className="afd-local-badge"><span /> Ollama connection</div>
          <div className="afd-profile">
            <span className="afd-avatar">M</span>
            <span><b>Manasa</b><small>AgentFlow workspace</small></span>
          </div>
        </div>
      </aside>

      <section className="afd-workspace">
        <header className="afd-topbar">
          <div>
            <h2>Chat</h2>
            <span className="afd-subtitle">Your personal AI workspace</span>
          </div>

          <div className="afd-topbar-actions">
            <label className="afd-model-select">
              <span>Model</span>
              <select value={model} onChange={(event) => setModel(event.target.value)}>
                <option value="llama3.2">llama3.2</option>
                <option value="qwen3">qwen3</option>
              </select>
            </label>
            <button
              className={`afd-agents-toggle ${agentsOpen ? "selected" : ""}`}
              onClick={() => setAgentsOpen((open) => !open)}
              type="button"
            >
              ♧ Agents {agentsOpen ? "×" : "+"}
            </button>
          </div>
        </header>

        <section className={`afd-chat-area ${messages.length ? "has-messages" : ""}`}>
          {messages.length === 0 ? (
            <div className="afd-welcome">
              <div className="afd-welcome-symbol">✦</div>
              <div className="afd-welcome-label">YOUR AI WORKSPACE</div>
              <h1>What can I help you with?</h1>
              <p>
                Ask questions, explore ideas, and work through problems
                with your local AI model.
              </p>

              <div className="afd-suggestion-grid">
                {suggestions.map((item) => (
                  <button
                    className="afd-suggestion"
                    key={item.title}
                    type="button"
                    onClick={() => sendMessage(item.prompt)}
                  >
                    <span className="afd-suggestion-icon">{item.icon}</span>
                    <b>{item.title}</b>
                    <small>{item.description}</small>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="afd-messages">
              {messages.map((message, index) => (
                <article className={`afd-message ${message.role}`} key={index}>
                  <div className="afd-message-avatar">
                    {message.role === "user" ? "M" : "✦"}
                  </div>
                  <div className="afd-message-body">
                    <b>{message.role === "user" ? "You" : "AgentFlow AI"}</b>
                    <p>{message.content}</p>
                    {message.model && (
                      <small className="afd-response-model">
                        Model: {message.model}
                      </small>
                    )}
                  </div>
                </article>
              ))}
              {busy && (
                <div className="afd-thinking">
                  <span className="afd-spinner" />
                  Thinking with Ollama...
                </div>
              )}
            </div>
          )}
        </section>

        <div className="afd-composer-wrap">
          {selectedFile && (
            <div className="afd-file-chip">
              <span>▤</span> {selectedFile.name}
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                aria-label="Remove selected file"
              >×</button>
              <small>File selected; its contents are not uploaded yet.</small>
            </div>
          )}

          {error && <div className="afd-error" role="alert">{error}</div>}

          <form
            className="afd-composer"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Message AgentFlow AI..."
              rows={2}
              disabled={busy}
              aria-label="Message AgentFlow AI"
            />

            <div className="afd-composer-footer">
              <div className="afd-composer-tools">
                <label className="afd-tool" title="Select a document">
                  ＋ Attach file
                  <input
                    id="afd-file"
                    type="file"
                    accept=".pdf,.txt,.csv,.doc,.docx"
                    hidden
                    onChange={attachFile}
                  />
                </label>
                <span className="afd-local-note"><span /> Local AI</span>
              </div>

              <button
                className="afd-send"
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send message"
              >
                {busy ? "…" : "↑"}
              </button>
            </div>
          </form>

          <p className="afd-disclaimer">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </section>

      {agentsOpen && (
        <>
          <button
            className="afd-panel-backdrop"
            aria-label="Close agents panel"
            onClick={() => setAgentsOpen(false)}
            type="button"
          />
          <aside className="afd-right-panel">
            <header className="afd-panel-heading">
              <div>
                <h3>AI agents</h3>
                <p>Optional workspace tools</p>
              </div>
              <button
                type="button"
                onClick={() => setAgentsOpen(false)}
                aria-label="Close agents panel"
              >×</button>
            </header>

            <div className="afd-agent-info">
              <span>✦</span>
              <p>Specialized agents can be connected to your research workflow.</p>
            </div>

            {agents.map((agent) => (
              <article className="afd-agent" key={agent.name}>
                <span className={`afd-agent-icon ${agent.tone}`}>{agent.icon}</span>
                <div>
                  <b>{agent.name}</b>
                  <small>{agent.desc}</small>
                </div>
              </article>
            ))}

            <p className="afd-agent-footnote">
              These are currently agent options in the interface.
              Independent agent execution requires a configured workflow.
            </p>
          </aside>
        </>
      )}
    </main>
  );
}
