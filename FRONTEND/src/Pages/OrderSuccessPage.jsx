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
      
        <div className="min-h-screen bg-[#F3F1EC] flex items-center justify-center px-4 py-8 sm:py-12">
            <div className="max-w-md w-full">

                {/* Success Animation */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-[#BEDCD0] to-[#88C7B3]/30 rounded-full mb-6 relative animate-scale-in shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] rounded-full animate-ping opacity-20"></div>
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] rounded-full flex items-center justify-center shadow-2xl">
                            <svg className="w-12 h-12 sm:w-14 sm:h-14 text-white animate-draw-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-3 animate-slide-up">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-[#0F172A] opacity-70 text-base sm:text-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Thank you for your purchase
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6 border-2 border-[#BEDCD0]/50 animate-slide-up hover:shadow-2xl transition-all duration-300" style={{ animationDelay: '0.2s' }}>
                    <div className="border-b-2 border-[#E4E3E7] pb-5 mb-5">
                        <p className="text-sm text-[#88C7B3] mb-2 font-semibold uppercase tracking-wide">Order ID</p>
                        <p className="text-lg sm:text-xl font-bold text-[#0F172A] break-all">{orderId}</p>
                    </div>

                    <div className="border-b-2 border-[#E4E3E7] pb-5 mb-5">
                        <p className="text-sm text-[#88C7B3] mb-2 font-semibold uppercase tracking-wide">Total Amount</p>
                        <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] bg-clip-text text-transparent">
                            ₹{total?.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-[#BEDCD0]/30 to-[#F3F1EC]/50 p-4 sm:p-5 rounded-xl border-2 border-[#BEDCD0]/50">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-[#0F172A] text-sm sm:text-base mb-1">Order Confirmation</p>
                                <p className="text-xs sm:text-sm text-[#0F172A] opacity-70 leading-relaxed">
                                    A confirmation email has been sent to your registered email address with order details.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estimated Delivery */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border border-[#BEDCD0]/30 animate-slide-up hover:shadow-xl transition-all duration-300" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center gap-3 sm:gap-4 mb-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-[#0F172A] text-lg sm:text-xl">Estimated Delivery</h3>
                    </div>
                    <div className="ml-0 sm:ml-16 bg-[#F3F1EC]/50 p-4 rounded-xl border border-[#BEDCD0]/30">
                        <p className="text-[#0F172A] opacity-80 text-sm sm:text-base leading-relaxed">
                            Expected delivery by{" "}
                            <span className="block sm:inline font-bold text-[#1D9C7A] mt-2 sm:mt-0 text-base sm:text-lg">
                                {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 sm:space-y-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <button
                        onClick={() => navigate("/orders")}
                        className="w-full bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        View Order Details
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-white text-[#0F172A] py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg border-2 border-[#BEDCD0] hover:bg-[#BEDCD0]/30 hover:border-[#88C7B3] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Continue Shopping
                    </button>
                </div>

                {/* Help Section */}
                <div className="mt-8 sm:mt-10 text-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#BEDCD0]/30 hover:shadow-xl transition-all duration-300">
                        <p className="text-sm sm:text-base text-[#0F172A] opacity-70 mb-3">Need help with your order?</p>
                        <button className="inline-flex items-center gap-2 text-[#1D9C7A] hover:text-[#88C7B3] font-bold text-sm sm:text-base transition-colors duration-300 group">
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Contact Support
                        </button>
                    </div>
                </div>

                {/* Decorative Confetti Elements */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-20 left-10 w-3 h-3 bg-[#1D9C7A] rounded-full animate-float opacity-60"></div>
                    <div className="absolute top-40 right-20 w-2 h-2 bg-[#88C7B3] rounded-full animate-float-delayed opacity-60"></div>
                    <div className="absolute bottom-40 left-20 w-2 h-2 bg-[#BEDCD0] rounded-full animate-float opacity-60"></div>
                    <div className="absolute top-60 right-10 w-3 h-3 bg-[#1D9C7A] rounded-full animate-float-delayed opacity-60"></div>
                </div>

            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out;
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.5);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-scale-in {
                    animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
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

                .animate-slide-up {
                    animation: slideUp 0.6s ease-out;
                    animation-fill-mode: both;
                }

                @keyframes drawCheck {
                    from {
                        stroke-dasharray: 50;
                        stroke-dashoffset: 50;
                    }
                    to {
                        stroke-dashoffset: 0;
                    }
                }

                .animate-draw-check {
                    animation: drawCheck 0.8s ease-out 0.3s;
                    animation-fill-mode: both;
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(180deg);
                    }
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-float-delayed {
                    animation: float 3s ease-in-out infinite;
                    animation-delay: 1.5s;
                }
            `}</style>
        </div>
    );
};

export default OrderSuccessPage;