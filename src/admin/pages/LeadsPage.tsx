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
import { LeadsService, AIGeneratedLeadsService, Lead } from '../../services/leads';
import { Download, RefreshCw, Plus, Search, Filter, User, Building2, Mail, Phone, Globe, Star } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' }
];

const SOURCE_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'ai_chatbot', label: 'AI Chatbot' },
  { value: 'contact_form', label: 'Contact Form' },
  { value: 'logistics', label: 'Logistics Quote' },
  { value: 'referral', label: 'Referral' }
];

export const AdminLeadsPage: React.FC = () => {
  const toast = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const result = await LeadsService.getAll({
        page: currentPage,
        limit: pageSize,
        search,
        status: statusFilter || undefined
      });
      setLeads(result.data);
      setTotalCount(result.count);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, statusFilter, toast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleAdd = () => {
    setEditingLead(null);
    setShowModal(true);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setShowModal(true);
  };

  const handleDelete = (lead: Lead) => {
    setDeletingLead(lead);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingLead) return;
    
    try {
      await LeadsService.delete(deletingLead.id);
      toast.success('Lead deleted successfully');
      setShowDeleteModal(false);
      setDeletingLead(null);
      fetchLeads();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete lead');
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setSubmitting(true);
    try {
      if (editingLead) {
        await LeadsService.update(editingLead.id, values);
        toast.success('Lead updated successfully');
      } else {
        await LeadsService.create(values);
        toast.success('Lead created successfully');
      }

      setShowModal(false);
      setEditingLead(null);
      fetchLeads();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save lead');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await LeadsService.updateStatus(id, status);
      toast.success('Status updated successfully');
      fetchLeads();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleConvert = async (lead: Lead) => {
    try {
      await LeadsService.markConverted(lead.id);
      toast.success('Lead marked as converted!');
      fetchLeads();
    } catch (error: any) {
      toast.error(error.message || 'Failed to convert lead');
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf' | 'doc') => {
    const headers = ['Name', 'Company', 'Country', 'Phone', 'Email', 'Requirement', 'Source', 'Status', 'Converted', 'Date'];
    const rows = leads.map(l => [
      l.person_name,
      l.company_name || '',
      l.country_code || '',
      l.contact_number || '',
      l.email || '',
      l.requirement_description || '',
      l.source,
      l.status,
      l.converted ? 'Yes' : 'No',
      l.created_at ? new Date(l.created_at).toLocaleDateString() : ''
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : format}`;
    link.click();
    toast.success(`Exported to ${format.toUpperCase()} successfully`);
  };

  const columns: Column<Lead>[] = [
    {
      key: 'person_name',
      label: 'Lead',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brass-100 dark:bg-brass-900/30 rounded-full flex items-center justify-center">
            <User className="text-brass-600" size={18} />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{item.person_name}</p>
            <p className="text-sm text-gray-500">{item.company_name || 'No company'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'country_code',
      label: 'Location',
      render: (item) => (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Globe size={14} />
          <span>{item.country_code || '-'}</span>
        </div>
      )
    },
    {
      key: 'contact_number',
      label: 'Contact',
      render: (item) => (
        <div className="text-sm">
          {item.contact_number && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
              <Phone size={12} />
              <span>{item.contact_number}</span>
            </div>
          )}
          {item.email && (
            <div className="flex items-center gap-1 text-gray-500">
              <Mail size={12} />
              <span className="text-xs">{item.email}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'requirement_description',
      label: 'Requirement',
      render: (item) => (
        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
          {item.requirement_description || '-'}
        </p>
      )
    },
    {
      key: 'source',
      label: 'Source',
      render: (item) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          item.source === 'ai_chatbot' ? 'bg-purple-100 text-purple-700' :
          item.source === 'website' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {item.source}
        </span>
      )
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
            item.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
            item.status === 'qualified' ? 'bg-purple-100 text-purple-700' :
            item.status === 'converted' ? 'bg-green-100 text-green-700' :
            'bg-red-100 text-red-700'
          }`}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )
    },
    {
      key: 'converted',
      label: 'Converted',
      render: (item) => (
        item.converted ? (
          <div className="flex items-center gap-1 text-green-600">
            <Star size={14} className="fill-current" />
            <span className="text-sm font-medium">Yes</span>
          </div>
        ) : (
          <button
            onClick={() => handleConvert(item)}
            className="text-xs text-gray-500 hover:text-brass-500"
          >
            Mark Convert
          </button>
        )
      )
    }
  ];

  const fields: FormField[] = [
    { name: 'person_name', label: 'Person Name', type: 'text', required: true, placeholder: 'Enter full name' },
    { name: 'company_name', label: 'Company Name', type: 'text', placeholder: 'Enter company name' },
    { name: 'country_code', label: 'Country Code', type: 'text', placeholder: 'e.g., US, UK, IN' },
    { name: 'contact_number', label: 'Contact Number', type: 'text', placeholder: 'Enter phone number' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter email address' },
    { name: 'requirement_description', label: 'Requirement Description', type: 'textarea', rows: 3, placeholder: 'Describe the requirement' },
    { name: 'source', label: 'Lead Source', type: 'select', options: SOURCE_OPTIONS },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
    { name: 'notes', label: 'Internal Notes', type: 'textarea', rows: 2, placeholder: 'Add notes...' }
  ];

  const initialValues = editingLead ? {
    person_name: editingLead.person_name,
    company_name: editingLead.company_name || '',
    country_code: editingLead.country_code || '',
    contact_number: editingLead.contact_number || '',
    email: editingLead.email || '',
    requirement_description: editingLead.requirement_description || '',
    source: editingLead.source,
    status: editingLead.status,
    notes: editingLead.notes || ''
  } : {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your leads and conversions</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700">
              <Download size={18} /> Export
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button onClick={() => handleExport('csv')} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">CSV</button>
              <button onClick={() => handleExport('excel')} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">Excel</button>
              <button onClick={() => handleExport('pdf')} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">PDF</button>
            </div>
          </div>
          <button onClick={fetchLeads} className="p-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700">
            <RefreshCw size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600">
            <Plus size={18} /> Add Lead
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
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
        data={leads}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No leads found"
        searchKeys={['person_name', 'company_name', 'email', 'requirement_description']}
        itemsPerPage={pageSize}
        onItemsPerPageChange={setPageSize}
      />

      <ModalForm
        isOpen={showModal}
        title={editingLead ? 'Edit Lead' : 'Add New Lead'}
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
        submitText={editingLead ? 'Update' : 'Create'}
        loading={submitting}
        size="lg"
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Delete Lead"
        message={`Are you sure you want to delete lead "${deletingLead?.person_name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default AdminLeadsPage;
