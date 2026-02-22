import React, { useState, useEffect } from 'react';
import { Truck, Globe, MapPin, ExternalLink, CheckCircle, X, Search, Package, Ship, Plane, Warehouse } from 'lucide-react';
import { CMSLogisticsService } from '../../lib/supabase';

interface LogisticsPartner {
  id: string;
  name: string;
  type: 'national' | 'international';
  coverage: string[];
  services: string[];
  tracking_url: string;
  api_integration: boolean;
  status: 'active' | 'inactive';
  logo_url?: string;
  description?: string;
}

const SERVICE_ICONS: Record<string, any> = {
  'Express Delivery': Truck,
  'Air Freight': Plane,
  'Ocean Freight': Ship,
  'Express': Truck,
  'Same Day Delivery': Package,
  'Instant Delivery': Package,
  'Quick Commerce': Package,
  'Warehouse': Warehouse,
  'Warehousing': Warehouse,
  'Customs Clearance': CheckCircle,
  'COD': CheckCircle,
  'Reverse Logistics': Truck,
};

const TYPE_CONFIG = {
  national: { label: 'National', color: 'bg-green-500', icon: MapPin },
  international: { label: 'International', color: 'bg-blue-500', icon: Globe },
};

export const LogisticsPartners: React.FC = () => {
  const [partners, setPartners] = useState<LogisticsPartner[]>([]);
  const [filter, setFilter] = useState<'all' | 'national' | 'international'>('all');
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const data = await CMSLogisticsService.getAll();
      setPartners(data);
    } catch (error) {
      console.error('Error loading partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = filter === 'all' 
    ? partners 
    : partners.filter(p => p.type === filter);

  const displayPartners = showAll ? filteredPartners : filteredPartners.slice(0, 4);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <div className="animate-pulse flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-64 h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Truck size={20} />
            <h3 className="font-bold">Logistics Partners</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${filter === 'all' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('national')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${filter === 'national' ? 'bg-green-500 text-white' : 'text-white/70 hover:text-white'}`}
            >
              🌍 National
            </button>
            <button
              onClick={() => setFilter('international')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${filter === 'international' ? 'bg-blue-500 text-white' : 'text-white/70 hover:text-white'}`}
            >
              ✈️ International
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayPartners.map((partner) => {
            const TypeIcon = TYPE_CONFIG[partner.type].icon;
            return (
              <div
                key={partner.id}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition-all hover:border-primary-500/50 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${TYPE_CONFIG[partner.type].color} flex items-center justify-center`}>
                    <TypeIcon size={20} className="text-white" />
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${partner.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700'}`}>
                    {partner.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h4 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
                  {partner.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {partner.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {partner.services.slice(0, 3).map((service, idx) => {
                    const Icon = SERVICE_ICONS[service] || Package;
                    return (
                      <span key={idx} className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
                        <Icon size={10} />
                        {service}
                      </span>
                    );
                  })}
                  {partner.services.length > 3 && (
                    <span className="px-2 py-0.5 text-xs text-gray-500">
                      +{partner.services.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {partner.coverage.slice(0, 3).map((country, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded">
                      {country}
                    </span>
                  ))}
                  {partner.coverage.length > 3 && (
                    <span className="px-1.5 py-0.5 text-xs text-gray-500">
                      +{partner.coverage.length - 3}
                    </span>
                  )}
                </div>

                {partner.api_integration && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <CheckCircle size={12} />
                    API Integrated
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredPartners.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-4 py-2 text-sm text-primary-500 hover:text-primary-600 font-medium"
          >
            {showAll ? 'Show Less' : `View All ${filteredPartners.length} Partners`}
          </button>
        )}
      </div>
    </div>
  );
};

export default LogisticsPartners;
