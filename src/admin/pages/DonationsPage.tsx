import React, { useState, useEffect, useCallback } from 'react';
import { 
  DataTable, 
  ConfirmDeleteModal, 
  StatusBadge,
  useToast,
  Column
} from '../components';
import { DonationsService, Donation } from '../services/crud';
import { Download, DollarSign, TrendingUp, Users, Filter } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' }
];

export const AdminDonationsPage: React.FC = () => {
  const toast = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, count: 0 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingDonation, setDeletingDonation] = useState<Donation | null>(null);

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    try {
      const result = await DonationsService.getAll({
        page: currentPage,
        limit: pageSize,
        search,
        status: statusFilter || undefined
      });
      setDonations(result.data);
      setTotalCount(result.count);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, statusFilter, toast]);

  const fetchStats = useCallback(async () => {
    try {
      const result = await DonationsService.getStats();
      setStats(result);
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, [fetchDonations, fetchStats]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleDelete = (donation: Donation) => {
    setDeletingDonation(donation);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingDonation) return;
    
    try {
      await DonationsService.delete(deletingDonation.id);
      toast.success('Donation deleted successfully');
      setShowDeleteModal(false);
      setDeletingDonation(null);
      fetchDonations();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete donation');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await DonationsService.updateStatus(id, status);
      toast.success('Status updated successfully');
      fetchDonations();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleExport = () => {
    DonationsService.exportToCSV(donations);
    toast.success('Donations exported successfully');
  };

  const columns: Column<Donation>[] = [
    {
      key: 'donor_name',
      label: 'Donor',
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {item.anonymous ? 'Anonymous' : item.donor_name}
          </p>
          <p className="text-sm text-gray-500">{item.donor_email || '-'}</p>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (item) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {item.currency === 'INR' ? '₹' : '$'}{item.amount.toLocaleString()}
        </span>
      )
    },
    {
      key: 'transaction_id',
      label: 'Transaction ID',
      render: (item) => (
        <span className="font-mono text-sm text-gray-500">{item.transaction_id || '-'}</span>
      )
    },
    {
      key: 'payment_method',
      label: 'Method',
      render: (item) => item.payment_method || '-'
    },
    {
      key: 'payment_status',
      label: 'Status',
      render: (item) => (
        <select
          value={item.payment_status}
          onChange={(e) => handleStatusChange(item.id, e.target.value)}
          className={`px-2 py-1 text-xs rounded-full border-0 cursor-pointer ${
            item.payment_status === 'completed' ? 'bg-green-100 text-green-700' :
            item.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
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
      key: 'created_at',
      label: 'Date',
      render: (item) => item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Donations</h1>
          <p className="text-gray-500 dark:text-gray-400">Track and manage donations</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Raised</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              <Filter className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Users className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Donors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.count}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search donations..."
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
        data={donations}
        columns={columns}
        loading={loading}
        onDelete={handleDelete}
        emptyMessage="No donations found"
        searchKeys={['donor_name', 'donor_email', 'transaction_id']}
        itemsPerPage={pageSize}
        onItemsPerPageChange={setPageSize}
        showAddButton={false}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Delete Donation"
        message="Are you sure you want to delete this donation record? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default AdminDonationsPage;
