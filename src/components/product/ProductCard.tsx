import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Download, ChevronRight } from 'lucide-react';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const categoryColors: Record<string, string> = {
    brass: 'bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-300 border border-accent-200 dark:border-accent-800',
    steel: 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300 border border-primary-200 dark:border-primary-800',
    machinery: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/40 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-800',
    precision: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
    hydraulic: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800',
    other: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700',
  };

  const categoryLabels: Record<string, string> = {
    brass: 'Brass Components',
    steel: 'SS Components',
    machinery: 'Machinery Components',
    precision: 'Precision Parts',
    hydraulic: 'Hydraulic Parts',
    other: 'Other',
  };

  return (
    <div className="group bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-primary-900 dark:to-surface-dark">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=400&q=80'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${categoryColors[product.category] || categoryColors.other}`}>
            {categoryLabels[product.category] || 'Product'}
          </span>
        </div>
        {product.brochure_url && (
          <div className="absolute top-3 right-3">
            <a
              href={product.brochure_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-surface-dark backdrop-blur-sm rounded-lg text-xs font-bold text-primary-700 dark:text-primary-300 hover:bg-accent-500 hover:text-white transition-all shadow-lg border border-neutral-200 dark:border-neutral-700"
            >
              <FileText size={12} />
              PDF
            </a>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
          {product.name}
        </h3>

        {(product.model_name || product.version) && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {product.model_name && (
              <div className="flex items-center gap-1.5 bg-primary-50 dark:bg-primary-900/50 px-2.5 py-1 rounded-md border border-primary-200 dark:border-primary-800">
                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">Model:</span>
                <span className="font-mono font-bold text-sm text-primary-800 dark:text-primary-200">{product.model_name}</span>
              </div>
            )}
            {product.version && (
              <div className="flex items-center gap-1.5 bg-secondary-50 dark:bg-secondary-900/50 px-2.5 py-1 rounded-md border border-secondary-200 dark:border-secondary-800">
                <span className="text-xs font-semibold text-secondary-600 dark:text-secondary-400">Ver:</span>
                <span className="font-mono font-bold text-sm text-secondary-800 dark:text-secondary-200">{product.version}</span>
              </div>
            )}
          </div>
        )}

        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mb-3 p-3 bg-neutral-50 dark:bg-primary-900/30 rounded-lg border border-neutral-100 dark:border-neutral-700">
            <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">Specifications</p>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
                <div key={key} className="text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400 font-semibold">{key}:</span>{' '}
                  <span className="text-neutral-700 dark:text-neutral-200 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-2 leading-relaxed">
          {product.short_description}
        </p>

        <Link
          to={`/products/${product.category}/${product.slug}`}
          className="inline-flex items-center justify-between w-full gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 text-white font-bold rounded-lg transition-all group/btn shadow-md hover:shadow-lg"
        >
          <span>View Details</span>
          <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

interface ProductCardSkeletonProps {
  count?: number;
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-pulse">
          <div className="h-48 bg-gray-200 dark:bg-gray-800" />
          <div className="p-5">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded mb-3 w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2 w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-4 w-full" />
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );
};
