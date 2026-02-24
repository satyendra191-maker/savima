import React, { useState } from 'react';
import { 
  Package, Clock, Truck, FileText, Download, 
  Search, Filter, ChevronRight, MapPin, CheckCircle,
  CreditCard, History, Settings, Bell
} from 'lucide-react';
import { Card, CardHeader, Button, StatusBadge, Badge, Input } from '../../components/design-system';

const orders = [
  { id: 'ORD-2026-001', date: '2026-02-20', items: 5, total: 12500, status: 'delivered' },
  { id: 'ORD-2026-002', date: '2026-02-22', items: 12, total: 45000, status: 'shipped' },
  { id: 'ORD-2026-003', date: '2026-02-23', items: 3, total: 7800, status: 'processing' },
  { id: 'ORD-2026-004', date: '2026-02-24', items: 8, total: 23400, status: 'pending' },
];

const shipments = [
  { id: 'SHP-001', orderId: 'ORD-2026-001', carrier: 'DHL', tracking: 'DHL123456789', status: 'delivered', eta: '2026-02-22' },
  { id: 'SHP-002', orderId: 'ORD-2026-002', carrier: 'FedEx', tracking: 'FX987654321', status: 'in_transit', eta: '2026-02-26' },
];

const invoices = [
  { id: 'INV-2026-001', orderId: 'ORD-2026-001', amount: 12500, status: 'paid', date: '2026-02-20' },
  { id: 'INV-2026-002', orderId: 'ORD-2026-002', amount: 45000, status: 'pending', date: '2026-02-22' },
];

const certificates = [
  { id: 'CERT-001', type: 'ISO 9001', product: 'CNC Shaft A-100', batch: 'BATCH-2026-01', date: '2026-02-15' },
  { id: 'CERT-002', type: 'Material Test', product: 'Brass Bushing', batch: 'BATCH-2026-02', date: '2026-02-18' },
];

export const ClientPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  
  const tabs = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'shipments', label: 'Shipments', icon: Truck },
    { id: 'invoices', label: 'Invoices', icon: CreditCard },
    { id: 'certificates', label: 'Certificates', icon: FileText },
  ];
  
  return (
    <div className="min-h-screen bg-surface-100 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-surface-200 dark:border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-h1 text-navy dark:text-white">Client Portal</h1>
            <p className="text-body text-slate-500 dark:text-slate-400">Welcome back, Acme Manufacturing</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white">
              <Bell size={20} />
            </button>
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white">
              <Settings size={20} />
            </button>
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-semibold">
              AM
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Package className="text-accent" size={24} />
            </div>
            <div>
              <p className="text-small text-slate-500 dark:text-slate-400">Active Orders</p>
              <p className="text-h2 text-navy dark:text-white">4</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Truck className="text-warning" size={24} />
            </div>
            <div>
              <p className="text-small text-slate-500 dark:text-slate-400">In Transit</p>
              <p className="text-h2 text-navy dark:text-white">1</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-success" size={24} />
            </div>
            <div>
              <p className="text-small text-slate-500 dark:text-slate-400">Delivered (30d)</p>
              <p className="text-h2 text-navy dark:text-white">24</p>
            </div>
          </Card>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-1 bg-surface-200 dark:bg-slate-700 p-1 rounded-lg mb-6 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-body font-medium transition-colors
                ${activeTab === tab.id 
                  ? 'bg-white dark:bg-slate-600 text-navy dark:text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-white'
                }
              `}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content based on active tab */}
        {activeTab === 'orders' && (
          <Card>
            <CardHeader 
              title="Order History"
              action={
                <div className="flex gap-2">
                  <Input 
                    placeholder="Search orders..." 
                    leftIcon={<Search size={16} />}
                    className="w-64"
                  />
                  <Button variant="secondary" size="sm" leftIcon={<Filter size={16} />}>
                    Filter
                  </Button>
                </div>
              }
            />
            <table className="w-full">
              <thead>
                <tr className="bg-surface-100 dark:bg-slate-700">
                  <th className="px-4 py-3 text-left text-small font-semibold text-navy dark:text-white">Order ID</th>
                  <th className="px-4 py-3 text-left text-small font-semibold text-navy dark:text-white">Date</th>
                  <th className="px-4 py-3 text-left text-small font-semibold text-navy dark:text-white">Items</th>
                  <th className="px-4 py-3 text-left text-small font-semibold text-navy dark:text-white">Total</th>
                  <th className="px-4 py-3 text-left text-small font-semibold text-navy dark:text-white">Status</th>
                  <th className="px-4 py-3 text-left text-small font-semibold text-navy dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id} className={`border-b border-surface-100 dark:border-slate-700 ${index % 2 === 1 ? 'bg-surface-50 dark:bg-slate-800/50' : ''}`}>
                    <td className="px-4 py-3 text-body font-medium text-navy dark:text-white">{order.id}</td>
                    <td className="px-4 py-3 text-body text-slate-600 dark:text-slate-300">{order.date}</td>
                    <td className="px-4 py-3 text-body text-slate-600 dark:text-slate-300">{order.items}</td>
                    <td className="px-4 py-3 text-body text-slate-600 dark:text-slate-300">₹{order.total.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status as 'pending' | 'processing' | 'shipped' | 'delivered'} />
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={16} />}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
        
        {activeTab === 'shipments' && (
          <Card>
            <CardHeader title="Shipment Tracking" />
            <div className="space-y-4">
              {shipments.map((shipment) => (
                <div key={shipment.id} className="p-4 border border-surface-200 dark:border-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-navy dark:text-white">{shipment.orderId}</p>
                      <p className="text-small text-slate-500 dark:text-slate-400">{shipment.carrier} - {shipment.tracking}</p>
                    </div>
                    <StatusBadge status={shipment.status === 'delivered' ? 'delivered' : 'shipped'} />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-2 bg-surface-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent rounded-full" 
                          style={{ width: shipment.status === 'delivered' ? '100%' : '60%' }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-small text-slate-500 dark:text-slate-400">
                        <span>Shipped</span>
                        <span>In Transit</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
        
        {activeTab === 'invoices' && (
          <Card>
            <CardHeader 
              title="Invoices"
              action={<Button variant="secondary" size="sm" leftIcon={<Download size={16} />}>Download All</Button>}
            />
            <table className="w-full">
              <thead>
                <tr className="bg-surface-100 dark:bg-slate-700">
                  <th className="px-4 py-3 text-left text-small font-semibold text-navy dark:text-white">Invoice ID</th>
                  <th className="px-4 py-3 text-left text-small font-semibold text-navy dark:text-white">Order ID</th>
                  <th className="px-4 py-3 text-left text-small font-semibold text-navy dark:text-white">Amount</th>
                  <th className="px-4 py-3 text-left text-small font-semibold text-navy dark:text-white">Date</th>
                  <th className="px-4 py-3 text-left text-small font-semibold text-navy dark:text-white">Status</th>
                  <th className="px-4 py-3 text-left text-small font-semibold text-navy dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <tr key={invoice.id} className={`border-b border-surface-100 dark:border-slate-700 ${index % 2 === 1 ? 'bg-surface-50 dark:bg-slate-800/50' : ''}`}>
                    <td className="px-4 py-3 text-body font-medium text-navy dark:text-white">{invoice.id}</td>
                    <td className="px-4 py-3 text-body text-slate-600 dark:text-slate-300">{invoice.orderId}</td>
                    <td className="px-4 py-3 text-body text-slate-600 dark:text-slate-300">₹{invoice.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-body text-slate-600 dark:text-slate-300">{invoice.date}</td>
                    <td className="px-4 py-3">
                      <Badge variant={invoice.status === 'paid' ? 'success' : 'warning'}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" leftIcon={<Download size={16} />}>
                        PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
        
        {activeTab === 'certificates' && (
          <Card>
            <CardHeader title="Quality Certificates" />
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-4 border border-surface-200 dark:border-slate-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <FileText className="text-success" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-navy dark:text-white">{cert.type}</p>
                      <p className="text-small text-slate-500 dark:text-slate-400">{cert.product} - {cert.batch}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-small text-slate-500 dark:text-slate-400">{cert.date}</span>
                    <Button variant="secondary" size="sm" leftIcon={<Download size={16} />}>
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ClientPortal;
