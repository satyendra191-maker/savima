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
import { IndustriesService, Industry } from '../services/crud';
import { Building2 } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

export const AdminIndustriesPage: React.FC = () => {
  const toast = useToast();
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingIndustry, setDeletingIndustry] = useState<Industry | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchIndustries = useCallback(async () => {
    setLoading(true);
    try {
      const result = await IndustriesService.getAll({
        page: currentPage,
        limit: pageSize,
        search,
        status: statusFilter || undefined
      });
      setIndustries(result.data);
      setTotalCount(result.count);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch industries');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, statusFilter, toast]);

  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleAdd = () => {
    setEditingIndustry(null);
    setShowModal(true);
  };

  const handleEdit = (industry: Industry) => {
    setEditingIndustry(industry);
    setShowModal(true);
  };

  const handleDelete = (industry: Industry) => {
    setDeletingIndustry(industry);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingIndustry) return;
    
    try {
      await IndustriesService.delete(deletingIndustry.id);
      toast.success('Industry deleted successfully');
      setShowDeleteModal(false);
      setDeletingIndustry(null);
      fetchIndustries();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete industry');
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setSubmitting(true);
    try {
      let imageUrl = values.image_url;

      if (values.imageFile) {
        const uploaded = await IndustriesService.uploadImage(values.imageFile);
        if (uploaded) {
          imageUrl = uploaded;
        }
      }

      const industryData = {
        name: values.name,
        slug: values.slug || values.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: values.description,
        icon: values.icon,
        image_url: imageUrl,
        product_count: values.product_count || 0,
        status: values.status || 'active',
        featured: values.featured || false,
        meta_title: values.meta_title,
        meta_description: values.meta_description
      };

      if (editingIndustry) {
        await IndustriesService.update(editingIndustry.id, industryData);
        toast.success('Industry updated successfully');
      } else {
        await IndustriesService.create(industryData);
        toast.success('Industry created successfully');
      }

      setShowModal(false);
      setEditingIndustry(null);
      fetchIndustries();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save industry');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (industry: Industry) => {
    try {
      await IndustriesService.toggleStatus(industry.id, industry.status);
      toast.success('Status updated successfully');
      fetchIndustries();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const columns: Column<Industry>[] = [
    {
      key: 'name',
      label: 'Industry',
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <span className="text-2xl">{item.icon || '🏭'}</span>
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
            <p className="text-sm text-gray-500">{item.slug}</p>
          </div>
        </div>
      )
    },
    {
      key: 'product_count',
      label: 'Products',
      render: (item) => item.product_count || 0
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
          onChange={() => {}}
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
    { name: 'name', label: 'Industry Name', type: 'text', required: true, placeholder: 'e.g., Aerospace' },
    { name: 'slug', label: 'Slug', type: 'text', placeholder: 'Auto-generated if empty' },
    { name: 'description', label: 'Description', type: 'textarea', rows: 3, placeholder: 'Industry description' },
    { name: 'icon', label: 'Icon (Emoji)', type: 'text', placeholder: 'e.g., 🚀' },
    { name: 'image_url', label: 'Image URL', type: 'text', placeholder: 'https://...' },
    { name: 'imageFile', label: 'Upload Image', type: 'file', accept: 'image/*' },
    { name: 'product_count', label: 'Product Count', type: 'number', placeholder: '0' },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
    { name: 'featured', label: 'Featured', type: 'switch' },
    { name: 'meta_title', label: 'SEO Title', type: 'text' },
    { name: 'meta_description', label: 'SEO Description', type: 'textarea', rows: 2 }
  ];

  const initialValues = editingIndustry ? {
    name: editingIndustry.name,
    slug: editingIndustry.slug,
    description: editingIndustry.description || '',
    icon: editingIndustry.icon || '',
    image_url: editingIndustry.image_url || '',
    product_count: editingIndustry.product_count || 0,
    status: editingIndustry.status,
    featured: editingIndustry.featured || false,
    meta_title: editingIndustry.meta_title || '',
    meta_description: editingIndustry.meta_description || ''
  } : {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Industries</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage industries served by your products</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600 transition-colors"
        >
          Add Industry
        </button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search industries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full sm:w-64"
        />
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
        data={industries}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No industries found"
        searchKeys={['name', 'description']}
        itemsPerPage={pageSize}
        onItemsPerPageChange={setPageSize}
      />

      <ModalForm
        isOpen={showModal}
        title={editingIndustry ? 'Edit Industry' : 'Add New Industry'}
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
        submitText={editingIndustry ? 'Update' : 'Create'}
        loading={submitting}
        size="lg"
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Delete Industry"
        message={`Are you sure you want to delete "${deletingIndustry?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        itemName={deletingIndustry?.name}
      />
    </div>
  );
};

export default AdminIndustriesPage;
