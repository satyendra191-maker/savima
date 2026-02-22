import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Building2, FileText, MessageSquare, 
  Settings, BarChart3, LogOut, Menu, X,
  Plus, Search, Edit, Trash2, Eye, Save, Send, Bot, Sparkles,
  Wand2, Image, FileType, RefreshCw, Copy, Check, Loader2, Upload, GripVertical, Download, Briefcase, Heart, Truck, Globe, MapPin, Share2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  CMSProductsService, 
  CMSIndustriesService, 
  CMSBlogsService,
  CMSInquiriesService,
  CMSCareersService,
  CMSDonationsService,
  CMSCatalogService,
  CMSService,
  CMSShipmentsService,
  CMSExportService,
  CMSLogisticsService,
  exportProductsToCSV,
  exportInquiriesToCSV,
  exportIndustriesToCSV,
  exportBlogsToCSV,
  exportDonationsToCSV,
  supabase
} from '../../lib/supabase';
import { Product, Inquiry } from '../../types';

type Permission = 'create' | 'read' | 'update' | 'delete';
type Role = 'admin' | 'editor' | 'viewer';

interface SectionPermission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

interface RolePermissions {
  [key: string]: SectionPermission;
}

const PERMISSIONS: RolePermissions = {
  Dashboard: { create: false, read: true, update: false, delete: false },
  Products: { create: true, read: true, update: true, delete: true },
  Catalog: { create: true, read: true, update: true, delete: true },
  Industries: { create: true, read: true, update: true, delete: true },
  Inquiries: { create: false, read: true, update: true, delete: true },
  Careers: { create: true, read: true, update: true, delete: true },
  Donations: { create: false, read: true, update: false, delete: true },
  Shipments: { create: true, read: true, update: true, delete: true },
  Logistics: { create: true, read: true, update: true, delete: true },
  BlogPosts: { create: true, read: true, update: true, delete: true },
  Analytics: { create: false, read: true, update: false, delete: false },
  Settings: { create: false, read: true, update: true, delete: false },
};

const getUserRole = (): Role => {
  const role = localStorage.getItem('saviman_admin_role');
  return (role as Role) || 'admin';
};

const hasPermission = (section: string, action: Permission): boolean => {
  const role = getUserRole();
  if (role === 'admin') return true;
  if (role === 'viewer') return action === 'read';
  return PERMISSIONS[section]?.[action] ?? false;
};

const PRODUCT_CATEGORIES = [
  { id: 'brass', name: 'Brass Inserts', icon: '🔩', count: 12 },
  { id: 'steel', name: 'SS Fasteners', icon: '🔧', count: 15 },
  { id: 'precision', name: 'Precision Turned Parts', icon: '⚙️', count: 8 },
  { id: 'hydraulic', name: 'Hydraulic Fittings', icon: '🔗', count: 10 },
];

const MENU_ITEMS = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Catalog', path: '/admin/catalog', icon: FileText },
  { name: 'Industries', path: '/admin/industries', icon: Building2 },
  { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
  { name: 'Careers', path: '/admin/careers', icon: Briefcase },
  { name: 'Donations', path: '/admin/donations', icon: Heart },
  { name: 'Shipments', path: '/admin/shipments', icon: Truck },
  { name: 'Logistics', path: '/admin/logistics', icon: Globe },
  { name: 'Blog Posts', path: '/admin/blogs', icon: FileText },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

// Types for Header/Footer CRUD
interface HeaderLink {
  label: string;
  href: string;
  order: number;
}

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface Announcement {
  text: string;
  active: boolean;
  type: 'info' | 'success' | 'warning' | 'promo';
}

// CMS Layout
export const CMSLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const currentPath = location.pathname;

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-brass-600">SAVIMAN CMS</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Menu size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const isActive = currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-brass-50 dark:bg-brass-900/20 text-brass-600 dark:text-brass-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
            <LogOut size={20} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// CMS Dashboard
export const CMSDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    products: 0,
    inquiries: 0,
    donations: 0,
    shipments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, inquiries, donations, shipments] = await Promise.all([
          CMSProductsService.getAll(),
          CMSInquiriesService.getAll(),
          CMSDonationsService.getAll(),
          CMSShipmentsService.getAll()
        ]);
        setStats({
          products: products.length,
          inquiries: inquiries.length,
          donations: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
          shipments: shipments.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brass-500" /></div>;
  }

  const cards = [
    { title: 'Total Products', value: stats.products, icon: Package, color: 'bg-blue-500' },
    { title: 'Total Inquiries', value: stats.inquiries, icon: MessageSquare, color: 'bg-green-500' },
    { title: 'Total Donations', value: `$${stats.donations.toLocaleString()}`, icon: Heart, color: 'bg-pink-500' },
    { title: 'Active Shipments', value: stats.shipments, icon: Truck, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/products" className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <Package className="mx-auto text-blue-600" size={24} />
              <p className="mt-2 text-sm font-medium text-blue-600">Manage Products</p>
            </Link>
            <Link to="/admin/inquiries" className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <MessageSquare className="mx-auto text-green-600" size={24} />
              <p className="mt-2 text-sm font-medium text-green-600">View Inquiries</p>
            </Link>
            <Link to="/admin/shipments" className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
              <Truck className="mx-auto text-orange-600" size={24} />
              <p className="mt-2 text-sm font-medium text-orange-600">Track Shipments</p>
            </Link>
            <Link to="/admin/settings" className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
              <Settings className="mx-auto text-purple-600" size={24} />
              <p className="mt-2 text-sm font-medium text-purple-600">Settings</p>
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Database</span>
              <span className="flex items-center gap-2 text-green-600"><Check size={16} /> Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Storage</span>
              <span className="flex items-center gap-2 text-green-600"><Check size={16} /> Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">API Status</span>
              <span className="flex items-center gap-2 text-green-600"><Check size={16} /> Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// CMS Products
export const CMSProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await CMSProductsService.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await CMSProductsService.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      await exportProductsToCSV();
      alert(`Exported to ${format.toUpperCase()} successfully!`);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brass-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h2>
          <p className="text-gray-500">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600">
              <Download size={20} /> Export
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button onClick={() => handleExport('csv')} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">CSV</button>
              <button onClick={() => handleExport('excel')} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Excel</button>
              <button onClick={() => handleExport('pdf')} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">PDF</button>
            </div>
          </div>
          <button onClick={() => { setEditingProduct(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600">
            <Plus size={20} /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Product</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Category</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {product.image_url && <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{product.category}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">-</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${product.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {product.status || 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => navigate(`/product/${product.slug}`)} className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Eye size={16} /></button>
                    <button onClick={() => { setEditingProduct(product); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X size={20} /></button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                  <input type="text" defaultValue={editingProduct?.name} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug</label>
                  <input type="text" defaultValue={editingProduct?.slug} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select defaultValue={editingProduct?.category} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white">
                    {PRODUCT_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
                  <input type="text" defaultValue={editingProduct?.image_url} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Short Description</label>
                <textarea defaultValue={editingProduct?.short_description} rows={3} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" onClick={(e) => { e.preventDefault(); setShowModal(false); }} className="flex-1 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// CMS Catalog
export const CMSCatalog: React.FC = () => {
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const data = await CMSCatalogService.getAll();
        setCatalogs(data);
      } catch (error) {
        console.error('Error fetching catalogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogs();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brass-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Catalog</h2>
          <p className="text-gray-500">Manage downloadable catalogs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600">
          <Plus size={20} /> Add Catalog
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogs.map((catalog) => (
          <div key={catalog.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brass-100 dark:bg-brass-900/20 rounded-xl flex items-center justify-center">
                <FileText className="text-brass-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{catalog.title}</h3>
                <p className="text-sm text-gray-500">{catalog.downloads} downloads</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Edit</button>
              <button className="flex-1 py-2 text-sm bg-brass-500 text-white rounded-lg hover:bg-brass-600">Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// CMS Industries
export const CMSIndustries: React.FC = () => {
  const [industries, setIndustries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const data = await CMSIndustriesService.getAll();
        setIndustries(data);
      } catch (error) {
        console.error('Error fetching industries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIndustries();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brass-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Industries</h2>
          <p className="text-gray-500">Manage industry served</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600">
          <Plus size={20} /> Add Industry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.map((industry) => (
          <div key={industry.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Building2 className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{industry.name}</h3>
                <p className="text-sm text-gray-500">{industry.productsCount} products</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Edit</button>
              <button className="flex-1 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// CMS Inquiries
export const CMSInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const data = await CMSInquiriesService.getAll();
        setInquiries(data);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await CMSInquiriesService.updateStatus(id, status);
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status: status as any } : i));
    } catch (error) {
      console.error('Error updating inquiry:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brass-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inquiries</h2>
          <p className="text-gray-500">Manage customer inquiries</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Product</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{inquiry.name}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{inquiry.email}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{inquiry.product || inquiry.message}</td>
                <td className="px-6 py-4">
                  <select
                    value={inquiry.status}
                    onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                    className={`px-2 py-1 text-xs rounded-full border-0 ${
                      inquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      inquiry.status === 'responded' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="responded">Responded</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={16} /></button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><Send size={16} /></button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// CMS Careers
export const CMSCareers: React.FC = () => {
  const [careers, setCareers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const data = await CMSCareersService.getAll();
        setCareers(data);
      } catch (error) {
        console.error('Error fetching careers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brass-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Careers</h2>
          <p className="text-gray-500">Manage job openings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600">
          <Plus size={20} /> Add Job
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Position</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Department</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Location</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {careers.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{job.title}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{job.department}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{job.location}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{job.type}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// CMS Donations
export const CMSDonations: React.FC = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await CMSDonationsService.getAll();
        setDonations(data);
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brass-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Donations</h2>
          <p className="text-gray-500">Track donations for children education</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Raised</p>
          <p className="text-3xl font-bold text-green-600">${totalAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Donor</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Currency</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {donations.map((donation) => (
              <tr key={donation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{donation.name}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{donation.email}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">${donation.amount}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{donation.currency}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${donation.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {donation.status || 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// CMS Shipments
export const CMSShipments: React.FC = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const data = await CMSShipmentsService.getAll();
        setShipments(data);
      } catch (error) {
        console.error('Error fetching shipments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brass-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shipments</h2>
          <p className="text-gray-500">Track and manage shipments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600">
          <Plus size={20} /> Add Shipment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{shipments.filter(s => s.status === 'pending').length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500">In Transit</p>
          <p className="text-2xl font-bold text-blue-600">{shipments.filter(s => s.status === 'in_transit').length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{shipments.filter(s => s.status === 'delivered').length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{shipments.length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Tracking #</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Destination</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Partner</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 font-mono text-sm text-gray-900 dark:text-white">{shipment.trackingNumber}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{shipment.destination}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{shipment.partner}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    shipment.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {shipment.status?.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// CMS Logistics Partners
export const CMSLogistics: React.FC = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await CMSLogisticsService.getAll();
        setPartners(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brass-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Logistics Partners</h2>
          <p className="text-gray-500">Manage shipping and logistics partners</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600">
          <Plus size={20} /> Add Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                  {partner.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{partner.name}</h3>
                  <p className="text-sm text-gray-500">{partner.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${partner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {partner.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Globe size={14} />
                <span>{partner.coverage || 'International'}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Edit</button>
              <button className="flex-1 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// CMS Blogs
export const CMSBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await CMSBlogsService.getAll();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brass-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h2>
          <p className="text-gray-500">Manage blog content</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600">
          <Plus size={20} /> New Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {blog.image && <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 text-xs rounded-full ${blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {blog.status}
                </span>
                <span className="text-sm text-gray-500">{blog.date}</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{blog.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{blog.excerpt}</p>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Edit</button>
                <button className="flex-1 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// CMS Analytics
export const CMSAnalytics: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await CMSProductsService.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products for analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brass-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
        <p className="text-gray-500">Track your website performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500">Total Visitors</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">45,620</p>
          <p className="text-sm text-green-500 mt-2">↑ 12.5% from last month</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500">Page Views</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">128,450</p>
          <p className="text-sm text-green-500 mt-2">↑ 8.2% from last month</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500">Avg. Session</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">3m 24s</p>
          <p className="text-sm text-green-500 mt-2">↑ 5.1% from last month</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500">Bounce Rate</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">42.3%</p>
          <p className="text-sm text-red-500 mt-2">↓ 2.1% from last month</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Top Products</h3>
        <div className="space-y-4">
          {products.slice(0, 5).map((product, index) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-brass-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                <span className="text-gray-900 dark:text-white">{product.name}</span>
              </div>
              <span className="text-gray-500">{index * 120 + 50} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// CMS Settings with Header/Footer CRUD
export const CMSSettings: React.FC = () => {
  const [headerLinks, setHeaderLinks] = useState<HeaderLink[]>([
    { label: 'Home', href: '/', order: 1 },
    { label: 'Products', href: '/products', order: 2 },
    { label: 'Catalog', href: '/catalog', order: 3 },
    { label: 'Industries', href: '/industries', order: 4 },
    { label: 'About', href: '/about', order: 5 },
    { label: 'Contact', href: '/contact', order: 6 },
  ]);
  const [showHeaderModal, setShowHeaderModal] = useState(false);
  const [editingHeaderLink, setEditingHeaderLink] = useState<HeaderLink | undefined>();

  const [footerColumns, setFooterColumns] = useState<FooterColumn[]>([
    { title: 'Products', links: [{ label: 'Brass Inserts', href: '/products/brass-inserts' }, { label: 'SS Fasteners', href: '/products/ss-fasteners' }] },
    { title: 'Company', links: [{ label: 'About Us', href: '/about' }, { label: 'Careers', href: '/careers' }] },
    { title: 'Support', links: [{ label: 'FAQ', href: '/faq' }, { label: 'Privacy Policy', href: '/privacy' }] },
  ]);
  const [showFooterModal, setShowFooterModal] = useState(false);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { text: '🎉 Free shipping on orders above $500 | Global Export Available', active: true, type: 'promo' },
  ]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | undefined>();

  const addHeaderLink = (link: HeaderLink) => setHeaderLinks([...headerLinks, link]);
  const editHeaderLink = (index: number) => { setEditingHeaderLink(headerLinks[index]); setShowHeaderModal(true); };
  const deleteHeaderLink = (index: number) => setHeaderLinks(headerLinks.filter((_, i) => i !== index));
  const handleSaveHeaderLink = (link: HeaderLink) => {
    if (editingHeaderLink) {
      setHeaderLinks(headerLinks.map((l, i) => l.label === editingHeaderLink.label ? link : l));
      setEditingHeaderLink(undefined);
    } else { addHeaderLink(link); }
  };

  const addFooterColumn = (column: FooterColumn) => setFooterColumns([...footerColumns, column]);
  const updateFooterColumnTitle = (index: number, title: string) => {
    setFooterColumns(footerColumns.map((col, i) => i === index ? { ...col, title } : col));
  };
  const deleteFooterColumn = (index: number) => setFooterColumns(footerColumns.filter((_, i) => i !== index));
  const addFooterLink = (colIndex: number) => {
    setFooterColumns(footerColumns.map((col, i) => i === colIndex ? { ...col, links: [...col.links, { label: 'New Link', href: '#' }] } : col));
  };
  const deleteFooterLink = (colIndex: number, linkIndex: number) => {
    setFooterColumns(footerColumns.map((col, i) => i === colIndex ? { ...col, links: col.links.filter((_, li) => li !== linkIndex) } : col));
  };

  const addAnnouncement = (ann: Announcement) => setAnnouncements([...announcements, ann]);
  const editAnnouncement = (index: number) => { setEditingAnnouncement(announcements[index]); setShowAnnouncementModal(true); };
  const deleteAnnouncement = (index: number) => setAnnouncements(announcements.filter((_, i) => i !== index));
  const toggleAnnouncement = (index: number) => {
    setAnnouncements(announcements.map((a, i) => i === index ? { ...a, active: !a.active } : a));
  };
  const handleSaveAnnouncement = (ann: Announcement) => {
    if (editingAnnouncement) {
      setAnnouncements(announcements.map((a, i) => a.text === editingAnnouncement.text ? ann : a));
      setEditingAnnouncement(undefined);
    } else { addAnnouncement(ann); }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-500">Manage your website settings</p>
      </div>

      {/* Company Information */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
        <h3 className="font-bold text-gray-900 dark:text-white">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
            <input type="text" defaultValue="SAVIMAN Industries" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tagline</label>
            <input type="text" defaultValue="Precision Manufacturing Excellence" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl" />
          </div>
        </div>
        <div className="pt-4 flex justify-end">
          <button className="flex items-center gap-2 px-6 py-3 bg-brass-500 text-white rounded-xl font-medium hover:bg-brass-600">
            <Save size={20} /> Save Changes
          </button>
        </div>
      </div>

      {/* Header Navigation CRUD */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Header Navigation</h3>
            <p className="text-sm text-gray-500">Manage header navigation links</p>
          </div>
          <button onClick={() => { setEditingHeaderLink(undefined); setShowHeaderModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-lg text-sm hover:bg-brass-600">
            <Plus size={16} /> Add Link
          </button>
        </div>
        <div className="space-y-2">
          {headerLinks.map((link, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-3">
                <GripVertical className="text-gray-400 cursor-move" size={16} />
                <span className="font-medium text-gray-900 dark:text-white">{link.label}</span>
                <span className="text-gray-500 text-sm">→ {link.href}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => editHeaderLink(index)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={14} /></button>
                <button onClick={() => deleteHeaderLink(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links CRUD */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Footer Links</h3>
            <p className="text-sm text-gray-500">Manage footer columns and links</p>
          </div>
          <button onClick={() => setShowFooterModal(true)} className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-lg text-sm hover:bg-brass-600">
            <Plus size={16} /> Add Column
          </button>
        </div>
        <div className="space-y-4">
          {footerColumns.map((col, colIndex) => (
            <div key={colIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <input type="text" value={col.title} onChange={(e) => updateFooterColumnTitle(colIndex, e.target.value)} className="font-bold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 focus:border-brass-500 focus:outline-none" placeholder="Column Title" />
                <button onClick={() => deleteFooterColumn(colIndex)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
              </div>
              <div className="space-y-2 ml-4">
                {col.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{link.label}</span>
                    <button onClick={() => deleteFooterLink(colIndex, linkIndex)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={12} /></button>
                  </div>
                ))}
                <button onClick={() => addFooterLink(colIndex)} className="text-sm text-brass-600 hover:text-brass-700 flex items-center gap-1"><Plus size={12} /> Add Link</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement Bar CRUD */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Announcement Bar</h3>
            <p className="text-sm text-gray-500">Manage top announcement bar</p>
          </div>
          <button onClick={() => { setEditingAnnouncement(undefined); setShowAnnouncementModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-lg text-sm hover:bg-brass-600">
            <Plus size={16} /> Add Announcement
          </button>
        </div>
        <div className="space-y-2">
          {announcements.map((ann, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs rounded-full ${ann.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{ann.active ? 'Active' : 'Inactive'}</span>
                <span className="font-medium text-gray-900 dark:text-white">{ann.text}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleAnnouncement(index)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Eye size={14} /></button>
                <button onClick={() => editAnnouncement(index)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={14} /></button>
                <button onClick={() => deleteAnnouncement(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Header Modal */}
      {showHeaderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editingHeaderLink ? 'Edit Header Link' : 'Add Header Link'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Label</label>
                <input type="text" id="headerLabel" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl" placeholder="e.g., Products" defaultValue={editingHeaderLink?.label} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL</label>
                <input type="text" id="headerHref" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl" placeholder="e.g., /products" defaultValue={editingHeaderLink?.href} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowHeaderModal(false); setEditingHeaderLink(undefined); }} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300">Cancel</button>
              <button onClick={() => {
                const label = (document.getElementById('headerLabel') as HTMLInputElement).value;
                const href = (document.getElementById('headerHref') as HTMLInputElement).value;
                handleSaveHeaderLink({ label, href, order: headerLinks.length + 1 });
                setShowHeaderModal(false);
              }} className="flex-1 py-3 bg-brass-500 text-white rounded-xl hover:bg-brass-600">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Modal */}
      {showFooterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Footer Column</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Column Title</label>
                <input type="text" id="footerTitle" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl" placeholder="e.g., Products" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowFooterModal(false)} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300">Cancel</button>
              <button onClick={() => {
                const title = (document.getElementById('footerTitle') as HTMLInputElement).value;
                addFooterColumn({ title, links: [] });
                setShowFooterModal(false);
              }} className="flex-1 py-3 bg-brass-500 text-white rounded-xl hover:bg-brass-600">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editingAnnouncement ? 'Edit Announcement' : 'Add Announcement'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea id="announcementText" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl" rows={2} placeholder="Enter announcement text" defaultValue={editingAnnouncement?.text} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                <select id="announcementType" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl" defaultValue={editingAnnouncement?.type || 'info'}>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="promo">Promotion</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowAnnouncementModal(false); setEditingAnnouncement(undefined); }} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300">Cancel</button>
              <button onClick={() => {
                const text = (document.getElementById('announcementText') as HTMLTextAreaElement).value;
                const type = (document.getElementById('announcementType') as HTMLSelectElement).value as any;
                handleSaveAnnouncement({ text, active: true, type });
                setShowAnnouncementModal(false);
              }} className="flex-1 py-3 bg-brass-500 text-white rounded-xl hover:bg-brass-600">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
