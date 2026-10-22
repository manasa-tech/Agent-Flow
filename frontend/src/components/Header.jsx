import React from 'react';
import { Bot, RefreshCw, Cpu, Server, Activity, ChevronDown } from 'lucide-react';

export default function Header({
  healthInfo,
  models,
  selectedModel,
  onSelectModel,
  onRefreshHealth,
  isRefreshing,
}) {
  const isBackendOnline = healthInfo && healthInfo.status === 'online';
  const isOllamaHealthy =
    healthInfo && healthInfo.ollama && healthInfo.ollama.status === 'healthy';

  return (
    <header className="dashboard-header">
      <div className="header-brand">
        <div className="brand-logo-container">
          <Bot className="brand-logo-icon" size={24} />
          <div className="brand-glow"></div>
        </div>
        <div className="brand-text">
          <div className="brand-title-row">
            <h1 className="brand-title">AgentFlow <span className="brand-highlight">AI</span></h1>
            <span className="brand-tag">v0.1.0</span>
          </div>
          <p className="brand-subtitle">Autonomous Multi-Agent Research Assistant</p>
        </div>
      </div>

      <div className="header-controls">
        {/* Connection Status Badges */}
        <div className="connection-status-group">
          <div
            className={`connection-pill ${
              isBackendOnline ? 'pill-online' : 'pill-offline'
            }`}
            title={
              isBackendOnline
                ? 'Backend connected at http://127.0.0.1:8000'
                : 'Backend unreachable. Start with: uvicorn app.main:app'
            }
          >
            <Server size={14} className="pill-icon" />
            <span className="pill-text">Backend</span>
            <span className="status-dot"></span>
          </div>

          <div
            className={`connection-pill ${
              isOllamaHealthy ? 'pill-online' : 'pill-offline'
            }`}
            title={
              isOllamaHealthy
                ? `Ollama ${healthInfo.ollama.version || ''} healthy on localhost:11434`
                : 'Ollama service unreachable'
            }
          >
            <Activity size={14} className="pill-icon" />
            <span className="pill-text">
              Ollama {isOllamaHealthy ? healthInfo.ollama.version : ''}
            </span>
            <span className="status-dot"></span>
          </div>
        </div>

        {/* Model Selector */}
        <div className="model-selector-wrapper">
          <Cpu size={15} className="model-icon" />
          <select
            className="model-select"
            value={selectedModel}
            onChange={(e) => onSelectModel(e.target.value)}
            disabled={!isBackendOnline}
          >
            {models && models.length > 0 ? (
              models.map((model) => (
                <option key={model.name} value={model.name}>
                  {model.name} {model.name === 'qwen3:latest' ? '(Default - Reasoning)' : model.name === 'llama3.2:3b' ? '(Fast Inference)' : ''}
                </option>
              ))
            ) : (
              <>
                <option value="qwen3:latest">qwen3:latest (Default)</option>
                <option value="llama3.2:3b">llama3.2:3b (Fast)</option>
              </>
            )}
          </select>
          <ChevronDown size={14} className="select-arrow" />
        </div>

        {/* Refresh Button */}
        <button
          className="refresh-btn"
          onClick={onRefreshHealth}
          disabled={isRefreshing}
          title="Refresh connection status"
        >
          <RefreshCw
            size={16}
            className={`refresh-icon ${isRefreshing ? 'animate-spin' : ''}`}
          />
        </button>
      </div>
    </header>
  );
}
