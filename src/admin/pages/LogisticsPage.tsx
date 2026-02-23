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
import { LogisticsService, LogisticsPartner } from '../services/crud';
import { Globe, Phone, Mail, ExternalLink, Star } from 'lucide-react';

const PARTNER_TYPE_OPTIONS = [
  { value: 'courier', label: 'Courier' },
  { value: 'freight', label: 'Freight' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'shipping', label: 'Shipping' }
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

export const AdminLogisticsPage: React.FC = () => {
  const toast = useToast();
  const [partners, setPartners] = useState<LogisticsPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<LogisticsPartner | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPartner, setDeletingPartner] = useState<LogisticsPartner | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    try {
      const result = await LogisticsService.getAll({
        page: currentPage,
        limit: pageSize,
        search,
        status: statusFilter || undefined,
        type: typeFilter || undefined
      });
      setPartners(result.data);
      setTotalCount(result.count);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch logistics partners');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, statusFilter, typeFilter, toast]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, typeFilter]);

  const handleAdd = () => {
    setEditingPartner(null);
    setShowModal(true);
  };

  const handleEdit = (partner: LogisticsPartner) => {
    setEditingPartner(partner);
    setShowModal(true);
  };

  const handleDelete = (partner: LogisticsPartner) => {
    setDeletingPartner(partner);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPartner) return;
    
    try {
      await LogisticsService.delete(deletingPartner.id);
      toast.success('Partner deleted successfully');
      setShowDeleteModal(false);
      setDeletingPartner(null);
      fetchPartners();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete partner');
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setSubmitting(true);
    try {
      const partnerData = {
        name: values.name,
        partner_type: values.partner_type,
        description: values.description,
        website: values.website,
        contact_person: values.contact_person,
        contact_email: values.contact_email,
        contact_phone: values.contact_phone,
        rating: values.rating || 0,
        status: values.status || 'active',
        contract_start: values.contract_start || null,
        contract_end: values.contract_end || null,
        notes: values.notes
      };

      if (editingPartner) {
        await LogisticsService.update(editingPartner.id, partnerData);
        toast.success('Partner updated successfully');
      } else {
        await LogisticsService.create(partnerData);
        toast.success('Partner created successfully');
      }

      setShowModal(false);
      setEditingPartner(null);
      fetchPartners();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save partner');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (partner: LogisticsPartner) => {
    try {
      await LogisticsService.toggleStatus(partner.id, partner.status);
      toast.success('Status updated successfully');
      fetchPartners();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const columns: Column<LogisticsPartner>[] = [
    {
      key: 'name',
      label: 'Partner',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
            <p className="text-sm text-gray-500 capitalize">{item.partner_type}</p>
          </div>
        </div>
      )
    },
    {
      key: 'contact_person',
      label: 'Contact',
      render: (item) => (
        <div>
          <p className="text-gray-900 dark:text-white">{item.contact_person || '-'}</p>
          <p className="text-sm text-gray-500">{item.contact_email}</p>
        </div>
      )
    },
    {
      key: 'contact_phone',
      label: 'Phone',
      render: (item) => item.contact_phone || '-'
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (item) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span>{item.rating?.toFixed(1) || 'N/A'}</span>
        </div>
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
    }
  ];

  const fields: FormField[] = [
    { name: 'name', label: 'Company Name', type: 'text', required: true, placeholder: 'e.g., DHL Express' },
    { name: 'partner_type', label: 'Partner Type', type: 'select', options: PARTNER_TYPE_OPTIONS },
    { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
    { name: 'website', label: 'Website', type: 'text', placeholder: 'https://...' },
    { name: 'contact_person', label: 'Contact Person', type: 'text' },
    { name: 'contact_email', label: 'Contact Email', type: 'email' },
    { name: 'contact_phone', label: 'Contact Phone', type: 'text' },
    { name: 'rating', label: 'Rating (0-5)', type: 'number', min: 0, max: 5 },
    { name: 'contract_start', label: 'Contract Start', type: 'date' },
    { name: 'contract_end', label: 'Contract End', type: 'date' },
    { name: 'notes', label: 'Notes', type: 'textarea', rows: 2 },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS }
  ];

  const initialValues = editingPartner ? {
    name: editingPartner.name,
    partner_type: editingPartner.partner_type || '',
    description: editingPartner.description || '',
    website: editingPartner.website || '',
    contact_person: editingPartner.contact_person || '',
    contact_email: editingPartner.contact_email || '',
    contact_phone: editingPartner.contact_phone || '',
    rating: editingPartner.rating || 0,
    contract_start: editingPartner.contract_start || '',
    contract_end: editingPartner.contract_end || '',
    notes: editingPartner.notes || '',
    status: editingPartner.status
  } : {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Logistics Partners</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage shipping and logistics partners</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600 transition-colors"
        >
          Add Partner
        </button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search partners..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full sm:w-64"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">All Types</option>
          {PARTNER_TYPE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
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
        data={partners}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No logistics partners found"
        searchKeys={['name', 'description', 'contact_person']}
        itemsPerPage={pageSize}
        onItemsPerPageChange={setPageSize}
      />

      <ModalForm
        isOpen={showModal}
        title={editingPartner ? 'Edit Partner' : 'Add New Partner'}
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
        submitText={editingPartner ? 'Update' : 'Create'}
        loading={submitting}
        size="lg"
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Delete Partner"
        message={`Are you sure you want to delete "${deletingPartner?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        itemName={deletingPartner?.name}
      />
    </div>
  );
};

export default AdminLogisticsPage;
