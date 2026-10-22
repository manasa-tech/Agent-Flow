import React, { useState } from 'react';
import {
  Search,
  BrainCircuit,
  FileText,
  ShieldCheck,
  ArrowRight,
  Info,
  Terminal,
  Zap,
} from 'lucide-react';
import StatusBadge, { STATUS_TYPES } from './StatusBadge';
import { checkMultiAgentPipelineStatus } from '../services/api';

const AGENTS = [
  {
    id: 'research',
    name: 'Research Agent',
    role: 'Decomposition & Discovery',
    description: 'Deconstructs inquiries into targeted sub-questions and extracts foundational evidence.',
    icon: Search,
    color: '#38bdf8',
  },
  {
    id: 'analysis',
    name: 'Analysis Agent',
    role: 'Synthesis & Trade-offs',
    description: 'Identifies conceptual patterns, evaluates opposing viewpoints, and isolates knowledge gaps.',
    icon: BrainCircuit,
    color: '#818cf8',
  },
  {
    id: 'writer',
    name: 'Report Writer Agent',
    role: 'Comprehensive Drafting',
    description: 'Structures findings into executive summaries, detailed thematic sections, and conclusions.',
    icon: FileText,
    color: '#fbbf24',
  },
  {
    id: 'verifier',
    name: 'Verification Agent',
    role: 'Fact-Checking & Auditing',
    description: 'Audits assertions against ground truth premises and detects potential hallucinations.',
    icon: ShieldCheck,
    color: '#34d399',
  },
];

export default function AgentWorkflowPanel({
  agentStatuses = {},
  activeAgentId = null,
  pipelineRunning = false,
  onTriggerPipeline,
}) {
  const [pipelineCheckResult, setPipelineCheckResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckPipeline = async () => {
    setIsChecking(true);
    const result = await checkMultiAgentPipelineStatus();
    setPipelineCheckResult(result);
    setIsChecking(false);
  };

  return (
    <div className="agent-workflow-card">
      <div className="panel-header-row">
        <div>
          <h2 className="panel-title">
            <BrainCircuit size={18} className="panel-title-icon" />
            Agent Workflow Pipeline
          </h2>
          <p className="panel-description">
            4 specialized agents collaborating through iterative refinement
          </p>
        </div>
        <div className="pipeline-mode-badge">
          <Zap size={13} className="mode-icon" />
          <span>Multi-Agent Engine</span>
        </div>
      </div>

      {/* Agents Grid / Flow */}
      <div className="agents-flow-container">
        {AGENTS.map((agent, index) => {
          const Icon = agent.icon;
          const status = agentStatuses[agent.id] || STATUS_TYPES.WAITING;
          const isActive = activeAgentId === agent.id;

          return (
            <div key={agent.id} className="agent-flow-step">
              <div
                className={`agent-card ${isActive ? 'agent-card-active' : ''} ${
                  status === STATUS_TYPES.RUNNING ? 'agent-card-running' : ''
                }`}
                style={{ '--agent-accent': agent.color }}
              >
                <div className="agent-card-top">
                  <div className="agent-icon-wrapper" style={{ color: agent.color }}>
                    <Icon size={18} />
                    <span className="agent-index-badge">{index + 1}</span>
                  </div>
                  <StatusBadge status={status} size="sm" />
                </div>

                <div className="agent-card-body">
                  <h3 className="agent-name">{agent.name}</h3>
                  <span className="agent-role">{agent.role}</span>
                  <p className="agent-desc">{agent.description}</p>
                </div>
              </div>

              {index < AGENTS.length - 1 && (
                <div className="agent-connector">
                  <ArrowRight size={16} className="connector-arrow" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Transparent Pipeline Status Notice */}
      <div className="pipeline-notice-box">
        <div className="notice-icon-wrapper">
          <Info size={16} className="notice-icon" />
        </div>
        <div className="notice-content">
          <div className="notice-title">Pipeline Integration Status</div>
          <p className="notice-text">
            Individual model inference and real-time generation are <strong>live</strong> via Ollama (<code className="code-pill">/api/test-generate</code>).
            The 4-agent sequential orchestrator endpoint (<code className="code-pill">/api/research</code>) is part of Phase 2.
          </p>
          <div className="notice-actions">
            <button
              className="check-endpoint-btn"
              onClick={handleCheckPipeline}
              disabled={isChecking}
            >
              <Terminal size={13} />
              <span>{isChecking ? 'Probing /api/research...' : 'Check Pipeline Endpoint'}</span>
            </button>

            {pipelineCheckResult && (
              <span className={`endpoint-status-pill ${pipelineCheckResult.available ? 'status-ready' : 'status-pending'}`}>
                {pipelineCheckResult.available
                  ? 'Endpoint Activated'
                  : 'Endpoint In Development (Phase 2)'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
