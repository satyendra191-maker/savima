import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} border-b-brass-500 border-gray-200 rounded-full animate-spin`} />
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  );
};

export const LoadingOverlay: React.FC<{ show: boolean; text?: string }> = ({ show, text }) => {
  if (!show) return null;
  
  return (
    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-50">
      <LoadingSpinner size="lg" text={text || 'Loading...'} />
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-t-xl" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4 px-6">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <div className="h-8 flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-8 flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
};

export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
