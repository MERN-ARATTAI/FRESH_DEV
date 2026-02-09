

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
      <div className="min-h-screen flex items-center justify-center bg-[#F3F1EC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1D9C7A] mx-auto mb-4"></div>
          <p className="text-[#88C7B3] font-semibold">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F1EC]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border-2 border-[#E4E3E7]">
          <p className="text-[#0F172A] mb-4">{errorMsg ? errorMsg : 'Order not found or you are not authorized to view it.'}</p>
          {errorMsg && (
            <div className="mt-4">
              <button 
                onClick={() => navigate('/')} 
                className="px-6 py-3 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Go to Home / Login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F1EC] to-white py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 border-2 border-[#BEDCD0]/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A]">Order Details</h1>
                  <p className="text-sm text-[#88C7B3] font-semibold">#{order._id?.substring(0,8)}</p>
                </div>
              </div>
              <p className="text-sm text-[#88C7B3] mt-2">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-md ${
                (order.orderStatus === 'delivered' && 'bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white') ||
                (order.orderStatus === 'cancelled' && 'bg-gradient-to-r from-red-500 to-red-600 text-white') ||
                (order.orderStatus === 'processing' && 'bg-gradient-to-r from-[#88C7B3] to-[#BEDCD0] text-white') ||
                'bg-gradient-to-r from-[#E4E3E7] to-[#D5D5E1] text-[#0F172A]'
              }`}>
                {order.orderStatus || order.status || 'pending'}
              </span>

              <button 
                onClick={() => navigate(-1)} 
                className="px-5 py-2.5 bg-white border-2 border-[#E4E3E7] text-[#0F172A] rounded-xl font-semibold hover:border-[#1D9C7A] hover:bg-[#F3F1EC] transition-all duration-300"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Customer Info */}
          {/* <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#BEDCD0]/30">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-[#E4E3E7]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="font-bold text-xl text-[#0F172A]">Customer</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#0F172A]">
                {order.user?.name || order.customer?.name || 'N/A'}
              </p>
              <p className="text-sm text-[#0F172A] opacity-70">
                {order.shippingAddress?.address || order.shippingAddress || 'Address not provided'}
              </p>
            </div>
          </div> */}
          {/* Customer Info */}
<div className="bg-white rounded-2xl shadow-lg p-6 border border-[#BEDCD0]/30">
  <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-[#E4E3E7]">
    <div className="w-10 h-10 bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] rounded-xl flex items-center justify-center shadow-md">
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
      </svg>
    </div>
    <h3 className="font-bold text-xl text-[#0F172A]">Customer</h3>
  </div>
  <div className="space-y-2">
    <p className="text-sm font-semibold text-[#0F172A]">
      {order.user?.name || order.customer?.name || 'N/A'}
    </p>
    <div className="text-sm text-[#0F172A] opacity-70">
      {order.shippingAddress?.address_line && (
        <p>{order.shippingAddress.address_line}</p>
      )}
      {(order.shippingAddress?.city || order.shippingAddress?.state) && (
        <p>
          {order.shippingAddress.city}
          {order.shippingAddress.city && order.shippingAddress.state && ', '}
          {order.shippingAddress.state}
        </p>
      )}
      {order.shippingAddress?.country && (
        <p>{order.shippingAddress.country}</p>
      )}
      {order.shippingAddress?.pincode && (
        <p>PIN: {order.shippingAddress.pincode}</p>
      )}
      {order.shippingAddress?.mobile && (
        <p>Mobile: {order.shippingAddress.mobile}</p>
      )}
      {!order.shippingAddress && <p>Address not provided</p>}
    </div>
  </div>
</div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-[#1D9C7A]/10 to-[#88C7B3]/10 rounded-2xl shadow-lg p-6 border-2 border-[#1D9C7A]/30">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-[#1D9C7A]/20">
              <div className="w-10 h-10 bg-gradient-to-br from-[#88C7B3] to-[#BEDCD0] rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="font-bold text-xl text-[#0F172A]">Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#0F172A]">Items:</span>
                <span className="text-sm font-bold text-[#1D9C7A]">{order.items?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#0F172A]">Payment:</span>
                <span className="text-sm font-bold text-[#1D9C7A]">{order.paymentStatus || 'unknown'}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] rounded-xl shadow-lg">
                <span className="text-sm font-bold text-white">Total:</span>
                <span className="text-2xl font-bold text-white">₹{order.totalAmount || order.total || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-[#BEDCD0]/50">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#E4E3E7]">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
              </svg>
            </div>
            <h3 className="font-bold text-xl text-[#0F172A]">Order Items</h3>
          </div>
          
          <div className="space-y-4">
            {order.items?.map((it, idx) => {
              const product = it.product || it;
              const discount = product.discount || 0;
              const originalPrice = it.originalPrice || product.originalPrice || (discount > 0 ? it.price / (1 - discount/100) : it.price);
              
              return (
                <div 
                  key={idx} 
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-gradient-to-r from-[#F3F1EC] to-white rounded-2xl border-2 border-[#E4E3E7] hover:border-[#1D9C7A] hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#BEDCD0]/30 to-[#88C7B3]/30 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#1D9C7A]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      {discount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg">
                          {discount}% OFF
                        </span>
                      )}
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
                  
                  <div className="text-right sm:text-left">
                    {discount > 0 && (
                      <p className="text-sm text-gray-400 line-through mb-1">
                        ₹{Math.round(originalPrice).toLocaleString('en-IN')}
                      </p>
                    )}
                    <div className="font-bold text-xl text-[#1D9C7A]">
                      ₹{(it.price || product.price || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-[#BEDCD0]/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-[#88C7B3] font-semibold">
              Order ID: {order._id}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {(order.orderStatus === 'placed' || order.status === 'placed') && (
                <button 
                  onClick={handleCancel} 
                  className="px-6 py-3 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-600 rounded-xl hover:from-red-100 hover:to-red-200 font-semibold transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  Cancel Order
                </button>
              )}
              <button 
                onClick={() => navigate('/orders')} 
                className="px-6 py-3 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
