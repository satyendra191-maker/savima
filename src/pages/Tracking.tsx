import React, { useState, useEffect } from 'react';
import { Truck, Package, CheckCircle, Clock, MapPin, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { CMSShipmentsService } from '../lib/supabase';
import { SEO } from '../components/SEO';

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

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
    processing: { label: 'Processing', color: 'text-blue-600', bgColor: 'bg-blue-500', icon: Package },
    shipped: { label: 'Shipped', color: 'text-purple-600', bgColor: 'bg-purple-500', icon: Truck },
    in_transit: { label: 'In Transit', color: 'text-amber-600', bgColor: 'bg-amber-500', icon: Truck },
    out_for_delivery: { label: 'Out for Delivery', color: 'text-orange-600', bgColor: 'bg-orange-500', icon: Truck },
    delivered: { label: 'Delivered', color: 'text-green-600', bgColor: 'bg-green-500', icon: CheckCircle },
};

const LOGO_PARTNERS = [
    { name: 'DHL', color: '#FFCC00' },
    { name: 'FedEx', color: '#4D148C' },
    { name: 'UPS', color: '#351C15' },
    { name: 'Shiprocket', color: '#FF6B35' },
];

export const Tracking: React.FC = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [shipment, setShipment] = useState<ShipmentStatus | null>(null);
    const [recentShipments, setRecentShipments] = useState<ShipmentStatus[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadRecentShipments();
    }, []);

    const loadRecentShipments = async () => {
        try {
            const data = await CMSShipmentsService.getAll();
            setRecentShipments((data || []).slice(0, 5));
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
                setError('');
            } else {
                setError('Shipment not found. Please check your tracking number and try again.');
                setShipment(null);
            }
        } catch (err) {
            setError('Error tracking shipment. Please try again later.');
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
                setError('');
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

    const getStatusProgress = (status: string): number => {
        const statusOrder = ['processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'];
        const index = statusOrder.indexOf(status);
        return index >= 0 ? ((index + 1) / statusOrder.length) * 100 : 0;
    };

    return (
        <>
            <SEO
                title="Track Your Order - SAVIMAN"
                description="Track your shipment in real-time. Enter your tracking number to get instant updates on your order status."
            />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4">
                            <Truck className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Track Your Order
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            Enter your tracking number to get real-time updates on your shipment status
                        </p>
                    </div>

                    {/* Search Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-8">
                        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="tracking-number"
                                    name="tracking-number"
                                    type="text"
                                    placeholder="Enter your tracking number (e.g., SAV-2024-001)"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !trackingNumber.trim()}
                                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        <span>Tracking...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        <span>Track</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {error && (
                            <div className="mt-4 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* Tracking Result */}
                    {shipment && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
                            {/* Status Header */}
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <p className="text-amber-100 text-sm mb-1">Tracking Number</p>
                                        <p className="font-mono text-2xl font-bold">{shipment.tracking_number}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {STATUS_CONFIG[shipment.status] && (
                                            <>
                                                {React.createElement(STATUS_CONFIG[shipment.status].icon, { className: 'w-6 h-6' })}
                                                <span className="text-xl font-semibold">{STATUS_CONFIG[shipment.status].label}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900">
                                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="absolute h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                                        style={{ width: `${getStatusProgress(shipment.status)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span>Processing</span>
                                    <span>Shipped</span>
                                    <span>In Transit</span>
                                    <span>Out for Delivery</span>
                                    <span>Delivered</span>
                                </div>
                            </div>

                            {/* Shipment Details */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Logistics Partner</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{shipment.logistic_partner}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Location</p>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-amber-500" />
                                                <p className="font-semibold text-gray-900 dark:text-white">{shipment.current_location}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Estimated Delivery</p>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-amber-500" />
                                                <p className="font-semibold text-gray-900 dark:text-white">{formatDate(shipment.estimated_delivery)}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Product</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{shipment.product_details}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tracking Updates */}
                                {shipment.tracking_updates && shipment.tracking_updates.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tracking History</h3>
                                        <div className="relative">
                                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                                            <div className="space-y-4">
                                                {shipment.tracking_updates.map((update, idx) => {
                                                    const statusConfig = STATUS_CONFIG[update.status];
                                                    const IconComponent = statusConfig?.icon || Package;
                                                    return (
                                                        <div key={idx} className="relative flex gap-4 pl-10">
                                                            <div className={`absolute left-2 w-5 h-5 rounded-full ${statusConfig?.bgColor || 'bg-gray-400'} flex items-center justify-center`}>
                                                                <IconComponent className="w-3 h-3 text-white" />
                                                            </div>
                                                            <div className="flex-1 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                                                    <p className="font-medium text-gray-900 dark:text-white">{update.description}</p>
                                                                    <span className={`text-sm px-2 py-0.5 rounded-full ${statusConfig?.bgColor || 'bg-gray-500'} text-white`}>
                                                                        {statusConfig?.label || update.status}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                                    <MapPin className="w-3 h-3" />
                                                                    <span>{update.location}</span>
                                                                    {update.timestamp && (
                                                                        <>
                                                                            <span>•</span>
                                                                            <span>{formatDate(update.timestamp)}</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Recent Shipments */}
                    {!shipment && recentShipments.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Shipments</h2>
                            <div className="space-y-3">
                                {recentShipments.map((s) => {
                                    const statusConfig = STATUS_CONFIG[s.status];
                                    const IconComponent = statusConfig?.icon || Package;
                                    return (
                                        <button
                                            key={s.id}
                                            onClick={() => handleQuickTrack(s.tracking_number)}
                                            className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all text-left group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full ${statusConfig?.bgColor || 'bg-gray-500'} flex items-center justify-center`}>
                                                    <IconComponent className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-mono font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                                        {s.tracking_number}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{s.current_location}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm text-white ${statusConfig?.bgColor || 'bg-gray-500'}`}>
                                                {statusConfig?.label || s.status}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Partner Links */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Track with our logistics partners:
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {LOGO_PARTNERS.map((partner) => (
                                <button
                                    key={partner.name}
                                    onClick={() => window.open(`https://www.google.com/search?q=${partner.name}+tracking`, '_blank')}
                                    className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                                >
                                    {partner.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 text-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Need Help?</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Can't find your tracking number? Check your order confirmation email or contact our support team.
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium hover:underline"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Tracking;
