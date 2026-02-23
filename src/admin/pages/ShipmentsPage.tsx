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
import { ShipmentsService, Shipment } from '../services/crud';
import { Truck, MapPin, Package, Clock } from 'lucide-react';

const SHIPMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

export const AdminShipmentsPage: React.FC = () => {
  const toast = useToast();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingShipment, setDeletingShipment] = useState<Shipment | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const result = await ShipmentsService.getAll({
        page: currentPage,
        limit: pageSize,
        search,
        status: statusFilter || undefined
      });
      setShipments(result.data);
      setTotalCount(result.count);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, statusFilter, toast]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleAdd = () => {
    setEditingShipment(null);
    setShowModal(true);
  };

  const handleEdit = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setShowModal(true);
  };

  const handleDelete = (shipment: Shipment) => {
    setDeletingShipment(shipment);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingShipment) return;
    
    try {
      await ShipmentsService.delete(deletingShipment.id);
      toast.success('Shipment deleted successfully');
      setShowDeleteModal(false);
      setDeletingShipment(null);
      fetchShipments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete shipment');
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setSubmitting(true);
    try {
      const shipmentData = {
        order_id: values.order_id,
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        customer_phone: values.customer_phone,
        shipping_address: values.shipping_address,
        product_details: values.product_details,
        weight: values.weight,
        dimensions: values.dimensions,
        logistic_partner: values.logistic_partner,
        carrier: values.carrier,
        shipment_status: values.shipment_status || 'pending',
        current_location: values.current_location,
        origin_location: values.origin_location,
        destination_country: values.destination_country,
        estimated_delivery: values.estimated_delivery || null
      };

      if (editingShipment) {
        await ShipmentsService.update(editingShipment.id, shipmentData);
        toast.success('Shipment updated successfully');
      } else {
        await ShipmentsService.create(shipmentData);
        toast.success('Shipment created successfully');
      }

      setShowModal(false);
      setEditingShipment(null);
      fetchShipments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save shipment');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await ShipmentsService.updateStatus(id, status);
      toast.success('Status updated successfully');
      fetchShipments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const columns: Column<Shipment>[] = [
    {
      key: 'tracking_number',
      label: 'Tracking #',
      render: (item) => (
        <span className="font-mono font-medium text-gray-900 dark:text-white">
          {item.tracking_number}
        </span>
      )
    },
    {
      key: 'customer_name',
      label: 'Customer',
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{item.customer_name}</p>
          <p className="text-sm text-gray-500">{item.customer_email}</p>
        </div>
      )
    },
    {
      key: 'logistic_partner',
      label: 'Carrier',
      render: (item) => item.logistic_partner || '-'
    },
    {
      key: 'current_location',
      label: 'Location',
      render: (item) => (
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
          <MapPin size={14} />
          {item.current_location || '-'}
        </div>
      )
    },
    {
      key: 'shipment_status',
      label: 'Status',
      render: (item) => (
        <select
          value={item.shipment_status}
          onChange={(e) => handleStatusChange(item.id, e.target.value)}
          className={`px-2 py-1 text-xs rounded-full border-0 cursor-pointer ${
            item.shipment_status === 'delivered' ? 'bg-green-100 text-green-700' :
            item.shipment_status === 'in_transit' ? 'bg-blue-100 text-blue-700' :
            item.shipment_status === 'cancelled' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'
          }`}
        >
          {SHIPMENT_STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )
    },
    {
      key: 'estimated_delivery',
      label: 'ETA',
      render: (item) => item.estimated_delivery ? new Date(item.estimated_delivery).toLocaleDateString() : '-'
    }
  ];

  const fields: FormField[] = [
    { name: 'order_id', label: 'Order ID', type: 'text', placeholder: 'e.g., ORD-12345' },
    { name: 'customer_name', label: 'Customer Name', type: 'text', required: true },
    { name: 'customer_email', label: 'Customer Email', type: 'email' },
    { name: 'customer_phone', label: 'Customer Phone', type: 'text' },
    { name: 'shipping_address', label: 'Shipping Address', type: 'textarea', rows: 2 },
    { name: 'product_details', label: 'Product Details', type: 'textarea', rows: 2 },
    { name: 'weight', label: 'Weight (kg)', type: 'number' },
    { name: 'dimensions', label: 'Dimensions', type: 'text', placeholder: 'e.g., 20x15x10 cm' },
    { name: 'logistic_partner', label: 'Logistic Partner', type: 'text', placeholder: 'e.g., DHL, FedEx' },
    { name: 'carrier', label: 'Carrier', type: 'text' },
    { name: 'origin_location', label: 'Origin', type: 'text' },
    { name: 'current_location', label: 'Current Location', type: 'text' },
    { name: 'destination_country', label: 'Destination Country', type: 'text' },
    { name: 'estimated_delivery', label: 'Estimated Delivery', type: 'date' },
    { name: 'shipment_status', label: 'Status', type: 'select', options: SHIPMENT_STATUS_OPTIONS }
  ];

  const initialValues = editingShipment ? {
    order_id: editingShipment.order_id || '',
    customer_name: editingShipment.customer_name,
    customer_email: editingShipment.customer_email || '',
    customer_phone: editingShipment.customer_phone || '',
    shipping_address: editingShipment.shipping_address || '',
    product_details: editingShipment.product_details || '',
    weight: editingShipment.weight || '',
    dimensions: editingShipment.dimensions || '',
    logistic_partner: editingShipment.logistic_partner || '',
    carrier: editingShipment.carrier || '',
    origin_location: editingShipment.origin_location || '',
    current_location: editingShipment.current_location || '',
    destination_country: editingShipment.destination_country || '',
    estimated_delivery: editingShipment.estimated_delivery || '',
    shipment_status: editingShipment.shipment_status
  } : {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shipments</h1>
          <p className="text-gray-500 dark:text-gray-400">Track and manage shipments</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600 transition-colors"
        >
          Add Shipment
        </button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search shipments..."
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
          {SHIPMENT_STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <DataTable
        data={shipments}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No shipments found"
        searchKeys={['tracking_number', 'customer_name', 'customer_email']}
        itemsPerPage={pageSize}
        onItemsPerPageChange={setPageSize}
      />

      <ModalForm
        isOpen={showModal}
        title={editingShipment ? 'Edit Shipment' : 'Add New Shipment'}
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
        submitText={editingShipment ? 'Update' : 'Create'}
        loading={submitting}
        size="lg"
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Delete Shipment"
        message={`Are you sure you want to delete this shipment "${deletingShipment?.tracking_number}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        itemName={deletingShipment?.tracking_number}
      />
    </div>
  );
};

export default AdminShipmentsPage;
