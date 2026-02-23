import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product, Category } from '../src/types';
import { ProductService } from '../src/lib/supabase';
import { Search, ArrowRight, Package, Settings, Cpu } from 'lucide-react';
import { SEO } from '../src/components/SEO';
import { ProductCard } from '../src/components/product/ProductCard';
import { safeArray } from '../src/lib/safeUtils';

const CATEGORY_METADATA: Record<string, { title: string; description: string; icon?: React.ReactNode }> = {
  brass: {
    title: "Brass Components Manufacturer | Inserts, Fittings & Turned Parts",
    description: "Leading manufacturer of Brass Knurled Inserts, Sanitary Fittings, and Precision CNC Turned Components. ISO 9001:2015 certified, exporting globally from India.",
    icon: <Package className="w-6 h-6" />
  },
  steel: {
    title: "Stainless Steel Components | 316/304 Fittings & Fasteners",
    description: "Premium Stainless Steel Hydraulic Fittings, Anchor Bolts, and heavy-duty industrial fasteners. Corrosion resistant SS 316/304 grade manufacturing.",
    icon: <Settings className="w-6 h-6" />
  },
  machinery: {
    title: "Machinery Components | Precision CNC & Turned Parts",
    description: "High-precision machinery components, CNC turned parts, and custom manufacturing solutions for industrial applications.",
    icon: <Cpu className="w-6 h-6" />
  },
  precision: {
    title: "Precision Components | CNC Machined Parts",
    description: "Precision engineered components with tight tolerances for automotive, electrical, and industrial applications.",
    icon: <Cpu className="w-6 h-6" />
  },
  other: {
    title: "Industrial Precision Components | Custom Manufacturing",
    description: "Custom industrial component manufacturing services. CNC machining, forging, and casting solutions for diverse global B2B industries."
  }
};

export const Products: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = category
          ? await ProductService.getByCategory(category)
          : await ProductService.getAll();
        setProducts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  // Debounce Search Term (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredProducts = safeArray<Product>(products).filter(p => {
    const term = debouncedSearch.toLowerCase();
    return (
      p?.name?.toLowerCase().includes(term) ||
      p?.short_description?.toLowerCase().includes(term) ||
      (p?.industry_usage && p.industry_usage.toLowerCase().includes(term))
    );
  });

  const displayTitle = category
    ? category === 'brass' ? 'Brass Components' : category === 'steel' ? 'Stainless Steel Components' : category === 'machinery' ? 'Machinery Components' : category === 'precision' ? 'Precision Parts' : 'Other Components'
    : 'All Products';

  // Use specific metadata if available, otherwise fallback to generic
  const seoData = (category && CATEGORY_METADATA[category])
    ? CATEGORY_METADATA[category]
    : {
      title: "Industrial Components Catalog | SAVIMAN Manufacturing",
      description: "Explore the complete catalog of precision brass and stainless steel components by SAVIMAN. Custom manufacturing for Automotive, Electrical, and Plumbing sectors."
    };

  const categoryInfo = (category && CATEGORY_METADATA[category]) ? CATEGORY_METADATA[category] : { title: '', description: '', icon: null };

  return (
    <div className="bg-gray-50 dark:bg-primary-900 min-h-screen py-16 transition-colors duration-500">
      <SEO title={seoData.title} description={seoData.description} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-gray-200 dark:border-primary-700 pb-8">
          <div className="max-w-2xl">
            {categoryInfo && categoryInfo.icon && (
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300 mb-4">
                {categoryInfo?.icon}
              </div>
            )}
            <h1 className="text-4xl font-extrabold text-primary-900 dark:text-white tracking-tight mb-3">
              {displayTitle}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {category ? categoryInfo?.description : "Precision manufactured industrial parts for global applications. ISO 9001:2015 certified manufacturer and exporter."}
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <Link 
              to="/rfq" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Request Quote
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 p-4 bg-white dark:bg-primary-800 rounded-xl shadow-sm border border-gray-200 dark:border-primary-700">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search components..."
              className="pl-10 pr-4 py-2.5 w-full bg-gray-50 dark:bg-primary-900 border border-gray-200 dark:border-primary-700 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-gray-900 dark:text-white placeholder-gray-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Link 
              to="/products" 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!category 
                ? 'bg-primary-700 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-primary-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-primary-700'}`}
            >
              All
            </Link>
            <Link 
              to="/products/brass" 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${category === 'brass' 
                ? 'bg-primary-700 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-primary-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-primary-700'}`}
            >
              Brass
            </Link>
            <Link 
              to="/products/precision" 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${category === 'precision' 
                ? 'bg-primary-700 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-primary-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-primary-700'}`}
            >
              Precision
            </Link>
            <Link 
              to="/products/steel" 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${category === 'steel' 
                ? 'bg-primary-700 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-primary-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-primary-700'}`}
            >
              SS Steel
            </Link>
            <Link 
              to="/products/machinery" 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${category === 'machinery' 
                ? 'bg-primary-700 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-primary-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-primary-700'}`}
            >
              Machinery
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeArray<Product>(filteredProducts).map((product) => (
              <ProductCard key={product?.id ?? Math.random()} product={product} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-primary-800 mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Products Found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};