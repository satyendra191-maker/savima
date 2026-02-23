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
import { CareersService, Career } from '../services/crud';
import { Briefcase, MapPin, Clock } from 'lucide-react';

const JOB_TYPE_OPTIONS = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' }
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

export const AdminCareersPage: React.FC = () => {
  const toast = useToast();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCareer, setDeletingCareer] = useState<Career | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCareers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await CareersService.getAll({
        page: currentPage,
        limit: pageSize,
        search,
        status: statusFilter || undefined,
        department: departmentFilter || undefined
      });
      setCareers(result.data);
      setTotalCount(result.count);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch careers');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, statusFilter, departmentFilter, toast]);

  useEffect(() => {
    fetchCareers();
  }, [fetchCareers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, departmentFilter]);

  const handleAdd = () => {
    setEditingCareer(null);
    setShowModal(true);
  };

  const handleEdit = (career: Career) => {
    setEditingCareer(career);
    setShowModal(true);
  };

  const handleDelete = (career: Career) => {
    setDeletingCareer(career);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCareer) return;
    
    try {
      await CareersService.delete(deletingCareer.id);
      toast.success('Job posting deleted successfully');
      setShowDeleteModal(false);
      setDeletingCareer(null);
      fetchCareers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete job posting');
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setSubmitting(true);
    try {
      const careerData = {
        title: values.title,
        slug: values.slug || values.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: values.description,
        requirements: values.requirements,
        department: values.department,
        location: values.location,
        job_type: values.job_type || 'full-time',
        experience: values.experience,
        salary_range: values.salary_range,
        status: values.status || 'active',
        featured: values.featured || false,
        expires_at: values.expires_at || null
      };

      if (editingCareer) {
        await CareersService.update(editingCareer.id, careerData);
        toast.success('Job posting updated successfully');
      } else {
        await CareersService.create(careerData);
        toast.success('Job posting created successfully');
      }

      setShowModal(false);
      setEditingCareer(null);
      fetchCareers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save job posting');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (career: Career) => {
    try {
      await CareersService.toggleStatus(career.id, career.status);
      toast.success('Status updated successfully');
      fetchCareers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const columns: Column<Career>[] = [
    {
      key: 'title',
      label: 'Position',
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
          <p className="text-sm text-gray-500">{item.department}</p>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (item) => (
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
          <MapPin size={14} />
          {item.location || '-'}
        </div>
      )
    },
    {
      key: 'job_type',
      label: 'Type',
      render: (item) => (
        <span className="capitalize">{item.job_type?.replace('-', ' ')}</span>
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
      key: 'posted_at',
      label: 'Posted',
      render: (item) => item.posted_at ? new Date(item.posted_at).toLocaleDateString() : '-'
    }
  ];

  const fields: FormField[] = [
    { name: 'title', label: 'Job Title', type: 'text', required: true, placeholder: 'e.g., Mechanical Engineer' },
    { name: 'slug', label: 'Slug', type: 'text', placeholder: 'Auto-generated if empty' },
    { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Engineering' },
    { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g., Jamnagar, India' },
    { name: 'job_type', label: 'Job Type', type: 'select', options: JOB_TYPE_OPTIONS },
    { name: 'experience', label: 'Experience Required', type: 'text', placeholder: 'e.g., 2-5 years' },
    { name: 'salary_range', label: 'Salary Range', type: 'text', placeholder: 'e.g., ₹5-8 LPA' },
    { name: 'description', label: 'Job Description', type: 'textarea', rows: 4 },
    { name: 'requirements', label: 'Requirements', type: 'textarea', rows: 4 },
    { name: 'expires_at', label: 'Expires On', type: 'date' },
    { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
    { name: 'featured', label: 'Featured', type: 'switch' }
  ];

  const initialValues = editingCareer ? {
    title: editingCareer.title,
    slug: editingCareer.slug,
    department: editingCareer.department || '',
    location: editingCareer.location || '',
    job_type: editingCareer.job_type || 'full-time',
    experience: editingCareer.experience || '',
    salary_range: editingCareer.salary_range || '',
    description: editingCareer.description || '',
    requirements: editingCareer.requirements || '',
    expires_at: editingCareer.expires_at || '',
    status: editingCareer.status,
    featured: editingCareer.featured || false
  } : {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Careers</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage job openings and applications</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600 transition-colors"
        >
          Add Job
        </button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search jobs..."
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
        data={careers}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No job openings found"
        searchKeys={['title', 'department', 'location']}
        itemsPerPage={pageSize}
        onItemsPerPageChange={setPageSize}
      />

      <ModalForm
        isOpen={showModal}
        title={editingCareer ? 'Edit Job' : 'Add New Job'}
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
        submitText={editingCareer ? 'Update' : 'Create'}
        loading={submitting}
        size="lg"
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Delete Job"
        message={`Are you sure you want to delete "${deletingCareer?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        itemName={deletingCareer?.title}
      />
    </div>
  );
};

export default AdminCareersPage;
