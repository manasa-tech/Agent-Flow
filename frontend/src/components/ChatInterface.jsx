import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  User,
  Bot,
  Copy,
  Check,
  FilePlus,
  Sparkles,
  Trash2,
  Clock,
  AlertTriangle,
  Flame,
} from 'lucide-react';

const SUGGESTED_QUERIES = [
  'What are the core design patterns for autonomous multi-agent LLM systems?',
  'Compare local Ollama inference against cloud API models for private research.',
  'How do embeddings and ChromaDB vector retrieval reduce LLM hallucinations?',
  'Explain the trade-offs between speed and reasoning in Llama 3.2 3B vs Qwen 3.',
];

export default function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  selectedModel,
  onAddToReport,
  onExtractEvidence,
  onClearChat,
  isBackendOnline,
}) {
  const [inputPrompt, setInputPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;
    onSendMessage(inputPrompt.trim(), temperature);
    setInputPrompt('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePromptSelect = (prompt) => {
    setInputPrompt(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="chat-container">
      {/* Chat Header / Actions */}
      <div className="chat-header">
        <div className="chat-title-group">
          <h2 className="chat-title">Research Inquiries & Dialogue</h2>
          <span className="chat-model-indicator font-mono">
            Model: {selectedModel || 'qwen3:latest'}
          </span>
        </div>
        {messages.length > 0 && (
          <button
            className="clear-chat-btn"
            onClick={onClearChat}
            title="Clear conversation history"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Messages Stream */}
      <div className="messages-stream">
        {messages.length === 0 ? (
          <div className="empty-chat-state">
            <div className="empty-icon-circle">
              <Sparkles size={28} className="empty-sparkle-icon" />
            </div>
            <h3 className="empty-title">Start Your Research Investigation</h3>
            <p className="empty-description">
              Submit a research topic or technical question to query your local Ollama model directly.
              Responses can be promoted to your synthesized report or extracted as verified evidence.
            </p>

            <div className="suggested-queries-group">
              <span className="suggested-header">Suggested Research Topics:</span>
              <div className="suggested-grid">
                {SUGGESTED_QUERIES.map((query, idx) => (
                  <button
                    key={idx}
                    className="suggested-chip"
                    onClick={() => handlePromptSelect(query)}
                  >
                    <span>{query}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-bubble-wrapper ${
                msg.role === 'user' ? 'message-user' : 'message-assistant'
              }`}
            >
              <div className="message-avatar">
                {msg.role === 'user' ? (
                  <User size={16} />
                ) : (
                  <Bot size={16} />
                )}
              </div>

              <div className="message-content-box">
                <div className="message-meta-row">
                  <span className="message-sender-name">
                    {msg.role === 'user' ? 'Researcher' : 'AgentFlow AI'}
                  </span>
                  {msg.modelUsed && (
                    <span className="message-model-tag font-mono">
                      {msg.modelUsed}
                    </span>
                  )}
                  {msg.elapsedMs && (
                    <span className="message-latency font-mono">
                      <Clock size={11} />
                      {(msg.elapsedMs / 1000).toFixed(2)}s
                    </span>
                  )}
                  <span className="message-timestamp">{msg.timestamp}</span>
                </div>

                <div className="message-text">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>

                {msg.role === 'assistant' && !msg.isError && (
                  <div className="message-actions-row">
                    <button
                      className="msg-action-btn"
                      onClick={() => handleCopy(msg.id, msg.text)}
                      title="Copy response to clipboard"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check size={13} className="text-emerald" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {onAddToReport && (
                      <button
                        className="msg-action-btn"
                        onClick={() => onAddToReport(msg.text, msg.modelUsed)}
                        title="Add response to final research report"
                      >
                        <FilePlus size={13} />
                        <span>Add to Report</span>
                      </button>
                    )}

                    {onExtractEvidence && (
                      <button
                        className="msg-action-btn"
                        onClick={() => onExtractEvidence(msg.text, msg.modelUsed)}
                        title="Extract as reference evidence"
                      >
                        <Sparkles size={13} />
                        <span>Extract Evidence</span>
                      </button>
                    )}
                  </div>
                )}

                {msg.isError && (
                  <div className="message-error-flag">
                    <AlertTriangle size={14} />
                    <span>Inference Error. Check if backend and Ollama are running.</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Live Loading Indicator */}
        {isLoading && (
          <div className="message-bubble-wrapper message-assistant">
            <div className="message-avatar">
              <Bot size={16} className="animate-spin" />
            </div>
            <div className="message-content-box loading-content-box">
              <div className="loading-dots">
                <span className="loading-label">
                  Generating research findings with <strong>{selectedModel}</strong>...
                </span>
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
                <span className="dot dot-3"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Backend Offline Banner */}
      {!isBackendOnline && (
        <div className="backend-warning-banner">
          <AlertTriangle size={16} />
          <span>
            Backend is offline or unreachable at <code className="code-pill">http://127.0.0.1:8000</code>.
            Run <code className="code-pill">backend\venv\Scripts\python.exe -m uvicorn app.main:app --reload</code> in your terminal.
          </span>
        </div>
      )}

      {/* Input Form */}
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="input-controls-row">
          <div className="temperature-control" title="Sampling temperature (lower = factual/precise, higher = creative)">
            <Flame size={13} className="temp-icon" />
            <span className="temp-label">Temp: {temperature.toFixed(1)}</span>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="temp-slider"
            />
          </div>
          <span className="input-hint">Ctrl + Enter to send</span>
        </div>

        <div className="chat-input-row">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder={
              isBackendOnline
                ? `Enter a research query for ${selectedModel || 'Ollama'}...`
                : 'Connect backend server to enable queries...'
            }
            value={inputPrompt}
            onChange={(e) => {
              setInputPrompt(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
            }}
            onKeyDown={handleKeyDown}
            rows={2}
            disabled={isLoading || !isBackendOnline}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!inputPrompt.trim() || isLoading || !isBackendOnline}
            title="Submit research query"
          >
            {isLoading ? (
              <span className="animate-spin inline-block">⏳</span>
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
