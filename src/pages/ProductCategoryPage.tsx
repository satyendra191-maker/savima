import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Grid, List, ChevronRight } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '../components/product/ProductCard';
import type { Product } from '../types';
import { supabase } from '../lib/supabase';
import { DEFAULT_ICON, safeArray as useSafeArray } from '../lib/safeUtils';

interface ProductCategoryPageProps {
  category?: string;
}

const categoryInfo: Record<string, { title: string; description: string; icon: string; color: string; gradient: string }> = {
  brass: {
    title: 'Brass Components',
    description: 'High-quality brass inserts, terminals, fittings, and turned parts for various industrial applications.',
    icon: '🔩',
    color: 'text-accent-500',
    gradient: 'from-accent-500 to-accent-700'
  },
  steel: {
    title: 'SS Components',
    description: 'Stainless steel fasteners, fittings, and components designed for corrosion resistance and durability.',
    icon: '⚙️',
    color: 'text-primary-500',
    gradient: 'from-primary-500 to-primary-700'
  },
  machinery: {
    title: 'Machinery Components',
    description: 'Precision-engineered machinery components including turned parts, CNC machined parts, and custom solutions.',
    icon: '⚡',
    color: 'text-secondary-500',
    gradient: 'from-secondary-500 to-secondary-700'
  },
  precision: {
    title: 'Precision Components',
    description: 'High-precision components for aerospace, automotive, and specialized industrial applications.',
    icon: '🎯',
    color: 'text-purple-500',
    gradient: 'from-purple-500 to-purple-700'
  },
  hydraulic: {
    title: 'Hydraulic Components',
    description: 'Hydraulic fittings, valves, and components for fluid power systems.',
    icon: '🔧',
    color: 'text-cyan-500',
    gradient: 'from-cyan-500 to-cyan-700'
  },
};

export const ProductCategoryPage: React.FC<ProductCategoryPageProps> = ({ category: propCategory }) => {
  const params = useParams();
  const category = propCategory || params.category || 'brass';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*')
          .eq('category', category)
          .eq('status', 'published')
          .order('name', { ascending: true });

        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchQuery]);

  const info = categoryInfo[category] || { title: 'Products', description: 'Browse our complete product catalog.', icon: '📦', color: 'text-primary-500', gradient: 'from-primary-500 to-primary-700' };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-slate-900">
      <div className={`bg-gradient-to-r ${info.gradient} dark:from-primary-700 dark:to-primary-900 py-16 pt-24`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/80 mb-4">
            <Link to="/" className="hover:text-white transition-colors font-medium">Home</Link>
            <ChevronRight size={14} />
            <Link to="/products" className="hover:text-white transition-colors font-medium">Products</Link>
            <ChevronRight size={14} />
            <span className="text-white font-semibold">{info.title}</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{info?.icon || DEFAULT_ICON}</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">{info?.title || 'Products'}</h1>
          </div>
          <p className="text-white/90 max-w-2xl text-lg leading-relaxed">
            {info.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-10 pr-4 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-surface-dark text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-soft"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {products.length} products found
            </span>
            <div className="flex items-center gap-1 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg p-1 bg-white dark:bg-surface-dark">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary-500 text-white shadow-md' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary-500 text-white shadow-md' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            <ProductCardSkeleton count={6} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-surface-dark rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-soft">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No products found</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
              {searchQuery ? `No results for "${searchQuery}"` : 'No products available in this category yet.'}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {useSafeArray<Product>(products).map((product) => (
              <ProductCard key={product?.id ?? Math.random()} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCategoryPage;
