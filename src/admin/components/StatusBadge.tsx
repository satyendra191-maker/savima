import React from 'react';

type Status = 'active' | 'inactive' | 'published' | 'draft' | 'pending' | 'completed' | 'new' | 'responded' | 'closed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'rejected' | 'featured';

interface StatusBadgeProps {
  status: string;
  className?: string;
  onClick?: () => void;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Active' },
  inactive: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400', label: 'Inactive' },
  published: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Published' },
  draft: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400', label: 'Draft' },
  pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Pending' },
  completed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Completed' },
  new: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'New' },
  responded: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', label: 'Responded' },
  closed: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400', label: 'Closed' },
  processing: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Processing' },
  shipped: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'Shipped' },
  delivered: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Delivered' },
  cancelled: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Cancelled' },
  rejected: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Rejected' },
  featured: { bg: 'bg-brass-100 dark:bg-brass-900/30', text: 'text-brass-700 dark:text-brass-400', label: 'Featured' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', onClick }) => {
  const config = statusConfig[status.toLowerCase()] || { 
    bg: 'bg-gray-100 dark:bg-gray-700', 
    text: 'text-gray-600 dark:text-gray-400', 
    label: status 
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
    >
      {config.label}
    </span>
  );
};

export const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}> = ({ checked, onChange, disabled = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6'
  };

  const knobClasses = {
    sm: 'translate-x-4',
    md: 'translate-x-5'
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`${sizeClasses[size]} relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brass-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed ${checked ? 'bg-brass-500' : 'bg-gray-200 dark:bg-gray-600'}`}
    >
      <span
        className={`pointer-events-none inline-block ${sizeClasses[size]} transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? knobClasses[size] : 'translate-x-0'}`}
      />
    </button>
  );
};

export const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    high: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'High' },
    normal: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400', label: 'Normal' },
    low: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'Low' }
  };

  const { bg, text, label } = config[priority.toLowerCase()] || config.normal;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
