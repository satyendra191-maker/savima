import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5
        text-xs font-medium rounded-full
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

type Status = 'active' | 'pending' | 'rejected' | 'draft' | 'completed' | 'processing' | 'shipped' | 'delivered';

interface StatusBadgeProps {
  status: Status;
  showDot?: boolean;
}

const statusConfig: Record<Status, { label: string; variant: BadgeVariant; bgClass: string }> = {
  active: { label: 'Active', variant: 'success', bgClass: 'bg-green-500' },
  pending: { label: 'Pending', variant: 'warning', bgClass: 'bg-amber-500' },
  rejected: { label: 'Rejected', variant: 'danger', bgClass: 'bg-red-500' },
  draft: { label: 'Draft', variant: 'default', bgClass: 'bg-slate-500' },
  completed: { label: 'Completed', variant: 'info', bgClass: 'bg-blue-500' },
  processing: { label: 'Processing', variant: 'info', bgClass: 'bg-blue-500' },
  shipped: { label: 'Shipped', variant: 'info', bgClass: 'bg-blue-500' },
  delivered: { label: 'Delivered', variant: 'success', bgClass: 'bg-green-500' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showDot = true,
}) => {
  const config = statusConfig[status];
  
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2 py-0.5
        text-xs font-medium rounded-full
        ${config.variant === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400' : ''}
        ${config.variant === 'warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400' : ''}
        ${config.variant === 'danger' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400' : ''}
        ${config.variant === 'info' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400' : ''}
        ${config.variant === 'default' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200' : ''}
      `}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.bgClass}`} />
      )}
      {config.label}
    </span>
  );
};

export default Badge;
