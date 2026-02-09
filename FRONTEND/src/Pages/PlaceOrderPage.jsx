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
            // Prepare order data with items including discount
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
                items: cartItems.map(item => {
                    const discountedPrice = item.price - (item.price * (item.discount || 0) / 100);
                    return {
                        product: item._id,
                        quantity: item.quantity,
                        price: discountedPrice
                    };
                })
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
       
        <div className="min-h-screen bg-[#F3F1EC] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-[#1D9C7A] hover:text-[#88C7B3] mb-4 flex items-center gap-2 font-medium transition-all duration-300 hover:gap-3"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                    <h1 className="text-2xl md:text-2xl font-bold text-[#0F172A] tracking-tight">Review & Place Order</h1>
                    <p className="text-[#0F172A] opacity-60 mt-2 text-md">Double-check everything before confirming</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Section - Order Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Delivery Address */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#BEDCD0]/30 hover:shadow-xl transition-all duration-300 animate-slide-up">
                            <h2 className="text-xl font-bold mb-5 flex items-center gap-3 text-[#0F172A]">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                Delivering To
                            </h2>
                            <div className="bg-gradient-to-br from-[#F3F1EC] to-[#BEDCD0]/20 p-5 rounded-xl border-2 border-[#BEDCD0]/50 hover:border-[#88C7B3] transition-colors duration-300">
                                {selectedAddress.address_line && (
                                    <p className="text-[#0F172A] opacity-80 leading-relaxed mb-2">{selectedAddress.address_line}</p>
                                )}
                                <p className="font-bold text-[#0F172A] text-lg">
                                    {selectedAddress.city}, {selectedAddress.state}
                                </p>
                                {selectedAddress.country && (
                                    <p className="text-[#0F172A] opacity-70 mt-1">{selectedAddress.country}</p>
                                )}
                                {selectedAddress.pincode && (
                                    <span className="inline-block bg-[#1D9C7A]/10 text-[#1D9C7A] px-3 py-1 rounded-full text-sm font-semibold mt-3">
                                        PIN: {selectedAddress.pincode}
                                    </span>
                                )}
                                <p className="text-[#0F172A] mt-3 flex items-center gap-2 font-medium">
                                    <svg className="w-4 h-4 text-[#1D9C7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {selectedAddress.mobile}
                                </p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#BEDCD0]/30 hover:shadow-xl transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-xl font-bold text-[#0F172A]">
                                    Order Items
                                </h2>
                                <span className="bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                                    {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {cartItems.map((item, index) => {
                                    const discountedPrice = item.price - (item.price * (item.discount || 0) / 100);
                                    const totalItemPrice = discountedPrice * item.quantity;
                                    
                                    return (
                                        <div
                                            key={item._id}
                                            className="flex gap-4 pb-4 border-b border-[#E4E3E7] last:border-b-0 hover:bg-[#F3F1EC]/50 -mx-2 px-2 py-2 rounded-xl transition-all duration-300 hover:scale-[1.01]"
                                            style={{ animation: `slideIn 0.4s ease-out ${index * 0.1}s both` }}
                                        >
                                            <div className="relative">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border-2 border-[#E4E3E7] hover:border-[#88C7B3] transition-colors duration-300"
                                                />
                                                <span className="absolute -top-2 -right-2 bg-[#1D9C7A] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                                                    {item.quantity}
                                                </span>
                                                {item.discount > 0 && (
                                                    <span className="absolute -top-2 -left-4 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white px-2 py-0.5 rounded-full md:text-[10px] text-[10px] font-bold shadow-lg">
                                                        {item.discount}% OFF
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-[#0F172A] text-sm sm:text-base line-clamp-2 leading-tight">
                                                    {item.name}
                                                </h3>
                                                <p className="text-[#88C7B3] text-sm mt-2 font-medium">
                                                    Quantity: {item.quantity}
                                                </p>
                                                
                                                {/* Price Display with Discount */}
                                                <div className="flex items-center gap-2 mt-1">
                                                    {item.discount > 0 ? (
                                                        <>
                                                            <p className="text-gray-400 line-through text-xs">
                                                                ₹{item.price.toLocaleString('en-IN')}
                                                            </p>
                                                            <p className="text-[#1D9C7A] font-bold text-sm">
                                                                ₹{Math.round(discountedPrice).toLocaleString('en-IN')} × {item.quantity}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <p className="text-[#1D9C7A] font-bold text-sm">
                                                            ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {/* <div className="text-right flex flex-col justify-center">
                                                {item.discount > 0 && (
                                                    <p className="text-gray-400 line-through text-sm mb-1">
                                                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                    </p>
                                                )}
                                                <p className="font-bold text-[#0F172A] text-lg">
                                                    ₹{Math.round(totalItemPrice).toLocaleString('en-IN')}
                                                </p>
                                            </div> */}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#BEDCD0]/30 hover:shadow-xl transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-xl font-bold mb-5 flex items-center gap-3 text-[#0F172A]">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                Payment Method
                            </h2>

                            <div className="space-y-3">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${paymentMethod === method.id
                                            ? 'border-[#1D9C7A] bg-[#BEDCD0]/20 shadow-lg'
                                            : 'border-[#E4E3E7] hover:border-[#88C7B3] hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${paymentMethod === method.id
                                                ? 'border-[#1D9C7A] bg-[#1D9C7A]'
                                                : 'border-[#D5D5E1]'
                                                }`}>
                                                {paymentMethod === method.id && (
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="text-2xl transform transition-transform duration-300 hover:scale-110">{method.icon}</div>
                                            <div className="flex-1">
                                                <p className="font-bold text-[#0F172A]">{method.name}</p>
                                                <p className="text-sm text-[#0F172A] opacity-60">{method.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Section - Price Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8 border-2 border-[#BEDCD0]/50 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <h2 className="text-2xl font-bold mb-6 text-[#0F172A]">Price Details</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-[#0F172A] opacity-80 hover:opacity-100 transition-opacity duration-300">
                                    <span className="font-medium">Subtotal ({cartItems.length} items)</span>
                                    <span className="font-semibold">₹{pricing.subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-[#0F172A] opacity-80 hover:opacity-100 transition-opacity duration-300">
                                    <span className="font-medium">Shipping Charges</span>
                                    <span className="font-semibold text-[#1D9C7A]">₹{pricing.shippingCharge}</span>
                                </div>
                                <div className="flex justify-between text-[#0F172A] opacity-80 hover:opacity-100 transition-opacity duration-300">
                                    <span className="font-medium">Tax (GST 18%)</span>
                                    <span className="font-semibold">₹{pricing.tax.toFixed(2)}</span>
                                </div>

                                <div className="h-px bg-gradient-to-r from-transparent via-[#BEDCD0] to-transparent my-4"></div>

                                <div className="flex justify-between text-xl font-bold bg-gradient-to-br from-[#BEDCD0]/30 to-[#F3F1EC]/50 -mx-2 px-4 py-4 rounded-xl animate-pulse-slow">
                                    <span className="text-[#0F172A]">Total Amount</span>
                                    <span className="text-[#1D9C7A]">₹{pricing.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="mb-6 bg-[#F3F1EC]/50 p-4 rounded-xl border border-[#BEDCD0]/30">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative mt-0.5">
                                        <input
                                            type="checkbox"
                                            checked={termsAccepted}
                                            onChange={(e) => setTermsAccepted(e.target.checked)}
                                            className="w-5 h-5 text-[#1D9C7A] rounded border-[#D5D5E1] focus:ring-[#1D9C7A] transition-all duration-300"
                                        />
                                    </div>
                                    <span className="text-sm text-[#0F172A] opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                                        I agree to the{" "}
                                        <a href="#" className="text-[#1D9C7A] hover:text-[#88C7B3] font-semibold hover:underline transition-colors duration-300">
                                            Terms & Conditions
                                        </a>{" "}
                                        and{" "}
                                        <a href="#" className="text-[#1D9C7A] hover:text-[#88C7B3] font-semibold hover:underline transition-colors duration-300">
                                            Privacy Policy
                                        </a>
                                    </span>
                                </label>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={processingOrder || !termsAccepted}
                                className="w-full bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl disabled:from-[#D5D5E1] disabled:to-[#E4E3E7] disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] disabled:scale-100 relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {processingOrder ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Place Order
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#88C7B3] to-[#BEDCD0] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>

                            <div className="mt-6 pt-6 border-t border-[#E4E3E7] space-y-3">
                                <div className="flex items-center gap-3 text-sm text-[#0F172A] opacity-70 hover:opacity-100 transition-all duration-300 hover:translate-x-1">
                                    <div className="w-8 h-8 bg-[#BEDCD0]/30 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-[#1D9C7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">100% Secure Payments</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[#0F172A] opacity-70 hover:opacity-100 transition-all duration-300 hover:translate-x-1">
                                    <div className="w-8 h-8 bg-[#BEDCD0]/30 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-[#1D9C7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">Easy Returns & Refunds</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slide-up {
                    animation: slideUp 0.6s ease-out;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-pulse-slow {
                    animation: pulseSlow 3s ease-in-out infinite;
                }

                @keyframes pulseSlow {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }
            `}</style>
        </div>
    );
};

export default PlaceOrderPage;