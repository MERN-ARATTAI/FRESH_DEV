import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import orderAPI from '../Api/orderApi';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setPageLoading(true);
        const res = await orderAPI.getUserOrders({ page: 1, limit: 20 });
        console.debug('getUserOrders response:', res);
        let payload = [];
        if (res && res.success === true) {
          payload = res.data || [];
        } else if (Array.isArray(res)) {
          payload = res;
        } else if (res && res.message) {
          toast.error(res.message);
        }
        setOrders(payload);
      } catch (err) {
        console.error('Failed to load orders', err);
        const msg = err?.message || err?.error || err?.data?.message || err?.response?.data?.message || 'Failed to load orders';
        toast.error(msg);
        if (String(msg).toLowerCase().includes('unauthoriz') || String(msg).toLowerCase().includes('not authorized')) {
          setTimeout(() => navigate('/'), 900);
        }
        setOrders([]);
      } finally {
        setPageLoading(false);
        setLoading(false);
      }
    };

    load();
  }, []);

  const viewDetails = async (orderId) => {
    // kept for backward compat; navigating to detail page is preferred
    try {
      setDetailsLoading(true);
      const res = await orderAPI.getOrderById(orderId);
      console.debug('getOrderById response:', res);
      const order = res.data || res || null;
      setSelectedOrder(order);
    } catch (err) {
      console.error('Failed to get order details', err);
      const msg = err?.message || err?.error || err?.data?.message || err?.response?.data?.message || 'Failed to load details';
      toast.error(msg);
      if (String(msg).toLowerCase().includes('unauthoriz')) {
        setTimeout(() => navigate('/'), 900);
      }
    } finally {
      setDetailsLoading(false);
    }
  };

  // Navigate to dedicated details page
  const navigateToDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleCancel = async (orderId) => {
    try {
      await orderAPI.cancelOrder(orderId);
      toast.success('Order cancelled');
      // Refresh list
      const res = await orderAPI.getUserOrders({ page: 1, limit: 20 });
      let payload = [];
      if (res && res.success === true) payload = res.data || [];
      else if (Array.isArray(res)) payload = res;
      setOrders(payload);
      setSelectedOrder(null);
    } catch (err) {
      console.error('Failed to cancel', err);
      const msg = err?.message || err?.error || err?.data?.message || err?.response?.data?.message || 'Failed to cancel order';
      toast.error(msg);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    // <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
    //   <div className="max-w-5xl mx-auto">
    //     <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>

    //     <div className="space-y-4">
    //       {orders.map((o) => (
    //         <div key={o._id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
    //           <div>
    //             <div className="text-sm text-gray-500">Order #{o._id?.substring(0, 8) || o._id}</div>
    //             <div className="font-medium text-gray-900">{o.items?.length || 0} items • ₹{o.totalAmount || o.total || 0}</div>
    //             <div className="text-xs text-gray-500">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</div>
    //           </div>

    //           <div className="flex items-center gap-2">
    //             <span className={`px-3 py-1 rounded-full text-sm ${
    //               (o.orderStatus === 'delivered' && 'bg-green-100 text-green-800') ||
    //               (o.orderStatus === 'cancelled' && 'bg-red-100 text-red-800') ||
    //               (o.orderStatus === 'processing' && 'bg-blue-100 text-blue-800') ||
    //               'bg-yellow-100 text-yellow-800'
    //             }`}>{o.orderStatus || o.status || 'pending'}</span>

    //             <button
    //               onClick={() => navigateToDetails(o._id)}
    //               className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
    //             >
    //               View
    //             </button>

    //             { (o.orderStatus === 'placed' || o.status === 'placed') && (
    //               <button
    //                 onClick={() => handleCancel(o._id)}
    //                 className="px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
    //               >
    //                 Cancel
    //               </button>
    //             ) }
    //           </div>
    //         </div>
    //       ))}
    //     </div>

    //     {/* Details panel */}
    //     {selectedOrder && (
    //       <div className="mt-6 bg-white rounded-lg shadow p-6">
    //         <div className="flex justify-between items-start">
    //           <div>
    //             <h2 className="text-xl font-semibold">Order Details</h2>
    //             <p className="text-sm text-gray-500">Order #{selectedOrder._id?.substring(0,8)}</p>
    //           </div>
    //           <button onClick={() => setSelectedOrder(null)} className="text-sm text-gray-500">Close</button>
    //         </div>

    //         <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    //           <div>
    //             <h3 className="font-semibold">Customer</h3>
    //             <p className="text-sm text-gray-700">{selectedOrder.user?.name || selectedOrder.customer?.name || 'N/A'}</p>
    //             <p className="text-sm text-gray-700">{selectedOrder.shippingAddress?.address || selectedOrder.shippingAddress || ''}</p>
    //           </div>

    //           <div>
    //             <h3 className="font-semibold">Summary</h3>
    //             <p className="text-sm text-gray-700">Items: {selectedOrder.items?.length || 0}</p>
    //             <p className="text-sm text-gray-700">Total: ₹{selectedOrder.totalAmount || selectedOrder.total || 0}</p>
    //             <p className="text-sm text-gray-700">Status: {selectedOrder.orderStatus || selectedOrder.status || 'pending'}</p>
    //           </div>
    //         </div>

    //         <div className="mt-4">
    //           <h3 className="font-semibold mb-2">Items</h3>
    //           <div className="space-y-3">
    //             {selectedOrder.items?.map((it, idx) => {
    //               const product = it.product || it;
    //               return (
    //                 <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
    //                   <div>
    //                     <div className="font-medium">{product.name || product.title || 'Product'}</div>
    //                     <div className="text-sm text-gray-500">Qty: {it.quantity || 1}</div>
    //                   </div>
    //                   <div className="font-semibold">₹{it.price || product.price || 0}</div>
    //                 </div>
    //               );
    //             })}
    //           </div>
    //         </div>

    //       </div>
    //     )}
    //   </div>
    // </div>

    <div className="min-h-screen bg-gradient-to-br from-[#F3F1EC] via-white to-[#E4E3E7] py-12 px-4 md:px-8">
  <div className="max-w-6xl mx-auto">
    {/* Header */}
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-2">My Orders</h1>
      <div className="w-24 h-1.5 bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] rounded-full"></div>
      <p className="mt-3 text-[#88C7B3] font-medium">Track and manage your purchases</p>
    </div>

    {/* Orders List */}
    <div className="space-y-5">
      {orders.map((o) => (
        <div 
          key={o._id} 
          className="bg-white rounded-2xl shadow-lg border-2 border-[#E4E3E7] p-6 hover:shadow-2xl hover:border-[#1D9C7A] transition-all duration-300 transform hover:scale-[1.02]"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left: Order Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#88C7B3]">
                    Order #{o._id?.substring(0, 8) || o._id}
                  </div>
                  <div className="text-xs text-[#88C7B3]">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Date N/A'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-gradient-to-r from-[#F3F1EC] to-[#E4E3E7] p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#1D9C7A]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                  </svg>
                  <span className="font-bold text-[#0F172A]">{o.items?.length || 0} items</span>
                </div>
                <div className="w-px h-6 bg-[#D5D5E1]"></div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#1D9C7A]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-bold text-xl text-[#0F172A]">₹{o.totalAmount || o.total || 0}</span>
                </div>
              </div>
            </div>

            {/* Right: Status & Actions */}
            <div className="flex flex-col gap-3 md:items-end">
              {/* Status Badge */}
              <span className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-md inline-flex items-center gap-2 ${
                (o.orderStatus === 'delivered' && 'bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white') ||
                (o.orderStatus === 'cancelled' && 'bg-gradient-to-r from-red-500 to-red-600 text-white') ||
                (o.orderStatus === 'processing' && 'bg-gradient-to-r from-[#88C7B3] to-[#BEDCD0] text-white') ||
                'bg-gradient-to-r from-[#E4E3E7] to-[#D5D5E1] text-[#0F172A]'
              }`}>
                {(o.orderStatus === 'delivered' || o.status === 'delivered') && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                )}
                {o.orderStatus || o.status || 'pending'}
              </span>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigateToDetails(o._id)}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white rounded-xl hover:from-[#88C7B3] hover:to-[#1D9C7A] font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  View Details
                </button>

                {(o.orderStatus === 'placed' || o.status === 'placed') && (
                  <button
                    onClick={() => handleCancel(o._id)}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-600 rounded-xl hover:from-red-100 hover:to-red-200 font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Details Panel */}
    {selectedOrder && (
      <div className="mt-8 bg-white rounded-3xl shadow-2xl border-2 border-[#1D9C7A] p-8 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 pb-6 border-b-2 border-[#E4E3E7]">
          <div>
            <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Order Details</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#88C7B3]">
                Order ID: #{selectedOrder._id?.substring(0, 8)}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setSelectedOrder(null)} 
            className="p-3 hover:bg-[#F3F1EC] rounded-xl transition-all duration-300 group"
          >
            <svg className="w-6 h-6 text-[#88C7B3] group-hover:text-[#1D9C7A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Customer Info */}
          <div className="bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] p-6 rounded-2xl border border-[#E4E3E7]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="font-bold text-xl text-[#0F172A]">Customer Information</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[#1D9C7A] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
                <p className="text-sm font-semibold text-[#0F172A]">
                  {selectedOrder.user?.name || selectedOrder.customer?.name || 'N/A'}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[#1D9C7A] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <p className="text-sm text-[#0F172A]">
                  {selectedOrder.shippingAddress?.address || selectedOrder.shippingAddress || 'Address not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-[#1D9C7A]/10 to-[#88C7B3]/10 p-6 rounded-2xl border-2 border-[#1D9C7A]/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#88C7B3] to-[#BEDCD0] rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="font-bold text-xl text-[#0F172A]">Order Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                <span className="text-sm font-semibold text-[#0F172A]">Total Items:</span>
                <span className="text-sm font-bold text-[#1D9C7A]">{selectedOrder.items?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                <span className="text-sm font-semibold text-[#0F172A]">Order Status:</span>
                <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
                  (selectedOrder.orderStatus === 'delivered' && 'bg-[#1D9C7A] text-white') ||
                  (selectedOrder.orderStatus === 'cancelled' && 'bg-red-500 text-white') ||
                  (selectedOrder.orderStatus === 'processing' && 'bg-[#88C7B3] text-white') ||
                  'bg-[#D5D5E1] text-[#0F172A]'
                }`}>
                  {selectedOrder.orderStatus || selectedOrder.status || 'pending'}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] rounded-xl shadow-lg">
                <span className="text-sm font-bold text-white">Total Amount:</span>
                <span className="text-2xl font-bold text-white">₹{selectedOrder.totalAmount || selectedOrder.total || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-gradient-to-br from-[#F3F1EC] to-white p-6 rounded-2xl border-2 border-[#E4E3E7]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#E4E3E7]">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
              </svg>
            </div>
            <h3 className="font-bold text-xl text-[#0F172A]">Ordered Items</h3>
          </div>
          
          <div className="space-y-4">
            {selectedOrder.items?.map((it, idx) => {
              const product = it.product || it;
              return (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-[#E4E3E7] hover:border-[#1D9C7A] hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] rounded-xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#88C7B3]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-[#0F172A] mb-1">
                        {product.name || product.title || 'Product'}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#88C7B3] bg-[#F3F1EC] px-3 py-1 rounded-full">
                          Qty: {it.quantity || 1}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-xl text-[#1D9C7A]">
                    ₹{it.price || product.price || 0}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )}
  </div>
    </div>
  );
};

export default MyOrders;
