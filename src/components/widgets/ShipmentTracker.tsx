import React, { useState, useEffect } from 'react';
import { Truck, Package, CheckCircle, Clock, MapPin, Search, RefreshCw, AlertCircle, X, ExternalLink } from 'lucide-react';
import { CMSShipmentsService } from '../../lib/supabase';

interface ShipmentUpdate {
  status: string;
  location: string;
  description: string;
  timestamp?: string;
}

interface ShipmentStatus {
  id: string;
  tracking_number: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  product_details: string;
  weight: number;
  logistic_partner: string;
  status: string;
  current_location: string;
  estimated_delivery: string;
  tracking_updates: ShipmentUpdate[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  processing: { label: 'Processing', color: 'bg-blue-500', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-500', icon: Truck },
  in_transit: { label: 'In Transit', color: 'bg-amber-500', icon: Truck },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-500', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-500', icon: CheckCircle },
};

const LOGO_PARTNERS = [
  { name: 'DHL', color: '#FFCC00' },
  { name: 'FedEx', color: '#4D148C' },
  { name: 'UPS', color: '#351C15' },
  { name: 'Shiprocket', color: '#FF6B35' },
];

export const ShipmentTracker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<ShipmentStatus | null>(null);
  const [shipments, setShipments] = useState<ShipmentStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      const data = await CMSShipmentsService.getAll();
      setShipments(data.slice(0, 3));
    } catch (err) {
      console.error('Error loading shipments:', err);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError('');

    try {
      const found = await CMSShipmentsService.getByTracking(trackingNumber.trim());
      
      if (found) {
        setShipment(found);
      } else {
        setError('Shipment not found. Please check your tracking number.');
        setShipment(null);
      }
    } catch (err) {
      setError('Error tracking shipment. Please try again.');
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTrack = async (trackingNum: string) => {
    setTrackingNumber(trackingNum);
    setLoading(true);
    setError('');
    
    try {
      const found = await CMSShipmentsService.getByTracking(trackingNum);
      if (found) {
        setShipment(found);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const getLogisticsLogo = (partner: string) => {
    return LOGO_PARTNERS.find(p => partner.toLowerCase().includes(p.name.toLowerCase())) || LOGO_PARTNERS[0];
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-[90] bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-pulse"
        title="Track Shipment"
      >
        <Truck size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 z-[90] w-80 md:w-96 max-h-[70vh] overflow-hidden">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Truck size={18} />
            <h3 className="font-bold">Track Shipment</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <form onSubmit={handleTrack} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : 'Track'}
            </button>
          </form>

          {error && (
            <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg mb-3 text-xs">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {shipment && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-mono font-bold text-gray-900 dark:text-white text-sm">{shipment.tracking_number}</p>
                  <p className="text-xs text-gray-500">{shipment.logistic_partner}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-white text-xs ${STATUS_CONFIG[shipment.status]?.color || 'bg-gray-500'}`}>
                  {STATUS_CONFIG[shipment.status]?.label || shipment.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <MapPin size={12} />
                <span>{shipment.current_location}</span>
                <span className="mx-1">•</span>
                <Clock size={12} />
                <span>ETA: {formatDate(shipment.estimated_delivery)}</span>
              </div>

              <div className="space-y-2 text-xs">
                {shipment.tracking_updates?.slice(0, 3).map((update, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1 ${STATUS_CONFIG[update.status]?.color || 'bg-gray-400'}`}></div>
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">{update.description}</p>
                      <p className="text-gray-500">{update.location} • {formatDate(update.timestamp || '')}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {shipment.tracking_updates && shipment.tracking_updates.length > 3 && (
                <button className="w-full mt-2 py-1 text-xs text-amber-500 hover:text-amber-600 font-medium">
                  View All Updates
                </button>
              )}
            </div>
          )}

          {!shipment && !error && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Recent Shipments:</p>
              <div className="space-y-2">
                {shipments.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleQuickTrack(s.tracking_number)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-left"
                  >
                    <div>
                      <p className="font-mono text-xs text-gray-900 dark:text-white">{s.tracking_number}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s.status]?.color || 'bg-gray-400'}`}></span>
                        <span className="text-xs text-gray-500">{s.current_location}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-white text-[10px] ${STATUS_CONFIG[s.status]?.color || 'bg-gray-500'}`}>
                      {STATUS_CONFIG[s.status]?.label || s.status}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 mb-2">Track with other partners:</p>
                <div className="flex gap-2">
                  {LOGO_PARTNERS.map((partner) => (
                    <button
                      key={partner.name}
                      onClick={() => window.open(`https://www.google.com/search?q=${partner.name}+tracking`, '_blank')}
                      className="flex-1 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {partner.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentTracker;
