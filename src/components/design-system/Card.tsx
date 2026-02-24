import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg
        shadow-card border border-surface-200
        ${paddingStyles[padding]}
        ${hover ? 'hover:shadow-elevated transition-shadow duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-card-title text-navy">{title}</h3>
        {description && (
          <p className="text-small text-gray-500 mt-1">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default Card;
