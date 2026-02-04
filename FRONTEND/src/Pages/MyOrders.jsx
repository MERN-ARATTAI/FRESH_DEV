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
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>

        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Order #{o._id?.substring(0, 8) || o._id}</div>
                <div className="font-medium text-gray-900">{o.items?.length || 0} items • ₹{o.totalAmount || o.total || 0}</div>
                <div className="text-xs text-gray-500">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  (o.orderStatus === 'delivered' && 'bg-green-100 text-green-800') ||
                  (o.orderStatus === 'cancelled' && 'bg-red-100 text-red-800') ||
                  (o.orderStatus === 'processing' && 'bg-blue-100 text-blue-800') ||
                  'bg-yellow-100 text-yellow-800'
                }`}>{o.orderStatus || o.status || 'pending'}</span>

                <button
                  onClick={() => navigateToDetails(o._id)}
                  className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                >
                  View
                </button>

                { (o.orderStatus === 'placed' || o.status === 'placed') && (
                  <button
                    onClick={() => handleCancel(o._id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
                  >
                    Cancel
                  </button>
                ) }
              </div>
            </div>
          ))}
        </div>

        {/* Details panel */}
        {selectedOrder && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">Order Details</h2>
                <p className="text-sm text-gray-500">Order #{selectedOrder._id?.substring(0,8)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-sm text-gray-500">Close</button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Customer</h3>
                <p className="text-sm text-gray-700">{selectedOrder.user?.name || selectedOrder.customer?.name || 'N/A'}</p>
                <p className="text-sm text-gray-700">{selectedOrder.shippingAddress?.address || selectedOrder.shippingAddress || ''}</p>
              </div>

              <div>
                <h3 className="font-semibold">Summary</h3>
                <p className="text-sm text-gray-700">Items: {selectedOrder.items?.length || 0}</p>
                <p className="text-sm text-gray-700">Total: ₹{selectedOrder.totalAmount || selectedOrder.total || 0}</p>
                <p className="text-sm text-gray-700">Status: {selectedOrder.orderStatus || selectedOrder.status || 'pending'}</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Items</h3>
              <div className="space-y-3">
                {selectedOrder.items?.map((it, idx) => {
                  const product = it.product || it;
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{product.name || product.title || 'Product'}</div>
                        <div className="text-sm text-gray-500">Qty: {it.quantity || 1}</div>
                      </div>
                      <div className="font-semibold">₹{it.price || product.price || 0}</div>
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
