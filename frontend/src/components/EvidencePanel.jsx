import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function EvidencePanel({
  evidenceList = [],
  onAddEvidence,
  onRemoveEvidence,
  onClearEvidence,
  selectedModel,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [claimText, setClaimText] = useState('');
  const [confidence, setConfidence] = useState('High');

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!claimText.trim()) return;

    onAddEvidence({
      id: `ev-${Date.now()}`,
      claim: claimText.trim(),
      sourceModel: selectedModel || 'Manual Citation',
      confidence,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setClaimText('');
    setIsAdding(false);
  };

  const getConfidenceBadge = (conf) => {
    switch (conf) {
      case 'High':
        return {
          icon: <ShieldCheck size={12} />,
          className: 'confidence-high',
          label: 'High Confidence',
        };
      case 'Medium':
        return {
          icon: <ShieldAlert size={12} />,
          className: 'confidence-medium',
          label: 'Medium Confidence',
        };
      case 'Needs Review':
      default:
        return {
          icon: <ShieldAlert size={12} />,
          className: 'confidence-low',
          label: 'Needs Verification',
        };
    }
  };

  return (
    <div className="evidence-panel-card">
      <div className="evidence-header-row">
        <div className="evidence-title-group">
          <Layers size={18} className="evidence-title-icon" />
          <div>
            <h2 className="evidence-title">Evidence & Source Grounding</h2>
            <span className="evidence-count-tag">
              {evidenceList.length} {evidenceList.length === 1 ? 'Reference' : 'References'} Tracked
            </span>
          </div>
        </div>

        <div className="evidence-action-buttons">
          <button
            className="evidence-btn btn-primary"
            onClick={() => setIsAdding(!isAdding)}
          >
            <Plus size={14} />
            <span>Add Evidence</span>
          </button>

          {evidenceList.length > 0 && (
            <button
              className="evidence-btn btn-danger"
              onClick={onClearEvidence}
              title="Clear all evidence entries"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Manual Add Form */}
      {isAdding && (
        <form className="evidence-add-form" onSubmit={handleManualAdd}>
          <textarea
            className="evidence-textarea"
            placeholder="Enter key factual claim, source citation, or verified premise..."
            value={claimText}
            onChange={(e) => setClaimText(e.target.value)}
            rows={3}
            autoFocus
          />
          <div className="evidence-form-footer">
            <div className="confidence-select-group">
              <label className="confidence-label">Confidence:</label>
              <select
                className="confidence-select"
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
              >
                <option value="High">High Confidence</option>
                <option value="Medium">Medium Confidence</option>
                <option value="Needs Review">Needs Verification</option>
              </select>
            </div>
            <div className="form-button-group">
              <button
                type="button"
                className="evidence-btn btn-secondary"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="evidence-btn btn-primary"
                disabled={!claimText.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Evidence List */}
      <div className="evidence-body">
        {evidenceList.length === 0 ? (
          <div className="empty-evidence-state">
            <div className="empty-evidence-icon-box">
              <Sparkles size={28} className="empty-evidence-icon" />
            </div>
            <h3 className="empty-evidence-title">No Citations or Evidence Tracked</h3>
            <p className="empty-evidence-desc">
              Extract assertions from your research inquiries using <strong>"Extract Evidence"</strong> in the chat, or add factual citations directly using the button above.
            </p>
          </div>
        ) : (
          <div className="evidence-cards-grid">
            {evidenceList.map((item) => {
              const confConfig = getConfidenceBadge(item.confidence);
              return (
                <div key={item.id} className="evidence-item-card">
                  <div className="evidence-item-top">
                    <span className={`confidence-pill ${confConfig.className}`}>
                      {confConfig.icon}
                      <span>{confConfig.label}</span>
                    </span>
                    <div className="evidence-meta-right">
                      <span className="evidence-model-tag font-mono">
                        {item.sourceModel || selectedModel}
                      </span>
                      <button
                        className="evidence-del-btn"
                        onClick={() => onRemoveEvidence(item.id)}
                        title="Remove evidence"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <p className="evidence-claim-text">{item.claim}</p>

                  <div className="evidence-item-bottom">
                    <span className="evidence-time">Logged: {item.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
