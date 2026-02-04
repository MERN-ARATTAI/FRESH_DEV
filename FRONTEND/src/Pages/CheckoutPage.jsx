import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAddress, getEachProduct } from "../Api/interceptor";
import { useParams } from "react-router-dom";
import { useAll } from "../GlobalProvider/UsesContext";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [loadingAddresses, setLoadingAddresses] = useState(false);

    // Cart items may come from a single product (id param) or from global cart
    const [cartItems, setCartItems] = useState([]);
    const [loadingProduct, setLoadingProduct] = useState(true);

    const { cartItems: ctxCartItems } = useAll();

    useEffect(() => {
        fetchAddresses();

        if (id) {
            fetchProduct();
        } else {
            // Use cart from global context
            if (Array.isArray(ctxCartItems) && ctxCartItems.length > 0) {
                setCartItems(ctxCartItems.map(ci => ({
                    _id: ci.product._id,
                    name: ci.product.name,
                    image: ci.product.image?.[0]?.url,
                    price: ci.product.price,
                    quantity: ci.quantity
                })));
            } else {
                // no items in cart, show message and redirect to cart
                toast.info("Your cart is empty. Add items before checkout.");
                navigate("/cart");
            }
            setLoadingProduct(false);
        }
    }, [id, ctxCartItems]);

    const fetchProduct = async () => {
        try {
            const res = await getEachProduct(id);
            const product = res.data.data;
            setCartItems([
                {
                    _id: product._id,
                    name: product.name,
                    image: product.image?.[0]?.url,
                    price: product.price,
                    quantity: 1
                }
            ]);
        } catch (err) {
            toast.error("Failed to load product");
            navigate("/");
        } finally {
            setLoadingProduct(false);
        }
    };




    const fetchAddresses = async () => {
        setLoadingAddresses(true);
        try {
            const res = await getAddress();
            if (res.data.success) {
                const addressList = res.data.data || [];
                setAddresses(addressList);

                // Auto-select first address if available
                if (addressList.length > 0) {
                    setSelectedAddressId(addressList[0]._id);
                }
            }
        } catch (err) {
            toast.error("Failed to fetch addresses");
        } finally {
            setLoadingAddresses(false);
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const shippingCharge = 99;
    const taxRate = 0.18; // 18% GST
    const subtotal = calculateSubtotal();
    const tax = subtotal * taxRate;
    const total = subtotal + shippingCharge + tax;

    const handleProceedToPayment = () => {
        if (!selectedAddressId) {
            toast.error("Please select a delivery address");
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);

        // Navigate to place order page with order details
        navigate("/place-order", {
            state: {
                cartItems,
                selectedAddress,
                pricing: {
                    subtotal,
                    shippingCharge,
                    tax,
                    total
                }
            }
        });
    };

    const handleAddNewAddress = () => {
        const returnTo = id ? `/checkout/${id}` : '/checkout';
        navigate("/pages/address", { state: { fromCheckout: true, returnTo } });
    };

    if (loadingAddresses) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <p className="mt-4 text-gray-600">Loading checkout...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-green-600 hover:text-green-700 mb-4 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Cart
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Section - Address & Items */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Delivery Address Section */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Delivery Address</h2>
                                <button
                                    onClick={handleAddNewAddress}
                                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                                >
                                    + Add New Address
                                </button>
                            </div>

                            {addresses.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                    <p className="text-gray-500 mb-4">No addresses found</p>
                                    <button
                                        onClick={handleAddNewAddress}
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                                    >
                                        Add Address
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr._id}
                                            onClick={() => setSelectedAddressId(addr._id)}
                                            className={`border-2 rounded-lg p-4 cursor-pointer transition ${selectedAddressId === addr._id
                                                ? 'border-green-600 bg-green-50'
                                                : 'border-gray-200 hover:border-green-300'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="radio"
                                                    checked={selectedAddressId === addr._id}
                                                    onChange={() => setSelectedAddressId(addr._id)}
                                                    className="mt-1 w-4 h-4 text-green-600"
                                                />
                                                <div className="flex-1">
                                                    {addr.address_line && (
                                                        <p className="text-gray-700">{addr.address_line}</p>
                                                    )}
                                                    <p className="font-semibold text-gray-900">
                                                        {addr.city}, {addr.state}
                                                    </p>
                                                    {addr.country && (
                                                        <p className="text-gray-600">{addr.country}</p>
                                                    )}
                                                    {addr.pincode && (
                                                        <p className="text-gray-600">PIN: {addr.pincode}</p>
                                                    )}
                                                    <p className="text-gray-700 mt-1">📞 {addr.mobile}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Cart Items Section */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">
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
                                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                                                {item.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                Qty: {item.quantity}
                                            </p>
                                            <p className="text-green-600 font-semibold mt-2">
                                                ₹{item.price.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Shipping</span>
                                    <span>₹{shippingCharge}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Tax (GST 18%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-green-600">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleProceedToPayment}
                                disabled={!selectedAddressId || cartItems.length === 0}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                            >
                                Proceed to Payment
                            </button>

                            <div className="mt-4 pt-4 border-t">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Secure checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;