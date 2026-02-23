import React, { useState, useEffect } from 'react';
import { AnalyticsService, ProductsService, InquiriesService, DonationsService, ShipmentsService, CareersService } from '../services/crud';
import { useToast, CardSkeleton } from '../components';
import { Package, MessageSquare, Heart, Truck, Briefcase, TrendingUp, TrendingDown, Users, Eye, Calendar } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const MOCK_CHART_DATA = {
  productsByCategory: [
    { name: 'Brass', value: 12 },
    { name: 'Steel', value: 15 },
    { name: 'Precision', value: 8 },
    { name: 'Hydraulic', value: 10 },
    { name: 'Other', value: 5 }
  ],
  monthlyInquiries: [
    { month: 'Jan', inquiries: 12, donations: 2500 },
    { month: 'Feb', inquiries: 19, donations: 3200 },
    { month: 'Mar', inquiries: 15, donations: 2800 },
    { month: 'Apr', inquiries: 22, donations: 4100 },
    { month: 'May', inquiries: 18, donations: 3500 },
    { month: 'Jun', inquiries: 25, donations: 4800 }
  ],
  shipmentStatus: [
    { name: 'Delivered', value: 45 },
    { name: 'In Transit', value: 25 },
    { name: 'Processing', value: 20 },
    { name: 'Cancelled', value: 10 }
  ]
};

export const AdminAnalyticsPage: React.FC = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalInquiries: 0,
    totalDonations: 0,
    totalShipments: 0,
    totalCareers: 0
  });
  const [recentActivity, setRecentActivity] = useState<{
    inquiries: any[];
    donations: any[];
    shipments: any[];
  }>({
    inquiries: [],
    donations: [],
    shipments: []
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dashboardStats, activity] = await Promise.all([
          AnalyticsService.getDashboardStats(),
          AnalyticsService.getRecentActivity()
        ]);
        
        setStats(dashboardStats);
        setRecentActivity(activity);
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const cards = stats ? [
    { 
      title: 'Total Products', 
      value: stats.totalProducts || 0, 
      icon: Package, 
      color: 'bg-blue-500',
      trend: '+12%',
      trendUp: true
    },
    { 
      title: 'Total Inquiries', 
      value: stats.totalInquiries || 0, 
      icon: MessageSquare, 
      color: 'bg-green-500',
      trend: '+8%',
      trendUp: true
    },
    { 
      title: 'Total Donations', 
      value: stats.totalDonations ? `$${stats.totalDonations.toLocaleString()}` : '$0', 
      icon: Heart, 
      color: 'bg-pink-500',
      trend: '+23%',
      trendUp: true
    },
    { 
      title: 'Active Shipments', 
      value: stats.totalShipments || 0, 
      icon: Truck, 
      color: 'bg-orange-500',
      trend: '-5%',
      trendUp: false
    },
    { 
      title: 'Job Openings', 
      value: stats.totalCareers || 0, 
      icon: Briefcase, 
      color: 'bg-purple-500',
      trend: '+2',
      trendUp: true
    }
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400">Track your website performance and metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {(cards ?? []).map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card?.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{card?.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${card?.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                  {card?.trendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{card?.trend} from last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${card?.color || 'bg-gray-500'} rounded-xl flex items-center justify-center`}>
                {card?.icon ? <card.icon className="text-white" size={24} /> : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Inquiries</h3>
          <div className="space-y-4">
            {recentActivity.inquiries.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent inquiries</p>
            ) : (
              recentActivity.inquiries.slice(0, 5).map((inquiry, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <MessageSquare className="text-blue-600" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{inquiry.name}</p>
                    <p className="text-sm text-gray-500 truncate">{inquiry.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    inquiry.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {inquiry.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Donations</h3>
          <div className="space-y-4">
            {recentActivity.donations.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent donations</p>
            ) : (
              recentActivity.donations.slice(0, 5).map((donation, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                    <Heart className="text-pink-600" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {donation.anonymous ? 'Anonymous' : donation.donor_name}
                    </p>
                    <p className="text-sm text-gray-500">{donation.created_at ? new Date(donation.created_at).toLocaleDateString() : ''}</p>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${donation.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Shipments</h3>
          <div className="space-y-4">
            {recentActivity.shipments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent shipments</p>
            ) : (
              recentActivity.shipments.slice(0, 5).map((shipment, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <Truck className="text-orange-600" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate font-mono">
                      {shipment.tracking_number}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{shipment.customer_name}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    shipment.shipment_status === 'delivered' ? 'bg-green-100 text-green-700' :
                    shipment.shipment_status === 'in_transit' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {shipment.shipment_status?.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Eye className="text-gray-500" size={18} />
                <span className="text-gray-600 dark:text-gray-300">Total Page Views</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">128,450</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Users className="text-gray-500" size={18} />
                <span className="text-gray-600 dark:text-gray-300">Unique Visitors</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">45,620</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-500" size={18} />
                <span className="text-gray-600 dark:text-gray-300">Avg. Session</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">3m 24s</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Products by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={MOCK_CHART_DATA.productsByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {MOCK_CHART_DATA.productsByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Monthly Inquiries & Donations</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={MOCK_CHART_DATA.monthlyInquiries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="inquiries" stroke="#0088FE" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="donations" stroke="#00C49F" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Shipment Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={MOCK_CHART_DATA.shipmentStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0088FE" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
