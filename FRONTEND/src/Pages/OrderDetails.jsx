import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderAPI from '../Api/orderApi';
import toast from 'react-hot-toast';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await orderAPI.getOrderById(id);
        console.debug('getOrderById response:', res);
        const o = res.data || res || null;
        setOrder(o);
      } catch (err) {
        console.error('Failed to load order details', err);
        const msg = err?.message || err?.error || err?.data?.message || err?.response?.data?.message || (typeof err === 'string' ? err : 'Failed to load order');
        setErrorMsg(msg);
        toast.error(msg);
        if (String(msg).toLowerCase().includes('unauthoriz') || String(msg).toLowerCase().includes('not authorized')) {
          setTimeout(() => navigate('/'), 1200);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleCancel = async () => {
    try {
      await orderAPI.cancelOrder(id);
      toast.success('Order cancelled');
      navigate('/orders');
    } catch (err) {
      console.error('Cancel failed', err);
      toast.error(err?.message || 'Cancel failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{errorMsg ? errorMsg : 'Order not found or you are not authorized to view it.'}</p>
          {errorMsg && (
            <div className="mt-4">
              <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 text-white rounded">Go to Home / Login</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Order #{order._id?.substring(0,8)}</h1>
            <p className="text-sm text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm ${
              (order.orderStatus === 'delivered' && 'bg-green-100 text-green-800') ||
              (order.orderStatus === 'cancelled' && 'bg-red-100 text-red-800') ||
              (order.orderStatus === 'processing' && 'bg-blue-100 text-blue-800') ||
              'bg-yellow-100 text-yellow-800'
            }`}>{order.orderStatus || order.status || 'pending'}</span>

            <button onClick={() => navigate(-1)} className="px-3 py-1 bg-gray-100 rounded">Back</button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Customer</h3>
            <p className="text-sm text-gray-700">{order.user?.name || order.customer?.name || 'N/A'}</p>
            <p className="text-sm text-gray-700">{order.shippingAddress?.address || order.shippingAddress || ''}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-sm text-gray-700">Items: {order.items?.length || 0}</p>
            <p className="text-sm text-gray-700">Total: ₹{order.totalAmount || order.total || 0}</p>
            <p className="text-sm text-gray-700">Payment: {order.paymentStatus || 'unknown'}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Items</h3>
          <div className="space-y-3">
            {order.items?.map((it, idx) => {
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

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">Order ID: {order._id}</div>
          <div className="flex items-center gap-2">
            { (order.orderStatus === 'placed' || order.status === 'placed') && (
              <button onClick={handleCancel} className="px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100">Cancel Order</button>
            ) }
            <button onClick={() => navigate('/orders')} className="px-4 py-2 bg-gray-100 rounded">Back to orders</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
