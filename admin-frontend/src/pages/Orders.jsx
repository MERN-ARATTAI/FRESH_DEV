

import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  ShoppingBag,
  Package,
  TrendingUp,
  Clock,
  User,
  Calendar,
  MapPin,
  CreditCard,
  MoreVertical,
  Filter,
  Download
} from 'lucide-react';
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
    const configs = {
      placed: {
        class: 'bg-blue-100 text-blue-700 border border-blue-200',
        label: 'Placed'
      },
      pending: {
        class: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
        label: 'Pending'
      },
      processing: {
        class: 'bg-purple-100 text-purple-700 border border-purple-200',
        label: 'Processing'
      },
      shipped: {
        class: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
        label: 'Shipped'
      },
      delivered: {
        class: 'bg-green-100 text-green-700 border border-green-200',
        label: 'Delivered'
      },
      cancelled: {
        class: 'bg-red-100 text-red-700 border border-red-200',
        label: 'Cancelled'
      }
    };
    return configs[status] || configs.pending;
  };

  const columns = [
    {
      header: 'Order ID',
      accessor: '_id',
      render: (row) => (
        <span className="font-mono text-xs sm:text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
          #{typeof row._id === 'string' ? row._id.substring(0, 8) : row.id}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer',
      render: (row) => (
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md flex-shrink-0">
            {(typeof row.customer === 'string' ? row.customer : row.user?.name || row.customer?.name || row.user?.email || 'N')[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
              {typeof row.customer === 'string' ? row.customer : row.user?.name || row.customer?.name || row.user?.email || 'N/A'}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Items',
      accessor: 'items',
      render: (row) => (
        <span className="text-xs sm:text-sm text-gray-600 font-medium">
          {Array.isArray(row.items) ? row.items.length : 0} {Array.isArray(row.items) && row.items.length === 1 ? 'item' : 'items'}
        </span>
      ),
    },
    {
      header: 'Total Amount',
      accessor: 'total',
      render: (row) => (
        <span className="font-bold text-gray-900 text-xs sm:text-sm">
          ₹{row.totalAmount || row.total || 0}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const status = row.orderStatus || row.status || 'pending';
        const config = getStatusBadge(status);
        return (
          <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${config.class}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => viewOrderDetails(row)}
            className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-all duration-200 hover:shadow-sm"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-all duration-200"
            title="More"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Calculate stats from orders
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || order.total || 0), 0);
  const deliveredOrders = orders.filter(o => (o.orderStatus || o.status) === 'delivered').length;
  const pendingOrders = orders.filter(o => ['pending', 'placed', 'processing'].includes(o.orderStatus || o.status)).length;

  return (
    // <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
    //   {/* Header */}
    //   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    //     <div>
    //       <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
    //         <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
    //           <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
    //         </div>
    //         Orders
    //       </h1>
    //       <p className="text-sm sm:text-base text-gray-600 mt-2">
    //         Manage and track customer orders ({pagination.total} total)
    //       </p>
    //     </div>

    //     <button className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
    //       <Download className="w-5 h-5" />
    //       <span>Export Orders</span>
    //     </button>
    //   </div>

    //   {/* Stats Cards */}
    //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    //     <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
    //             Total Orders
    //           </p>
    //           <p className="text-2xl sm:text-3xl font-bold text-gray-900">{pagination.total}</p>
    //         </div>
    //         <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
    //           <ShoppingBag className="w-6 h-6 text-white" />
    //         </div>
    //       </div>
    //     </div>

    //     <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
    //             Total Revenue
    //           </p>
    //           <p className="text-2xl sm:text-3xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
    //         </div>
    //         <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
    //           <TrendingUp className="w-6 h-6 text-white" />
    //         </div>
    //       </div>
    //     </div>

    //     <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
    //             Delivered
    //           </p>
    //           <p className="text-2xl sm:text-3xl font-bold text-gray-900">{deliveredOrders}</p>
    //         </div>
    //         <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
    //           <Package className="w-6 h-6 text-white" />
    //         </div>
    //       </div>
    //     </div>

    //     <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
    //             Pending
    //           </p>
    //           <p className="text-2xl sm:text-3xl font-bold text-gray-900">{pendingOrders}</p>
    //         </div>
    //         <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md">
    //           <Clock className="w-6 h-6 text-white" />
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Filters */}
    //   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    //     <div className="p-4 sm:p-6">
    //       <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
    //         <div className="flex-1 relative">
    //           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    //           <input
    //             type="text"
    //             placeholder="Search by Order ID or customer name..."
    //             value={searchQuery}
    //             onChange={(e) => setSearchQuery(e.target.value)}
    //             className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
    //           />
    //         </div>
    //         <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 font-semibold">
    //           <Filter className="w-5 h-5" />
    //           <span>Filters</span>
    //         </button>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Orders Table */}
    //   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    //     <Table
    //       columns={columns}
    //       data={orders}
    //       loading={loading}
    //       pagination={pagination}
    //       onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
    //       emptyMessage="No orders found."
    //     />
    //   </div>

    //   {/* Order Details Modal */}
    //   <Modal
    //     isOpen={showDetailsModal}
    //     onClose={() => setShowDetailsModal(false)}
    //     title={
    //       <div className="flex items-center gap-3">
    //         <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
    //           <ShoppingBag className="w-5 h-5 text-white" />
    //         </div>
    //         <span>Order #{selectedOrder?._id?.substring(0, 8) || selectedOrder?.id}</span>
    //       </div>
    //     }
    //     size="lg"
    //   >
    //     {selectedOrder && (
    //       <div className="space-y-6">
    //         {/* Customer Info */}
    //         <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
    //           <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
    //             <User className="w-5 h-5 text-indigo-600" />
    //             Customer Information
    //           </h3>
    //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    //             <div className="bg-white p-3 rounded-lg border border-gray-200">
    //               <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Name</p>
    //               <p className="font-semibold text-gray-900">
    //                 {typeof selectedOrder.customer === 'string' ? selectedOrder.customer : selectedOrder.customer?.name || 'N/A'}
    //               </p>
    //             </div>
    //             <div className="bg-white p-3 rounded-lg border border-gray-200">
    //               <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Order Date</p>
    //               <p className="font-semibold text-gray-900 flex items-center gap-1.5">
    //                 <Calendar className="w-4 h-4 text-gray-400" />
    //                 {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}
    //               </p>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Order Status */}
    //         <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
    //           <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
    //             <Package className="w-5 h-5 text-indigo-600" />
    //             Order Status
    //           </h3>

    //           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
    //             <div>
    //               <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Current Status</p>
    //               {(() => {
    //                 const status = selectedOrder.orderStatus || selectedOrder.status || 'pending';
    //                 const config = getStatusBadge(status);
    //                 return (
    //                   <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold ${config.class}`}>
    //                     {config.label}
    //                   </span>
    //                 );
    //               })()}
    //             </div>

    //             {/* Admin status change */}
    //             <div className="flex-1 w-full sm:w-auto">
    //               <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Update Status</p>
    //               <select
    //                 value={selectedOrder.orderStatus || selectedOrder.status || 'placed'}
    //                 onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
    //                 className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 font-medium"
    //               >
    //                 <option value="placed">Placed</option>
    //                 <option value="processing">Processing</option>
    //                 <option value="shipped">Shipped</option>
    //                 <option value="delivered">Delivered</option>
    //                 <option value="cancelled">Cancelled</option>
    //               </select>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Order Items */}
    //         <div>
    //           <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
    //             <ShoppingBag className="w-5 h-5 text-indigo-600" />
    //             Order Items ({Array.isArray(selectedOrder.items) ? selectedOrder.items.length : 0})
    //           </h3>
    //           {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
    //             <div className="space-y-3">
    //               {selectedOrder.items.map((item, index) => {
    //                 // Safely extract product information
    //                 let productName = 'Product';
    //                 let productPrice = 0;

    //                 if (typeof item.product === 'object' && item.product !== null) {
    //                   productName = item.product.name || 'Product';
    //                   productPrice = item.product.price || 0;
    //                 } else if (typeof item.product === 'string') {
    //                   productName = item.product;
    //                 }

    //                 // Use item price first, then product price
    //                 const price = item.price || productPrice || 0;
    //                 const qty = item.quantity || 1;

    //                 return (
    //                   <div
    //                     key={index}
    //                     className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
    //                   >
    //                     <div className="flex items-center gap-3 sm:gap-4">
    //                       <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-sm">
    //                         <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
    //                       </div>
    //                       <div>
    //                         <p className="font-bold text-gray-900 text-sm sm:text-base">{productName}</p>
    //                         <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
    //                           Quantity: <span className="font-semibold">{qty}</span>
    //                         </p>
    //                       </div>
    //                     </div>
    //                     <p className="font-bold text-gray-900 text-sm sm:text-base">₹{price}</p>
    //                   </div>
    //                 );
    //               })}
    //             </div>
    //           ) : (
    //             <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
    //               <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
    //               <p className="text-sm text-gray-500">No items in this order</p>
    //             </div>
    //           )}
    //         </div>

    //         {/* Order Summary */}
    //         <div className="border-t-2 border-gray-200 pt-5">
    //           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border-2 border-indigo-200">
    //             <div className="flex items-center justify-between">
    //               <div>
    //                 <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Order Total</p>
    //                 <p className="text-3xl font-bold text-indigo-600">
    //                   ₹{selectedOrder.totalAmount || selectedOrder.total || 0}
    //                 </p>
    //               </div>
    //               <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
    //                 <CreditCard className="w-8 h-8 text-white" />
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     )}
    //   </Modal>
    // </div>
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 bg-[#F3F1EC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight flex items-center gap-3">
            <div className="p-2 bg-[#1D9C7A] rounded-xl shadow-lg">
              <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            Orders
          </h1>
          <p className="text-sm sm:text-base text-[#0F172A]/60 mt-2">
            Manage and track customer orders ({pagination.total} total)
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#1D9C7A] text-white rounded-xl hover:bg-[#1D9C7A]/90 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
          <Download className="w-5 h-5" />
          <span>Export Orders</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#BEDCD0]/30 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#0F172A]/60 uppercase tracking-wide mb-1">
                Total Orders
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-[#0F172A]">{pagination.total}</p>
            </div>
            <div className="p-3 bg-[#1D9C7A] rounded-xl shadow-md">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#BEDCD0]/30 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#0F172A]/60 uppercase tracking-wide mb-1">
                Total Revenue
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-[#0F172A]">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-[#1D9C7A] rounded-xl shadow-md">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#BEDCD0]/30 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#0F172A]/60 uppercase tracking-wide mb-1">
                Delivered
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-[#0F172A]">{deliveredOrders}</p>
            </div>
            <div className="p-3 bg-[#1D9C7A] rounded-xl shadow-md">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#BEDCD0]/30 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#0F172A]/60 uppercase tracking-wide mb-1">
                Pending
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-[#0F172A]">{pendingOrders}</p>
            </div>
            <div className="p-3 bg-[#1D9C7A] rounded-xl shadow-md">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#BEDCD0]/30 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0F172A]/40" />
              <input
                type="text"
                placeholder="Search by Order ID or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#F3F1EC] border-2 border-[#BEDCD0]/40 rounded-xl text-[#0F172A] placeholder-[#0F172A]/40 focus:outline-none focus:border-[#1D9C7A] focus:bg-white focus:ring-4 focus:ring-[#1D9C7A]/10 transition-all duration-200"
              />
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-[#F3F1EC] border-2 border-[#BEDCD0]/40 text-[#0F172A] rounded-xl hover:bg-[#BEDCD0]/20 hover:border-[#88C7B3]/50 transition-all duration-200 font-semibold">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#BEDCD0]/30 overflow-hidden">
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
        title={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1D9C7A] rounded-lg">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span>Order #{selectedOrder?._id?.substring(0, 8) || selectedOrder?.id}</span>
          </div>
        }
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="p-5 bg-[#F3F1EC]/50 rounded-xl border border-[#BEDCD0]/30">
              <h3 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#1D9C7A]" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-[#BEDCD0]/30">
                  <p className="text-xs font-semibold text-[#0F172A]/60 uppercase tracking-wide mb-1">Name</p>
                  <p className="font-semibold text-[#0F172A]">
                    {typeof selectedOrder.customer === 'string' ? selectedOrder.customer : selectedOrder.customer?.name || 'N/A'}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#BEDCD0]/30">
                  <p className="text-xs font-semibold text-[#0F172A]/60 uppercase tracking-wide mb-1">Order Date</p>
                  <p className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#0F172A]/40" />
                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="p-5 bg-[#BEDCD0]/10 rounded-xl border border-[#BEDCD0]/30">
              <h3 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#1D9C7A]" />
                Order Status
              </h3>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#0F172A]/60 uppercase tracking-wide mb-2">Current Status</p>
                  {(() => {
                    const status = selectedOrder.orderStatus || selectedOrder.status || 'pending';
                    const config = getStatusBadge(status);
                    return (
                      <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold ${config.class}`}>
                        {config.label}
                      </span>
                    );
                  })()}
                </div>

                {/* Admin status change */}
                <div className="flex-1 w-full sm:w-auto">
                  <p className="text-xs font-semibold text-[#0F172A]/60 uppercase tracking-wide mb-2">Update Status</p>
                  <select
                    value={selectedOrder.orderStatus || selectedOrder.status || 'placed'}
                    onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border-2 border-[#BEDCD0]/40 rounded-xl text-[#0F172A] focus:outline-none focus:border-[#1D9C7A] focus:ring-4 focus:ring-[#1D9C7A]/10 transition-all duration-200 font-medium"
                  >
                    <option value="placed">Placed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#1D9C7A]" />
                Order Items ({Array.isArray(selectedOrder.items) ? selectedOrder.items.length : 0})
              </h3>
              {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => {
                    // Safely extract product information
                    let productName = 'Product';
                    let productPrice = 0;

                    if (typeof item.product === 'object' && item.product !== null) {
                      productName = item.product.name || 'Product';
                      productPrice = item.product.price || 0;
                    } else if (typeof item.product === 'string') {
                      productName = item.product;
                    }

                    // Use item price first, then product price
                    const price = item.price || productPrice || 0;
                    const qty = item.quantity || 1;

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-[#F3F1EC]/50 rounded-xl border border-[#BEDCD0]/30 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[#BEDCD0]/30 flex items-center justify-center shadow-sm">
                            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-[#1D9C7A]" />
                          </div>
                          <div>
                            <p className="font-bold text-[#0F172A] text-sm sm:text-base">{productName}</p>
                            <p className="text-xs sm:text-sm text-[#0F172A]/60 mt-0.5">
                              Quantity: <span className="font-semibold">{qty}</span>
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-[#0F172A] text-sm sm:text-base">₹{price}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-[#F3F1EC]/50 rounded-xl border-2 border-dashed border-[#BEDCD0]/40">
                  <Package className="w-12 h-12 text-[#0F172A]/40 mx-auto mb-2" />
                  <p className="text-sm text-[#0F172A]/60">No items in this order</p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="border-t-2 border-[#BEDCD0]/30 pt-5">
              <div className="bg-[#1D9C7A]/10 p-5 rounded-xl border-2 border-[#1D9C7A]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]/60 uppercase tracking-wide mb-1">Order Total</p>
                    <p className="text-3xl font-bold text-[#1D9C7A]">
                      ₹{selectedOrder.totalAmount || selectedOrder.total || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-[#1D9C7A] rounded-xl shadow-lg">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
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