
import { useState, useRef, useEffect } from "react";
import "./Dashboard.css";

const suggestions = [
  {
    icon: "✦",
    title: "Write something",
    description: "Create content, emails, and documents",
    prompt: "Help me write a professional email",
  },
  {
    icon: "⌘",
    title: "Code assistant",
    description: "Write, debug, and explain code",
    prompt: "Help me debug my code",
  },
  {
    icon: "◈",
    title: "Analyze data",
    description: "Understand data and find insights",
    prompt: "Help me analyze a dataset",
  },
  {
    icon: "⌕",
    title: "Research a topic",
    description: "Explore ideas and understand concepts",
    prompt: "Explain an interesting AI concept",
  },
];

const agentList = [
  { icon: "✦", name: "Research Agent", status: "Ready" },
  { icon: "⌘", name: "Coding Agent", status: "Ready" },
  { icon: "◈", name: "Data Agent", status: "Ready" },
  { icon: "✎", name: "Writing Agent", status: "Ready" },
];

const toolList = [
  { icon: "⌕", name: "Web Search" },
  { icon: "▤", name: "File Analysis" },
  { icon: "⌘", name: "Code Interpreter" },
];

export default function Dashboard() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [model, setModel] = useState("llama3.2");
  const [agentsOpen, setAgentsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeNav, setActiveNav] = useState("Chat");
  const fileRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function newChat() {
    setMessages([]);
    setInput("");
    setActiveChat(null);
    setError("");
    setSelectedFile(null);
    setActiveNav("Chat");
    inputRef.current?.focus();
  }

  function openChat(chat) {
    setActiveChat(chat.id);
    setMessages(chat.messages);
    setError("");
    setActiveNav("Chat");
  }

  async function sendMessage(text = input) {
    const prompt = text.trim();
    if ((!prompt && !selectedFile) || loading) return;

    const userText = selectedFile
      ? `${prompt}\n\nAttached file: ${selectedFile.name}`
      : prompt;

    const userMessage = {
      role: "user",
      content: userText,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setError("");
    setLoading(true);

    const chatId = activeChat || Date.now();
    const chatTitle =
      prompt.slice(0, 42) || selectedFile?.name || "New conversation";

    if (!activeChat) {
      setActiveChat(chatId);
      setRecentChats((previous) => [
        {
          id: chatId,
          title: chatTitle,
          messages: updatedMessages,
        },
        ...previous,
      ]);
    } else {
      setRecentChats((previous) =>
        previous.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: updatedMessages }
            : chat
        )
      );
    }

    setSelectedFile(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/test-generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: userText,
            message: userText,
            model,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = await response.json();

      const answer =
        data.response ??
        data.answer ??
        data.message ??
        data.generated_text ??
        data.output;

      if (typeof answer !== "string" || !answer.trim()) {
        throw new Error(
          "The backend response did not contain a text answer."
        );
      }

      const finalMessages = [
        ...updatedMessages,
        { role: "assistant", content: answer },
      ];

      setMessages(finalMessages);

      setRecentChats((previous) =>
        previous.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: finalMessages }
            : chat
        )
      );
    } catch (err) {
      setError(
        `Couldn't connect to the AI backend. ${err.message}. Check that FastAPI is running and the endpoint is correct.`
      );
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function startVoiceInput() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      setInput((previous) =>
        `${previous} ${event.results[0][0].transcript}`.trim()
      );
    };
    recognition.onerror = () => {
      setError("Voice input failed. Please check your microphone permission.");
    };
    recognition.start();
  }

  return (
    <div className="af-dashboard">
      <aside className="af-sidebar">
        <div className="af-brand">
          <div className="af-brand-icon">✦</div>
          <div>
            <h2>AgentFlow <span>AI</span></h2>
            <p>Your intelligent workspace</p>
          </div>
        </div>

        <button className="af-new-chat" onClick={newChat}>
          <span>＋</span> New conversation
          <span className="af-shortcut">⌘ K</span>
        </button>

        <div className="af-sidebar-label">WORKSPACE</div>

        <nav className="af-nav">
          {[
            ["✦", "Chat"],
            ["◈", "AI Agents"],
            ["▤", "My Files"],
            ["◷", "History"],
          ].map(([icon, label]) => (
            <button
              key={label}
              className={`af-nav-item ${
                activeNav === label ? "active" : ""
              }`}
              onClick={() => {
                setActiveNav(label);
                if (label === "Chat") inputRef.current?.focus();
              }}
            >
              <span className="af-nav-icon">{icon}</span>
              {label}
              {label === "AI Agents" && (
                <span className="af-nav-count">4</span>
              )}
            </button>
          ))}
        </nav>

        <div className="af-sidebar-label af-recent-label">
          RECENT CONVERSATIONS
        </div>

        <div className="af-recent-list">
          {recentChats.length === 0 ? (
            <p className="af-empty-recent">Your conversations will appear here.</p>
          ) : (
            recentChats.map((chat) => (
              <button
                key={chat.id}
                className={`af-recent-item ${
                  activeChat === chat.id ? "active" : ""
                }`}
                onClick={() => openChat(chat)}
                title={chat.title}
              >
                <span>◷</span>
                <span className="af-recent-title">{chat.title}</span>
              </button>
            ))
          )}
        </div>

        <div className="af-sidebar-bottom">
          <div className="af-plan-card">
            <div className="af-plan-top">
              <span className="af-plan-star">✦</span>
              <span>AgentFlow Pro</span>
            </div>
            <p>Unlock more possibilities with AI agents.</p>
            <button onClick={() => setError("Plan settings are not connected yet.")}>
              Explore plans <span>↗</span>
            </button>
          </div>

          <button className="af-profile">
            <div className="af-avatar">U</div>
            <div className="af-profile-text">
              <strong>Your account</strong>
              <span>Personal workspace</span>
            </div>
            <span className="af-profile-menu">•••</span>
          </button>
        </div>
      </aside>

      <main className="af-main">
        <header className="af-topbar">
          <div className="af-breadcrumb">
            <span>Workspace</span>
            <span className="af-breadcrumb-divider">/</span>
            <strong>{activeNav}</strong>
          </div>

          <div className="af-topbar-actions">
            <span className="af-status-dot" />
            <span className="af-status-text">AI services</span>
            <button
              className="af-panel-toggle"
              onClick={() => setAgentsOpen((value) => !value)}
              title="Toggle agents panel"
            >
              ▤
            </button>
          </div>
        </header>

        <div className="af-chat-area">
          {messages.length === 0 ? (
            <section className="af-welcome">
              <div className="af-welcome-badge">
                <span className="af-sparkle">✦</span>
                YOUR AI WORKSPACE
              </div>

              <h1>
                What can I help
                <br />
                you <span>accomplish?</span>
              </h1>

              <p className="af-welcome-description">
                One workspace. Multiple AI agents. Endless possibilities.
                <br className="af-desktop-break" />
                Tell me what you need, and let's make it happen.
              </p>

              <div className="af-suggestions">
                {suggestions.map((item) => (
                  <button
                    className="af-suggestion-card"
                    key={item.title}
                    onClick={() => sendMessage(item.prompt)}
                  >
                    <div className="af-suggestion-icon">{item.icon}</div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                    <span className="af-suggestion-arrow">↗</span>
                  </button>
                ))}
              </div>

              <div className="af-example-label">OR START WITH A PROMPT</div>

              <div className="af-quick-prompts">
                {[
                  "Explain a complex concept simply",
                  "Build me a project roadmap",
                  "Help me solve a coding problem",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                  >
                    <span>✧</span> {prompt} <span>↗</span>
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <section className="af-messages">
              {messages.map((message, index) => (
                <div
                  key={`${index}-${message.role}`}
                  className={`af-message af-message-${message.role}`}
                >
                  <div className="af-message-avatar">
                    {message.role === "user" ? "U" : "✦"}
                  </div>
                  <div className="af-message-body">
                    <div className="af-message-author">
                      {message.role === "user" ? "You" : "AgentFlow AI"}
                    </div>
                    <div className="af-message-content">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="af-message af-message-assistant">
                  <div className="af-message-avatar">✦</div>
                  <div className="af-message-body">
                    <div className="af-message-author">AgentFlow AI</div>
                    <div className="af-loading">
                      <span />
                      <span />
                      <span />
                      <small>Thinking...</small>
                    </div>
                  </div>
                </div>
              )}

              <div className="af-message-end" />
            </section>
          )}

          {error && (
            <div className="af-error">
              <span>⚠</span>
              <p>{error}</p>
              <button onClick={() => setError("")}>×</button>
            </div>
          )}

          <div className="af-composer-wrap">
            <div className="af-model-row">
              <label htmlFor="af-model">Model</label>
              <select
                id="af-model"
                value={model}
                onChange={(event) => setModel(event.target.value)}
              >
                <option value="llama3.2">Llama 3.2</option>
                <option value="qwen3">Qwen 3</option>
                <option value="mistral">Mistral</option>
              </select>
              <span className="af-model-local">● Local model</span>
            </div>

            <div className="af-composer">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message AgentFlow AI..."
                rows={2}
                aria-label="Message AgentFlow AI"
              />

              {selectedFile && (
                <div className="af-file-chip">
                  <span>▤</span>
                  {selectedFile.name}
                  <button
                    onClick={() => setSelectedFile(null)}
                    aria-label="Remove attachment"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="af-composer-bottom">
                <div className="af-composer-tools">
                  <button
                    title="Attach a file"
                    onClick={() => fileRef.current?.click()}
                  >
                    <span>＋</span> Attach
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    hidden
                    onChange={(event) =>
                      setSelectedFile(event.target.files?.[0] || null)
                    }
                  />
                  <button
                    title="Web search is not connected yet"
                    onClick={() =>
                      setError("Web search needs to be connected to your backend.")
                    }
                  >
                    ⌕ <span>Search</span>
                  </button>
                </div>

                <div className="af-composer-actions">
                  <button
                    className="af-voice-button"
                    onClick={startVoiceInput}
                    title="Voice input"
                  >
                    ♩
                  </button>
                  <button
                    className="af-send-button"
                    onClick={() => sendMessage()}
                    disabled={loading || (!input.trim() && !selectedFile)}
                    title="Send message"
                  >
                    {loading ? "…" : "↑"}
                  </button>
                </div>
              </div>
            </div>

            <p className="af-disclaimer">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </main>

      {agentsOpen && (
        <aside className="af-right-panel">
          <div className="af-panel-heading">
            <div>
              <h3>AI Workspace</h3>
              <p>Your intelligent team</p>
            </div>
            <button
              onClick={() => setAgentsOpen(false)}
              aria-label="Close AI workspace panel"
            >
              ×
            </button>
          </div>

          <div className="af-panel-section">
            <div className="af-section-title">
              <span>ACTIVE AGENTS</span>
              <span className="af-section-count">04</span>
            </div>

            <div className="af-agent-list">
              {agentList.map((agent, index) => (
                <div className="af-agent-item" key={agent.name}>
                  <div className={`af-agent-icon af-agent-icon-${index}`}>
                    {agent.icon}
                  </div>
                  <div className="af-agent-info">
                    <strong>{agent.name}</strong>
                    <span><i /> {agent.status}</span>
                  </div>
                  <span className="af-agent-menu">•••</span>
                </div>
              ))}
            </div>
          </div>

          <div className="af-panel-section af-tools-section">
            <div className="af-section-title">
              <span>AVAILABLE TOOLS</span>
              <span className="af-section-count">03</span>
            </div>

            <div className="af-tool-list">
              {toolList.map((tool) => (
                <button
                  className="af-tool-item"
                  key={tool.name}
                  onClick={() =>
                    setError(`${tool.name} is displayed as a preview and is not connected yet.`)
                  }
                >
                  <span className="af-tool-icon">{tool.icon}</span>
                  <span>{tool.name}</span>
                  <span className="af-tool-arrow">↗</span>
                </button>
              ))}
            </div>
          </div>

          <div className="af-activity-card">
            <div className="af-activity-icon">✧</div>
            <strong>Work smarter with agents</strong>
            <p>Delegate tasks to specialized AI agents and bring everything together in one place.</p>
            <button onClick={() => setActiveNav("AI Agents")}>
              Explore agents <span>→</span>
            </button>
          </div>

          <div className="af-panel-footer">
            <span className="af-footer-pulse" />
            All systems operational
            <span className="af-footer-version">v1.0</span>
          </div>
        </aside>
      )}
    </div>
  );
}
