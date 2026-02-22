import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../src/types';
import { ProductService } from '../src/lib/supabase';
import { Check, ArrowLeft, FileText, Download, Ruler, Gauge, Weight, Box } from 'lucide-react';
import { SEO } from '../src/components/SEO';

const categoryColors: Record<string, string> = {
  brass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  steel: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  machinery: 'bg-primary-100 text-primary-800 dark:bg-primary-800/30 dark:text-primary-300',
  precision: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  hydraulic: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

const categoryLabels: Record<string, string> = {
  brass: 'Brass Components',
  steel: 'SS Components',
  machinery: 'Machinery Components',
  precision: 'Precision Parts',
  hydraulic: 'Hydraulic Parts',
  other: 'Other',
};

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
        if (!slug) return;
        setLoading(true);
        const data = await ProductService.getBySlug(slug);
        setProduct(data);
        setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-primary-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-primary-900">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h2>
        <Link to="/products" className="text-accent-500 hover:text-accent-600 font-medium">
          Return to Products
        </Link>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-primary-900 min-h-screen py-12 transition-colors duration-500">
      <SEO 
        title={product.meta_title || product.name} 
        description={product.meta_description || product.short_description} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link to="/products" className="text-gray-500 dark:text-gray-400 hover:text-accent-500 transition-colors">
            Products
          </Link>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          <Link 
            to={`/products/${product.category}`} 
            className="text-gray-500 dark:text-gray-400 hover:text-accent-500 transition-colors capitalize"
          >
            {categoryLabels[product.category] || product.category}
          </Link>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          <span className="text-gray-900 dark:text-white font-medium truncate">{product.name}</span>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Section */}
          <div className="order-2 lg:order-1">
            <div className="bg-white dark:bg-primary-800 rounded-2xl overflow-hidden aspect-square shadow-lg border border-gray-200 dark:border-primary-700">
              <img 
                src={product.image_url || 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80'} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Download Brochure Button */}
            {product.brochure_url && (
              <a
                href={product.brochure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-500 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <FileText size={20} />
                Download Product Brochure
                <Download size={16} />
              </a>
            )}
          </div>

          {/* Info Section */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${categoryColors[product.category] || categoryColors.other}`}>
                {categoryLabels[product.category] || product.category}
              </span>
              {(product.model_name || product.version) && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {product.model_name && <span className="font-mono font-semibold text-primary-700 dark:text-primary-300">Model: {product.model_name}</span>}
                  {product.model_name && product.version && <span className="mx-2">|</span>}
                  {product.version && <span className="font-mono font-semibold text-secondary-700 dark:text-secondary-300">v{product.version}</span>}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary-900 dark:text-white mb-4 leading-tight">
              {product.name}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {product.long_description}
            </p>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="bg-white dark:bg-primary-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-primary-700 shadow-sm">
                <h3 className="text-base font-bold text-primary-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Ruler size={18} className="text-accent-500" />
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-primary-900/50 rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-700 flex items-center justify-center text-primary-600 dark:text-primary-300 flex-shrink-0">
                        <Gauge size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{key}</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Highlights */}
            {product.technical_highlights && product.technical_highlights.length > 0 && (
              <div className="bg-white dark:bg-primary-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-primary-700 shadow-sm">
                <h3 className="text-base font-bold text-primary-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Box size={18} className="text-accent-500" />
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {product.technical_highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} className="text-green-600 dark:text-green-400" />
                      </div>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Industry Applications */}
            {product.industry_usage && (
              <div className="mb-8">
                <h3 className="text-base font-bold text-primary-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Weight size={18} className="text-accent-500" />
                  Industry Applications
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{product.industry_usage}</p>
              </div>
            )}

            {/* CTA Section */}
            <div className="border-t border-gray-200 dark:border-primary-700 pt-8">
              <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-4">Interested in this product?</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/contact" 
                  className="flex-1 inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  Request Quote
                </Link>
                <Link 
                  to="/rfq" 
                  className="flex-1 inline-flex justify-center items-center gap-2 px-6 py-3.5 border-2 border-primary-700 dark:border-primary-500 text-primary-700 dark:text-primary-300 font-semibold rounded-xl hover:bg-primary-50 dark:hover:bg-primary-800 transition-all"
                >
                  Get Sample
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
