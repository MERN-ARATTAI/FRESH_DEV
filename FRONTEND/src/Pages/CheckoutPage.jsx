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
        setCartItems(
          ctxCartItems.map((ci) => ({
            _id: ci.product._id,
            name: ci.product.name,
            image: ci.product.image?.[0]?.url,
            price: ci.product.price,
            discount: ci.product.discount || 0,
            quantity: ci.quantity,
          })),
        );
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
          discount: product.discount || 0,
          quantity: 1,
        },
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
    return cartItems.reduce((sum, item) => {
      const discountedPrice = item.price - (item.price * item.discount) / 100;
      return sum + discountedPrice * item.quantity;
    }, 0);
  };

  const shippingCharge = 0;
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

    const selectedAddress = addresses.find(
      (addr) => addr._id === selectedAddressId,
    );

    // Navigate to place order page with order details
    navigate("/place-order", {
      state: {
        cartItems,
        selectedAddress,
        pricing: {
          subtotal,
          shippingCharge,
          tax,
          total,
        },
      },
    });
  };

  const handleAddNewAddress = () => {
    const returnTo = id ? `/checkout/${id}` : "/checkout";
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
    <div className="min-h-screen bg-[#F3F1EC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-[#1D9C7A] hover:text-[#88C7B3] mb-4 flex items-center gap-2 font-medium transition-colors duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Cart
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
            Checkout
          </h1>
          <p className="text-[#0F172A] opacity-60 mt-2">
            Complete your order in a few simple steps
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Section - Address & Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#BEDCD0]/30">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="md:text-2xl text-xl font-bold text-[#0F172A]">
                    Delivery Address
                  </h2>
                  <p className="text-sm text-[#0F172A] opacity-60 mt-1">
                    Where should we send your order?
                  </p>
                </div>
                <button
                  onClick={handleAddNewAddress}
                  className="bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white md:px-5 px-3 md:py-2.5 py-1.5 rounded-xl md:text-[17px] text-[15px] font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center md:gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add New
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-[#BEDCD0] rounded-2xl bg-[#F3F1EC]/50">
                  <div className="inline-block p-4 bg-[#BEDCD0]/30 rounded-full mb-4">
                    <svg
                      className="w-12 h-12 text-[#88C7B3]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-[#0F172A] opacity-70 mb-6 font-medium">
                    No delivery addresses found
                  </p>
                  <button
                    onClick={handleAddNewAddress}
                    className="bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white px-8 py-3 rounded-xl hover:shadow-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                        selectedAddressId === addr._id
                          ? "border-[#1D9C7A] bg-[#BEDCD0]/20 shadow-lg scale-[1.02]"
                          : "border-[#E4E3E7] hover:border-[#88C7B3] hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            selectedAddressId === addr._id
                              ? "border-[#1D9C7A] bg-[#1D9C7A]"
                              : "border-[#D5D5E1]"
                          }`}
                        >
                          {selectedAddressId === addr._id && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          {addr.address_line && (
                            <p className="text-[#0F172A] opacity-80 leading-relaxed">
                              {addr.address_line}
                            </p>
                          )}
                          <p className="font-bold text-[#0F172A] mt-2 text-lg">
                            {addr.city}, {addr.state}
                          </p>
                          {addr.country && (
                            <p className="text-[#0F172A] opacity-70 mt-1">
                              {addr.country}
                            </p>
                          )}
                          {addr.pincode && (
                            <span className="inline-block bg-[#BEDCD0]/40 text-[#0F172A] px-3 py-1 rounded-full text-sm font-semibold mt-2">
                              PIN: {addr.pincode}
                            </span>
                          )}
                          <p className="text-[#0F172A] mt-3 flex items-center gap-2 font-medium">
                            <svg
                              className="w-4 h-4 text-[#1D9C7A]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            {addr.mobile}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Items Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#BEDCD0]/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#0F172A]">
                  Order Items
                </h2>
                <span className="bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                  {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
                </span>
              </div>

              <div className="space-y-5">
                {cartItems.map((item) => {
                  const discountedPrice =
                    item.price - (item.price * item.discount) / 100;
                  const totalItemPrice = discountedPrice * item.quantity;

                  return (
                    <div
                      key={item._id}
                      className="flex gap-4 pb-5 border-b border-[#E4E3E7] last:border-b-0 hover:bg-[#F3F1EC]/50 -mx-2 px-2 py-2 rounded-xl transition-colors duration-300"
                    >
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border-2 border-[#E4E3E7]"
                        />
                        <span className="absolute -top-2 -right-2 bg-[#1D9C7A] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                          {item.quantity}
                        </span>
                        {item.discount > 0 && (
                          <span className="absolute -top-2 -left-2 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white px-2 py-0.5 rounded-full md:text-[13px] text-[11px] font-bold shadow-lg">
                            {item.discount}% OFF
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#0F172A] text-sm sm:text-base line-clamp-2 leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-[#88C7B3] text-sm mt-2 font-medium">
                          Quantity: {item.quantity}
                        </p>

                        {/* Price Display with Discount */}
                        <div className="flex items-center gap-2 mt-2">
                          {item.discount > 0 ? (
                            <>
                              <p className="text-gray-400 line-through text-sm">
                                ₹{item.price.toLocaleString("en-IN")}
                              </p>
                              <p className="text-[#1D9C7A] font-bold text-lg">
                                ₹
                                {Math.round(discountedPrice).toLocaleString(
                                  "en-IN",
                                )}
                              </p>
                            </>
                          ) : (
                            <p className="text-[#1D9C7A] font-bold text-lg">
                              ₹{item.price.toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* <div className="text-right flex flex-col justify-between">
                                                {item.discount > 0 && (
                                                    <p className="text-gray-400 line-through text-sm">
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
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8 border-2 border-[#BEDCD0]/50">
              <h2 className="text-2xl font-bold mb-6 text-[#0F172A]">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#0F172A] opacity-80">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-[#0F172A] opacity-80">
                  <span className="font-medium">Shipping</span>
                  <span className="text-[#1D9C7A] font-bold">FREE</span>
                  <span className="font-semibold">₹{shippingCharge}</span>
                </div>
                <div className="flex justify-between text-[#0F172A] opacity-80">
                  <span className="font-medium">Tax (GST 18%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-[#BEDCD0] to-transparent my-4"></div>

                <div className="flex justify-between text-xl font-bold bg-gradient-to-br from-[#BEDCD0]/30 to-[#F3F1EC]/50 -mx-2 px-4 py-3 rounded-xl">
                  <span className="text-[#0F172A]">Total</span>
                  <span className="text-[#1D9C7A]">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={!selectedAddressId || cartItems.length === 0}
                className="w-full bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl disabled:from-[#D5D5E1] disabled:to-[#E4E3E7] disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] disabled:scale-100"
              >
                Proceed to Payment
              </button>

              <div className="mt-6 pt-6 border-t border-[#E4E3E7]">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#0F172A] opacity-70">
                    <div className="w-8 h-8 bg-[#BEDCD0]/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-[#1D9C7A]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">
                      Secure checkout guaranteed
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#0F172A] opacity-70">
                    <div className="w-8 h-8 bg-[#BEDCD0]/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-[#1D9C7A]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">
                      Safe & encrypted payment
                    </span>
                  </div>
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
