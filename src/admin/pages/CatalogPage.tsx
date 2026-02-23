import React, { useState, useEffect, useCallback } from 'react';
import { 
  DataTable, 
  ModalForm, 
  ConfirmDeleteModal, 
  StatusBadge,
  useToast,
  Column,
  FormField
} from '../components';
import { CatalogsService, Catalog } from '../services/crud';
import { Download, FileText, Upload, ExternalLink } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

const LANGUAGE_OPTIONS = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Japanese', label: 'Japanese' }
];

export const AdminCatalogPage: React.FC = () => {
  const toast = useToast();
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<Catalog | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCatalog, setDeletingCatalog] = useState<Catalog | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchCatalogs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await CatalogsService.getAll({
        page: currentPage,
        limit: pageSize,
        search,
        status: statusFilter || undefined
      });
      setCatalogs(result.data);
      setTotalCount(result.count);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch catalogs');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, statusFilter, toast]);

  useEffect(() => {
    fetchCatalogs();
  }, [fetchCatalogs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleAdd = () => {
    setEditingCatalog(null);
    setShowModal(true);
  };

  const handleEdit = (catalog: Catalog) => {
    setEditingCatalog(catalog);
    setShowModal(true);
  };

  const handleDelete = (catalog: Catalog) => {
    setDeletingCatalog(catalog);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCatalog) return;
    
    try {
      await CatalogsService.delete(deletingCatalog.id);
      toast.success('Catalog deleted successfully');
      setShowDeleteModal(false);
      setDeletingCatalog(null);
      fetchCatalogs();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete catalog');
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setSubmitting(true);
    try {
      let fileUrl = values.file_url;
      let fileSize = values.file_size;

      if (values.catalogFile) {
        setUploading(true);
        const uploaded = await CatalogsService.uploadFile(values.catalogFile);
        setUploading(false);
        
        if (uploaded) {
          fileUrl = uploaded.url;
          fileSize = uploaded.size;
        }
      }

      let thumbnailUrl = values.thumbnail;
      if (values.thumbnailFile) {
        const uploaded = await CatalogsService.uploadFile(values.thumbnailFile);
        if (uploaded) {
          thumbnailUrl = uploaded.url;
        }
      }

      const catalogData = {
        title: values.title,
        description: values.description,
        file_url: fileUrl,
        thumbnail: thumbnailUrl,
        pages: values.pages || 0,
        file_size: fileSize,
        status: values.status || 'active',
        featured: values.featured || false,
        category: values.category,
        language: values.language || 'English',
        version: values.version
      };

      if (editingCatalog) {
        await CatalogsService.update(editingCatalog.id, catalogData);
        toast.success('Catalog updated successfully');
      } else {
        await CatalogsService.create(catalogData);
        toast.success('Catalog created successfully');
      }

      setShowModal(false);
      setEditingCatalog(null);
      fetchCatalogs();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save catalog');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (catalog: Catalog) => {
    if (catalog.file_url) {
      await CatalogsService.incrementDownloads(catalog.id);
      window.open(catalog.file_url, '_blank');
    }
  };

  const columns: Column<Catalog>[] = [
    {
      key: 'title',
      label: 'Catalog',
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.thumbnail ? (
            <img src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 bg-brass-100 dark:bg-brass-900/30 rounded-lg flex items-center justify-center">
              <FileText className="text-brass-600" size={24} />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
            <p className="text-sm text-gray-500">{item.category} • {item.language}</p>
          </div>
        </div>
      )
    },
    {
      key: 'pages',
      label: 'Pages',
      render: (item) => item.pages || '-'
    },
    {
      key: 'file_size',
      label: 'Size',
      render: (item) => item.file_size || '-'
    },
    {
      key: 'downloads',
      label: 'Downloads',
      render: (item) => item.downloads || 0
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (item) => item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'
    }
  ];

  const fields: FormField[] = [
    { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Catalog title' },
    { name: 'description', label: 'Description', type: 'textarea', rows: 3, placeholder: 'Catalog description' },
    { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g., Products, Technical' },
    { name: 'language', label: 'Language', type: 'select', options: LANGUAGE_OPTIONS },
    { name: 'pages', label: 'Number of Pages', type: 'number', placeholder: 'e.g., 48' },
    { name: 'version', label: 'Version', type: 'text', placeholder: 'e.g., 2024.1' },
    { name: 'file_url', label: 'File URL', type: 'text', placeholder: 'https://...' },
    { name: 'catalogFile', label: 'Upload PDF', type: 'file', accept: '.pdf' },
    { name: 'thumbnail', label: 'Thumbnail URL', type: 'text', placeholder: 'https://...' },
    { name: 'thumbnailFile', label: 'Upload Thumbnail', type: 'file', accept: 'image/*' },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
    { name: 'featured', label: 'Featured', type: 'switch' }
  ];

  const initialValues = editingCatalog ? {
    title: editingCatalog.title,
    description: editingCatalog.description || '',
    category: editingCatalog.category || '',
    language: editingCatalog.language || 'English',
    pages: editingCatalog.pages || 0,
    version: editingCatalog.version || '',
    file_url: editingCatalog.file_url || '',
    thumbnail: editingCatalog.thumbnail || '',
    status: editingCatalog.status,
    featured: editingCatalog.featured || false
  } : {};

  const extraActions = (item: Catalog) => (
    item.file_url && (
      <button
        onClick={(e) => { e.stopPropagation(); handleDownload(item); }}
        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
        title="Download"
      >
        <Download size={16} />
      </button>
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Catalogs</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage downloadable catalogs and brochures</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600 transition-colors"
        >
          <Upload size={18} />
          Add Catalog
        </button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search catalogs..."
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
        data={catalogs}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        extraActions={extraActions}
        emptyMessage="No catalogs found"
        searchKeys={['title', 'description', 'category']}
        itemsPerPage={pageSize}
        onItemsPerPageChange={setPageSize}
      />

      <ModalForm
        isOpen={showModal}
        title={editingCatalog ? 'Edit Catalog' : 'Add New Catalog'}
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
        submitText={submitting ? (uploading ? 'Uploading...' : 'Saving...') : (editingCatalog ? 'Update' : 'Create')}
        loading={submitting}
        size="lg"
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Delete Catalog"
        message={`Are you sure you want to delete "${deletingCatalog?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        itemName={deletingCatalog?.title}
      />
    </div>
  );
};

export default AdminCatalogPage;
