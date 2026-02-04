import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { orderId, total } = location.state || {};

    // Redirect if no order data
    if (!orderId) {
        navigate("/");
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">

                {/* Success Animation */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
                    <p className="text-gray-600">Thank you for your purchase</p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="border-b pb-4 mb-4">
                        <p className="text-sm text-gray-600 mb-1">Order ID</p>
                        <p className="text-lg font-bold text-gray-900">{orderId}</p>
                    </div>

                    <div className="border-b pb-4 mb-4">
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-green-600">₹{total?.toFixed(2)}</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Order Confirmation</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    A confirmation email has been sent to your registered email address with order details.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estimated Delivery */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                        <h3 className="font-semibold text-gray-900">Estimated Delivery</h3>
                    </div>
                    <p className="text-gray-700 ml-9">
                        Expected delivery by{" "}
                        <span className="font-semibold text-green-600">
                            {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate("/orders")}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                        View Order Details
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-white text-gray-700 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 transition"
                    >
                        Continue Shopping
                    </button>
                </div>

                {/* Help Section */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600 mb-2">Need help with your order?</p>
                    <button className="text-green-600 hover:text-green-700 font-semibold text-sm">
                        Contact Support
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OrderSuccessPage;