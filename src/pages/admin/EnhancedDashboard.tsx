import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, DollarSign, Clock, CheckCircle, 
  XCircle, AlertCircle, ArrowUp, ArrowDown, Filter, Download, RefreshCw, LogOut, User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface KPICard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
}

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'quoted' | 'negotiating' | 'won' | 'lost';
  value: number;
  date: string;
  priority: 'cold' | 'warm' | 'hot' | 'urgent';
  source: string;
}

const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'John Smith', company: 'TechCorp', email: 'john@techcorp.com', phone: '+1 555-0101', status: 'new', value: 15000, date: '2024-02-21', priority: 'hot', source: 'Website' },
  { id: '2', name: 'Maria Garcia', company: 'AutoParts Ltd', email: 'maria@autoparts.com', phone: '+34 555-0102', status: 'quoted', value: 45000, date: '2024-02-20', priority: 'urgent', source: 'LinkedIn' },
  { id: '3', name: 'Hans Mueller', company: 'GermanEng', email: 'hans@germaneng.de', phone: '+49 555-0103', status: 'negotiating', value: 28000, date: '2024-02-19', priority: 'warm', source: 'Referral' },
  { id: '4', name: 'Akira Tanaka', company: 'TokyoMfg', email: 'akira@tokyo.co.jp', phone: '+81 555-0104', status: 'won', value: 82000, date: '2024-02-18', priority: 'hot', source: 'Trade Show' },
  { id: '5', name: 'Sarah Johnson', company: 'BuildCo', email: 'sarah@buildco.com', phone: '+44 555-0105', status: 'lost', value: 12000, date: '2024-02-17', priority: 'cold', source: 'Website' },
];

const REVENUE_DATA = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Feb', revenue: 52000 },
  { name: 'Mar', revenue: 48000 },
  { name: 'Apr', revenue: 61000 },
  { name: 'May', revenue: 55000 },
  { name: 'Jun', revenue: 67000 },
];

const STATUS_COLORS = {
  new: '#3B82F6',
  contacted: '#8B5CF6',
  quoted: '#F59E0B',
  negotiating: '#10B981',
  won: '#059669',
  lost: '#EF4444'
};

export const EnhancedDashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const kpis: KPICard[] = [
    { title: 'Total Revenue', value: '$328K', change: 12.5, icon: DollarSign, color: 'text-green-600' },
    { title: 'New Leads', value: '24', change: 8.2, icon: Users, color: 'text-blue-600' },
    { title: 'Conversion Rate', value: '18%', change: -2.4, icon: TrendingUp, color: 'text-orange-600' },
    { title: 'Avg Response Time', value: '2.4h', change: -15, icon: Clock, color: 'text-purple-600' },
  ];

  const filteredLeads = filter === 'all' ? leads : leads.filter(l => l.status === filter);

  const getStatusCount = (status: string) => leads.filter(l => l.status === status).length;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-brass-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.email?.split('@')[0] || 'Admin'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'Not logged in'}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
          <button onClick={refreshData} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> 
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-lg text-sm font-medium hover:bg-brass-600">
            <Download size={16} /> 
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-opacity-10 ${kpi.color.replace('text', 'bg')}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {Math.abs(kpi.change)}%
              </div>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm">{kpi.title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Status */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Lead Pipeline</h3>
          <div className="space-y-4">
            {['new', 'contacted', 'quoted', 'negotiating', 'won', 'lost'].map((status) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[status as keyof typeof STATUS_COLORS] }}></div>
                  <span className="text-gray-600 dark:text-gray-400 capitalize">{status}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{getStatusCount(status)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Leads</h3>
          <div className="flex gap-2">
            {['all', 'new', 'quoted', 'won', 'lost'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  filter === status 
                  ? 'bg-brass-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-brass-100 dark:bg-brass-900 flex items-center justify-center text-brass-600 font-bold">
                        {lead.name[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{lead.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium capitalize" 
                      style={{ backgroundColor: `${STATUS_COLORS[lead.status]}20`, color: STATUS_COLORS[lead.status] }}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    ${lead.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      lead.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      lead.priority === 'hot' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                      lead.priority === 'warm' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {lead.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {lead.date}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-brass-600 hover:text-brass-700 font-medium text-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
