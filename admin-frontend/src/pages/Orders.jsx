import React, { useState, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, [pagination.currentPage, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const limit = 20;
      const res = await orderAPI.getAll({ page: pagination.currentPage, limit });
      const payload = res.data;

      // Server returns full order objects populated with user and items
      let list = payload.data || [];

      // Simple client-side search by Order ID or customer name/email
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        list = list.filter((o) => {
          const idMatch = o._id?.toLowerCase().includes(q);
          const name = o.user?.name || o.user?.email || '';
          const nameMatch = name.toLowerCase().includes(q);
          return idMatch || nameMatch;
        });
        // When search applied, show filtered results (pagination info will still reflect server response)
      }

      setOrders(list);

      setPagination({
        currentPage: payload.pagination?.currentPage || 1,
        totalPages: payload.pagination?.totalPages || 1,
        total: payload.pagination?.totalOrders || list.length,
      });
    } catch (error) {
      console.error('❌ Failed to load orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, { orderStatus: newStatus });
      toast.success('Order status updated');
      // Refresh list and selected order details
      await fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      processing: 'badge-primary',
      shipped: 'badge-primary',
      delivered: 'badge-success',
      cancelled: 'badge-danger',
    };
    return badges[status] || 'badge-gray';
  };

  const columns = [
    {
      header: 'Order ID',
      accessor: '_id',
      render: (row) => (
        <span className="font-mono text-sm font-semibold text-primary-600">
          {typeof row._id === 'string' ? row._id.substring(0, 8) : row.id}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{typeof row.customer === 'string' ? row.customer : row.user?.name || row.customer?.name || row.user?.email || 'N/A'}</p>
        </div>
      ),
    },
    {
      header: 'Items',
      accessor: 'items',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {Array.isArray(row.items) ? row.items.length : 0} {Array.isArray(row.items) && row.items.length === 1 ? 'item' : 'items'}
        </span>
      ),
    },
    {
      header: 'Total Amount',
      accessor: 'total',
      render: (row) => (
        <span className="font-semibold text-gray-900">₹{row.totalAmount || row.total || 0}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`badge ${getStatusBadge(row.orderStatus || row.status || 'pending')}`}>
          {row.orderStatus || row.status || 'pending'}
        </span>
      ),
    },
    {
      header: 'Items',
      accessor: 'items',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {Array.isArray(row.items) ? row.items.length : 0} {Array.isArray(row.items) && row.items.length === 1 ? 'item' : 'items'}
        </span>
      ),
    },
    {
      header: 'Total Amount',
      accessor: 'total',
      render: (row) => (
        <span className="font-semibold text-gray-900">₹{row.total || 0}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`badge ${getStatusBadge(row.status || 'pending')}`}>
          {row.status || 'pending'}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => viewOrderDetails(row)}
          className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <Table
          columns={columns}
          data={orders}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
          emptyMessage="No orders found."
        />
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Order #${selectedOrder?._id?.substring(0, 8) || selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">
                    {typeof selectedOrder.customer === 'string' ? selectedOrder.customer : selectedOrder.customer?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Order Date</p>
                  <p className="font-medium text-gray-900">
                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Order Status</h3>

              <div className="flex items-center gap-4">
                <span className={`badge ${getStatusBadge(selectedOrder.orderStatus || selectedOrder.status || 'pending')}`}>
                  {selectedOrder.orderStatus || selectedOrder.status || 'pending'}
                </span>

                {/* Admin status change */}
                <select
                  value={selectedOrder.orderStatus || selectedOrder.status || 'placed'}
                  onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                  className="input w-48"
                >
                  <option value="placed">placed</option>
                  <option value="processing">processing</option>
                  <option value="shipped">shipped</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
              {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => {
                    const prod = item.product || item.product?.name ? item.product : item;
                    const name = prod?.name || prod || 'Product';
                    const qty = item.quantity || 1;
                    const price = item.price || prod?.price || 0;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded bg-gray-200"></div>
                          <div>
                            <p className="font-medium text-gray-900">{name}</p>
                            <p className="text-sm text-gray-600">Qty: {qty}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900">₹{price}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No items in this order</p>
              )}
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">₹{selectedOrder.totalAmount || selectedOrder.total || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
