import React, { useState, useEffect, useCallback } from 'react';
import { 
  DataTable, 
  ConfirmDeleteModal, 
  StatusBadge,
  useToast,
  Column,
  FormField,
  ModalForm
} from '../components';
import { InquiriesService, Inquiry } from '../services/crud';
import { Eye, Mail, Phone, Building2, MessageSquare } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'responded', label: 'Responded' },
  { value: 'closed', label: 'Closed' }
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' }
];

export const AdminInquiriesPage: React.FC = () => {
  const toast = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingInquiry, setDeletingInquiry] = useState<Inquiry | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const result = await InquiriesService.getAll({
        page: currentPage,
        limit: pageSize,
        search,
        status: statusFilter || undefined
      });
      setInquiries(result.data);
      setTotalCount(result.count);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, statusFilter, toast]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleView = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setShowViewModal(true);
  };

  const handleDelete = (inquiry: Inquiry) => {
    setDeletingInquiry(inquiry);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingInquiry) return;
    
    try {
      await InquiriesService.delete(deletingInquiry.id);
      toast.success('Inquiry deleted successfully');
      setShowDeleteModal(false);
      setDeletingInquiry(null);
      fetchInquiries();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete inquiry');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await InquiriesService.updateStatus(id, status);
      toast.success('Status updated successfully');
      fetchInquiries();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleNotesUpdate = async (values: Record<string, any>) => {
    if (!selectedInquiry) return;
    
    try {
      await InquiriesService.update(selectedInquiry.id, { notes: values.notes });
      toast.success('Notes updated successfully');
      setShowViewModal(false);
      fetchInquiries();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update notes');
      throw error;
    }
  };

  const columns: Column<Inquiry>[] = [
    {
      key: 'name',
      label: 'Contact',
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
          <p className="text-sm text-gray-500">{item.company || 'No company'}</p>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (item) => (
        <a href={`mailto:${item.email}`} className="text-brass-500 hover:underline">
          {item.email}
        </a>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (item) => item.phone || '-'
    },
    {
      key: 'product',
      label: 'Product',
      render: (item) => item.product || '-'
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <select
          value={item.status}
          onChange={(e) => handleStatusChange(item.id, e.target.value)}
          className={`px-2 py-1 text-xs rounded-full border-0 cursor-pointer ${
            item.status === 'new' ? 'bg-blue-100 text-blue-700' :
            item.status === 'responded' ? 'bg-green-100 text-green-700' :
            'bg-gray-100 text-gray-700'
          }`}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (item) => item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inquiries</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage customer inquiries and messages</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search inquiries..."
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
        data={inquiries}
        columns={columns}
        loading={loading}
        onView={handleView}
        onDelete={handleDelete}
        emptyMessage="No inquiries found"
        searchKeys={['name', 'email', 'company', 'message']}
        itemsPerPage={pageSize}
        onItemsPerPageChange={setPageSize}
        showAddButton={false}
      />

      <ModalForm
        isOpen={showViewModal}
        title="Inquiry Details"
        fields={[
          { name: 'name', label: 'Name', type: 'text', disabled: true },
          { name: 'company', label: 'Company', type: 'text', disabled: true },
          { name: 'email', label: 'Email', type: 'email', disabled: true },
          { name: 'phone', label: 'Phone', type: 'text', disabled: true },
          { name: 'product', label: 'Product', type: 'text', disabled: true },
          { name: 'message', label: 'Message', type: 'textarea', rows: 4, disabled: true },
          { name: 'notes', label: 'Internal Notes', type: 'textarea', rows: 3, placeholder: 'Add notes for this inquiry...' }
        ]}
        initialValues={selectedInquiry ? {
          name: selectedInquiry.name,
          company: selectedInquiry.company || '',
          email: selectedInquiry.email,
          phone: selectedInquiry.phone || '',
          product: selectedInquiry.product || '',
          message: selectedInquiry.message || '',
          notes: selectedInquiry.notes || ''
        } : {}}
        onSubmit={handleNotesUpdate}
        onClose={() => setShowViewModal(false)}
        submitText="Save Notes"
        loading={submitting}
        size="lg"
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Delete Inquiry"
        message={`Are you sure you want to delete this inquiry from "${deletingInquiry?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default AdminInquiriesPage;
