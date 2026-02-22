import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rectangular', 
  width, 
  height 
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm">
    <Skeleton height={200} className="w-full" />
    <div className="p-4 space-y-3">
      <Skeleton height={24} width="80%" />
      <Skeleton height={16} width="60%" />
      <div className="flex gap-2 pt-2">
        <Skeleton height={32} width={60} />
        <Skeleton height={32} width={60} />
      </div>
    </div>
  </div>
);

export const HeroSkeleton: React.FC = () => (
  <div className="relative h-screen min-h-[600px] bg-gray-900">
    <Skeleton variant="rectangular" className="absolute inset-0" />
    <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
      <Skeleton height={48} width={300} className="mb-4" />
      <Skeleton height={24} width={500} className="mb-2" />
      <Skeleton height={24} width={400} className="mb-8" />
      <div className="flex gap-4">
        <Skeleton height={48} width={160} />
        <Skeleton height={48} width={160} />
      </div>
    </div>
  </div>
);

export const BlogCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg">
    <Skeleton height={200} className="w-full" />
    <div className="p-6 space-y-3">
      <Skeleton height={12} width={80} />
      <Skeleton height={28} width="90%" />
      <Skeleton height={16} className="w-full" />
      <Skeleton height={16} width="70%" />
      <div className="flex gap-4 pt-4">
        <Skeleton height={16} width={100} />
        <Skeleton height={16} width={100} />
      </div>
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton height={16} width="40%" />
          <Skeleton height={12} width="25%" />
        </div>
        <Skeleton height={32} width={80} />
      </div>
    ))}
  </div>
);
