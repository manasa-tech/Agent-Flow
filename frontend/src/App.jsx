import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AgentWorkflowPanel from './components/AgentWorkflowPanel';
import ChatInterface from './components/ChatInterface';
import ReportPanel from './components/ReportPanel';
import EvidencePanel from './components/EvidencePanel';
import { STATUS_TYPES } from './components/StatusBadge';
import { getHealth, getModels, testGenerate } from './services/api';
import {
  MessageSquare,
  FileText,
  Layers,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import './App.css';

export default function App() {
  // Backend & Model State
  const [healthInfo, setHealthInfo] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('qwen3:latest');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Chat & Generation State
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Active Tab for Laptop / Mobile responsive view
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'report' | 'evidence'

  // Agent Pipeline States
  const [agentStatuses, setAgentStatuses] = useState({
    research: STATUS_TYPES.WAITING,
    analysis: STATUS_TYPES.WAITING,
    writer: STATUS_TYPES.WAITING,
    verifier: STATUS_TYPES.WAITING,
  });
  const [activeAgentId, setActiveAgentId] = useState(null);

  // Report & Evidence Collections
  const [reportEntries, setReportEntries] = useState([]);
  const [evidenceList, setEvidenceList] = useState([]);

  // Load initial health and models
  const refreshSystemStatus = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [health, modelsData] = await Promise.all([getHealth(), getModels()]);
      setHealthInfo(health);

      if (modelsData && modelsData.models && modelsData.models.length > 0) {
        setModels(modelsData.models);
        // If current selectedModel is not in the list, default to health.default_model or first model
        const modelNames = modelsData.models.map((m) => m.name);
        if (!modelNames.includes(selectedModel)) {
          setSelectedModel(modelsData.default_model || modelNames[0]);
        }
      } else if (health && health.default_model) {
        setSelectedModel(health.default_model);
      }
    } catch (err) {
      console.error('Failed to load system status:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedModel]);

  useEffect(() => {
    refreshSystemStatus();
    // Poll health every 30 seconds
    const interval = setInterval(refreshSystemStatus, 30000);
    return () => clearInterval(interval);
  }, [refreshSystemStatus]);

  // Handle Send Message via real /api/test-generate
  const handleSendMessage = async (prompt, temperature = 0.7) => {
    const userMessageId = `msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Append user message
    const newMessages = [
      ...messages,
      {
        id: userMessageId,
        role: 'user',
        text: prompt,
        timestamp,
      },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    // 2. Set Research Agent to Running
    setActiveAgentId('research');
    setAgentStatuses((prev) => ({
      ...prev,
      research: STATUS_TYPES.RUNNING,
    }));

    // 3. Make real API call to backend
    const result = await testGenerate(prompt, selectedModel, temperature);
    setIsLoading(false);

    if (result.success) {
      // 4. Append real AI response
      setMessages([
        ...newMessages,
        {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant',
          text: result.response,
          modelUsed: result.model_used,
          elapsedMs: result.elapsedMs,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: false,
        },
      ]);

      // Complete Research step
      setAgentStatuses((prev) => ({
        ...prev,
        research: STATUS_TYPES.COMPLETED,
      }));
      setActiveAgentId(null);
    } else {
      // Failed call
      setMessages([
        ...newMessages,
        {
          id: `msg-${Date.now()}-err`,
          role: 'assistant',
          text: `Error contacting local LLM: ${result.error}`,
          modelUsed: selectedModel,
          elapsedMs: result.elapsedMs,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        },
      ]);

      setAgentStatuses((prev) => ({
        ...prev,
        research: STATUS_TYPES.FAILED,
      }));
      setActiveAgentId(null);
    }
  };

  // Add response to Report
  const handleAddToReport = (content, sourceModel) => {
    const newEntry = {
      id: `rep-${Date.now()}`,
      content,
      sourceModel: sourceModel || selectedModel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setReportEntries((prev) => [...prev, newEntry]);
    setAgentStatuses((prev) => ({
      ...prev,
      writer: STATUS_TYPES.COMPLETED,
    }));
    setActiveTab('report');
  };

  // Extract snippet as Evidence
  const handleExtractEvidence = (content, sourceModel) => {
    // Take first concise sentence or bullet point as key claim
    const firstSentence = content.split('\n')[0].replace(/^[-*•#\d.]+\s*/, '').trim();
    const newEvidence = {
      id: `ev-${Date.now()}`,
      claim: firstSentence.length > 20 ? firstSentence : content.slice(0, 180),
      sourceModel: sourceModel || selectedModel,
      confidence: 'High',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setEvidenceList((prev) => [newEvidence, ...prev]);
    setAgentStatuses((prev) => ({
      ...prev,
      verifier: STATUS_TYPES.COMPLETED,
    }));
    setActiveTab('evidence');
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all conversation messages?')) {
      setMessages([]);
      setAgentStatuses({
        research: STATUS_TYPES.WAITING,
        analysis: STATUS_TYPES.WAITING,
        writer: STATUS_TYPES.WAITING,
        verifier: STATUS_TYPES.WAITING,
      });
      setActiveAgentId(null);
    }
  };

  const handleClearReport = () => {
    if (window.confirm('Clear all findings from the research report?')) {
      setReportEntries([]);
      setAgentStatuses((prev) => ({ ...prev, writer: STATUS_TYPES.WAITING }));
    }
  };

  const handleClearEvidence = () => {
    if (window.confirm('Clear all evidence references?')) {
      setEvidenceList([]);
      setAgentStatuses((prev) => ({ ...prev, verifier: STATUS_TYPES.WAITING }));
    }
  };

  const isBackendOnline = healthInfo && healthInfo.status === 'online';

  return (
    <div className="agentflow-app">
      {/* Top Header */}
      <Header
        healthInfo={healthInfo}
        models={models}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        onRefreshHealth={refreshSystemStatus}
        isRefreshing={isRefreshing}
      />

      {/* Main Workspace Layout */}
      <main className="dashboard-main-content">
        {/* Agent Workflow Panel */}
        <section className="workflow-section">
          <AgentWorkflowPanel
            agentStatuses={agentStatuses}
            activeAgentId={activeAgentId}
            pipelineRunning={isLoading}
          />
        </section>

        {/* Tab Navigation for Panels */}
        <nav className="dashboard-tabs-bar">
          <button
            className={`tab-btn ${activeTab === 'chat' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={16} />
            <span>Research Chat</span>
            {messages.length > 0 && <span className="tab-badge">{messages.length}</span>}
          </button>

          <button
            className={`tab-btn ${activeTab === 'report' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            <FileText size={16} />
            <span>Research Report</span>
            {reportEntries.length > 0 && <span className="tab-badge">{reportEntries.length}</span>}
          </button>

          <button
            className={`tab-btn ${activeTab === 'evidence' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('evidence')}
          >
            <Layers size={16} />
            <span>Evidence & Sources</span>
            {evidenceList.length > 0 && <span className="tab-badge">{evidenceList.length}</span>}
          </button>
        </nav>

        {/* Dynamic Multi-Column / Tab View */}
        <div className="workspace-grid">
          {/* Laptop Dual Pane View (Chat on left, Report/Evidence on right) */}
          <div className={`workspace-column chat-column ${activeTab === 'chat' ? 'column-visible-mobile' : 'column-hidden-mobile'}`}>
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              selectedModel={selectedModel}
              onAddToReport={handleAddToReport}
              onExtractEvidence={handleExtractEvidence}
              onClearChat={handleClearChat}
              isBackendOnline={isBackendOnline}
            />
          </div>

          <div className={`workspace-column side-column ${activeTab !== 'chat' ? 'column-visible-mobile' : 'column-hidden-mobile'}`}>
            {activeTab === 'evidence' ? (
              <EvidencePanel
                evidenceList={evidenceList}
                onAddEvidence={(item) => setEvidenceList((prev) => [item, ...prev])}
                onRemoveEvidence={(id) => setEvidenceList((prev) => prev.filter((e) => e.id !== id))}
                onClearEvidence={handleClearEvidence}
                selectedModel={selectedModel}
              />
            ) : (
              <ReportPanel
                reportEntries={reportEntries}
                onClearReport={handleClearReport}
                onRemoveEntry={(id) => setReportEntries((prev) => prev.filter((r) => r.id !== id))}
                selectedModel={selectedModel}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
