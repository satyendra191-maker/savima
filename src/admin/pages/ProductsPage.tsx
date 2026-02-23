import React, { useState, useEffect, useCallback } from 'react';
import { 
  DataTable, 
  ModalForm, 
  ConfirmDeleteModal, 
  StatusBadge, 
  ToggleSwitch,
  useToast,
  Column,
  FormField
} from '../components';
import { ProductsService, Product } from '../services/crud';
import { Download, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  { value: 'brass', label: 'Brass' },
  { value: 'steel', label: 'Steel' },
  { value: 'precision', label: 'Precision' },
  { value: 'hydraulic', label: 'Hydraulic' },
  { value: 'other', label: 'Other' }
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'draft', label: 'Draft' }
];

export const AdminProductsPage: React.FC = () => {
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await ProductsService.getAll({
        page: currentPage,
        limit: pageSize,
        search,
        category: categoryFilter || undefined,
        status: statusFilter || undefined
      });
      setProducts(result?.data ?? []);
      setTotalCount(result?.count ?? 0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, categoryFilter, statusFilter, toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter]);

  const handleAdd = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    
    try {
      await ProductsService.delete(deletingProduct.id);
      toast.success('Product deleted successfully');
      setShowDeleteModal(false);
      setDeletingProduct(null);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setSubmitting(true);
    try {
      let imageUrl = values.image_url;
      
      if (values.imageFile) {
        const uploaded = await ProductsService.uploadImage(values.imageFile);
        if (uploaded) {
          imageUrl = uploaded;
        }
      }

      const productData = {
        name: values.name,
        slug: values.slug || values.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: values.category,
        short_description: values.short_description,
        long_description: values.long_description,
        industry_usage: values.industry_usage,
        image_url: imageUrl,
        status: values.status || 'active',
        featured: values.featured || false,
        meta_title: values.meta_title,
        meta_description: values.meta_description
      };

      if (editingProduct) {
        await ProductsService.update(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await ProductsService.create(productData);
        toast.success('Product created successfully');
      }

      setShowModal(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      await ProductsService.toggleStatus(product.id, product.status);
      toast.success('Status updated successfully');
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      await ProductsService.toggleFeatured(product.id, product.featured || false);
      toast.success('Featured status updated');
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update featured status');
    }
  };

  const handleExport = () => {
    const headers = ['Name', 'Slug', 'Category', 'Status', 'Featured', 'Created At'];
    const rows = products.map(p => [
      p.name,
      p.slug,
      p.category,
      p.status,
      p.featured ? 'Yes' : 'No',
      p.created_at ? new Date(p.created_at).toLocaleDateString() : ''
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Products exported successfully');
  };

  const columns: Column<Product>[] = [
    {
      key: 'name',
      label: 'Product',
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.image_url && (
            <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
            <p className="text-sm text-gray-500">{item.slug}</p>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (item) => (
        <span className="capitalize">{item.category}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <button onClick={() => handleToggleStatus(item)} className="cursor-pointer">
          <StatusBadge status={item.status} />
        </button>
      )
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (item) => (
        <ToggleSwitch
          checked={item.featured || false}
          onChange={() => handleToggleFeatured(item)}
        />
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (item) => item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'
    }
  ];

  const fields: FormField[] = [
    { name: 'name', label: 'Product Name', type: 'text', required: true, placeholder: 'Enter product name' },
    { name: 'slug', label: 'Slug', type: 'text', placeholder: 'Auto-generated if empty' },
    { name: 'category', label: 'Category', type: 'select', required: true, options: CATEGORIES, placeholder: 'Select category' },
    { name: 'short_description', label: 'Short Description', type: 'textarea', rows: 2, placeholder: 'Brief product description' },
    { name: 'long_description', label: 'Long Description', type: 'textarea', rows: 4, placeholder: 'Detailed product description' },
    { name: 'industry_usage', label: 'Industry Usage', type: 'text', placeholder: 'e.g., Automotive, Medical' },
    { name: 'image_url', label: 'Image URL', type: 'text', placeholder: 'https://...' },
    { name: 'imageFile', label: 'Upload Image', type: 'file', accept: 'image/*' },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
    { name: 'featured', label: 'Featured Product', type: 'switch' },
    { name: 'meta_title', label: 'SEO Title', type: 'text' },
    { name: 'meta_description', label: 'SEO Description', type: 'textarea', rows: 2 }
  ];

  const initialValues = editingProduct ? {
    name: editingProduct.name,
    slug: editingProduct.slug,
    category: editingProduct.category,
    short_description: editingProduct.short_description || '',
    long_description: editingProduct.long_description || '',
    industry_usage: editingProduct.industry_usage || '',
    image_url: editingProduct.image_url || '',
    status: editingProduct.status,
    featured: editingProduct.featured || false,
    meta_title: editingProduct.meta_title || '',
    meta_description: editingProduct.meta_description || ''
  } : {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600 transition-colors"
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full sm:w-64"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <DataTable
        data={products}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No products found"
        searchKeys={['name', 'slug', 'category']}
        itemsPerPage={pageSize}
        onItemsPerPageChange={setPageSize}
      />

      <ModalForm
        isOpen={showModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
        submitText={editingProduct ? 'Update' : 'Create'}
        loading={submitting}
        size="lg"
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Delete Product"
        message={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        itemName={deletingProduct?.name}
      />
    </div>
  );
};

export default AdminProductsPage;
