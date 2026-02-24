import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-200 text-gray-700',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-accent/10 text-accent',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-1
        text-small font-medium rounded-full
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

const statusConfig: Record<Status, { label: string; variant: BadgeVariant; bgColor: string }> = {
  active: { label: 'Active', variant: 'success', bgColor: 'bg-success' },
  pending: { label: 'Pending', variant: 'warning', bgColor: 'bg-warning' },
  rejected: { label: 'Rejected', variant: 'danger', bgColor: 'bg-danger' },
  draft: { label: 'Draft', variant: 'default', bgColor: 'bg-steel' },
  completed: { label: 'Completed', variant: 'info', bgColor: 'bg-accent' },
  processing: { label: 'Processing', variant: 'info', bgColor: 'bg-accent' },
  shipped: { label: 'Shipped', variant: 'info', bgColor: 'bg-accent' },
  delivered: { label: 'Delivered', variant: 'success', bgColor: 'bg-success' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showDot = true,
}) => {
  const config = statusConfig[status];
  
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1
        text-small font-medium rounded-full
        ${config.variant === 'success' ? 'bg-success/10 text-success' : ''}
        ${config.variant === 'warning' ? 'bg-warning/10 text-warning' : ''}
        ${config.variant === 'danger' ? 'bg-danger/10 text-danger' : ''}
        ${config.variant === 'info' ? 'bg-accent/10 text-accent' : ''}
        ${config.variant === 'default' ? 'bg-surface-300 text-gray-600' : ''}
      `}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.bgColor}`} />
      )}
      {config.label}
    </span>
  );
};

export default Badge;
