import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { orderAPI } from "../Api/orderApi";

const PlaceOrderPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { cartItems, selectedAddress, pricing } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState("creditCard");
    const [processingOrder, setProcessingOrder] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    // Redirect if no order data
    if (!cartItems || !selectedAddress || !pricing) {
        navigate("/checkout");
        return null;
    }

    const paymentMethods = [
        {
            id: "creditCard",
            name: "Credit Card",
            icon: "💳",
            description: "Visa, Mastercard"
        },
        {
            id: "debitCard",
            name: "Debit Card",
            icon: "💳",
            description: "All debit cards"
        },
        {
            id: "upi",
            name: "UPI",
            icon: "📱",
            description: "PhonePe, GPay, Paytm"
        },
        {
            id: "bankTransfer",
            name: "Bank Transfer",
            icon: "🏦",
            description: "Direct bank transfer"
        },
        {
            id: "paypal",
            name: "PayPal",
            icon: "💰",
            description: "Pay with PayPal"
        }
    ];

    const handlePlaceOrder = async () => {
        if (!termsAccepted) {
            toast.error("Please accept terms and conditions");
            return;
        }

        setProcessingOrder(true);

        try {
            // Prepare order data with items
            const orderData = {
                shippingAddress: {
                    address_line: selectedAddress.address_line,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    country: selectedAddress.country,
                    pincode: selectedAddress.pincode,
                    mobile: selectedAddress.mobile
                },
                paymentMethod,
                discountAmount: 0,
                taxAmount: pricing.tax,
                items: cartItems.map(item => ({
                    product: item._id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            // Call the actual API
            const response = await orderAPI.createOrder(orderData);

            if (response.success) {
                toast.success("Order placed successfully!");

                // Navigate to order confirmation page with actual order ID
                navigate("/order-success", {
                    state: {
                        orderId: response.data.orderId,
                        total: response.data.totalAmount
                    }
                });
            } else {
                toast.error(response.message || "Failed to place order");
            }

        } catch (error) {
            console.error("Order creation error:", error);
            toast.error(error.message || "Failed to place order");
        } finally {
            setProcessingOrder(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-green-600 hover:text-green-700 mb-4 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Review & Place Order</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Section - Order Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Delivery Address */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Delivering To
                            </h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                {selectedAddress.address_line && (
                                    <p className="text-gray-700">{selectedAddress.address_line}</p>
                                )}
                                <p className="font-semibold text-gray-900">
                                    {selectedAddress.city}, {selectedAddress.state}
                                </p>
                                {selectedAddress.country && (
                                    <p className="text-gray-600">{selectedAddress.country}</p>
                                )}
                                {selectedAddress.pincode && (
                                    <p className="text-gray-600">PIN: {selectedAddress.pincode}</p>
                                )}
                                <p className="text-gray-700 mt-2">📞 {selectedAddress.mobile}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Order Items ({cartItems.length})
                            </h2>

                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex gap-4 pb-4 border-b last:border-b-0"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                                                {item.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                Quantity: {item.quantity}
                                            </p>
                                            <p className="text-green-600 font-semibold mt-1">
                                                ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">
                                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                Payment Method
                            </h2>

                            <div className="space-y-3">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`border-2 rounded-lg p-4 cursor-pointer transition ${paymentMethod === method.id
                                            ? 'border-green-600 bg-green-50'
                                            : 'border-gray-200 hover:border-green-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                checked={paymentMethod === method.id}
                                                onChange={() => setPaymentMethod(method.id)}
                                                className="w-4 h-4 text-green-600"
                                            />
                                            <div className="text-2xl">{method.icon}</div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">{method.name}</p>
                                                <p className="text-sm text-gray-600">{method.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Section - Price Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                            <h2 className="text-xl font-semibold mb-6">Price Details</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>₹{pricing.subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Shipping Charges</span>
                                    <span className="text-green-600">₹{pricing.shippingCharge}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Tax (GST 18%)</span>
                                    <span>₹{pricing.tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                                    <span>Total Amount</span>
                                    <span className="text-green-600">₹{pricing.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="mb-4">
                                <label className="flex items-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="mt-1 w-4 h-4 text-green-600 rounded"
                                    />
                                    <span className="text-sm text-gray-600">
                                        I agree to the{" "}
                                        <a href="#" className="text-green-600 hover:underline">
                                            Terms & Conditions
                                        </a>{" "}
                                        and{" "}
                                        <a href="#" className="text-green-600 hover:underline">
                                            Privacy Policy
                                        </a>
                                    </span>
                                </label>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={processingOrder || !termsAccepted}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                            >
                                {processingOrder ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    "Place Order"
                                )}
                            </button>

                            <div className="mt-6 space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>100% Secure Payments</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Easy Returns & Refunds</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PlaceOrderPage;