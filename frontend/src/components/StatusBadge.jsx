import React from 'react';
import { Clock, Play, CheckCircle2, AlertCircle } from 'lucide-react';

export const STATUS_TYPES = {
  WAITING: 'Waiting',
  RUNNING: 'Running',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
};

export default function StatusBadge({ status = STATUS_TYPES.WAITING, size = 'md' }) {
  const getStatusConfig = () => {
    switch (status) {
      case STATUS_TYPES.RUNNING:
        return {
          icon: <Play className="badge-icon animate-pulse" size={size === 'sm' ? 12 : 14} />,
          label: 'Running',
          className: 'status-badge-running',
        };
      case STATUS_TYPES.COMPLETED:
        return {
          icon: <CheckCircle2 className="badge-icon" size={size === 'sm' ? 12 : 14} />,
          label: 'Completed',
          className: 'status-badge-completed',
        };
      case STATUS_TYPES.FAILED:
        return {
          icon: <AlertCircle className="badge-icon" size={size === 'sm' ? 12 : 14} />,
          label: 'Failed',
          className: 'status-badge-failed',
        };
      case STATUS_TYPES.WAITING:
      default:
        return {
          icon: <Clock className="badge-icon" size={size === 'sm' ? 12 : 14} />,
          label: 'Waiting',
          className: 'status-badge-waiting',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`status-badge ${config.className} status-badge-${size}`}>
      {config.icon}
      <span className="status-label">{config.label}</span>
    </span>
  );
}
