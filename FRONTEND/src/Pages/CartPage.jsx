import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getCart, removeCartItem, updateCartqty } from '../Api/interceptor';
import AxiosToastError from '../Utils/AxiosToastError';
import { useAll } from '../GlobalProvider/UsesContext';

const CartPage = () => {

  const { fetchCart, cartItems, totalAmount, removeItem, increaseQty, decreaseQty, } = useAll()
  const navigate = useNavigate();
  useEffect(() => {
    fetchCart(); // 🔥 THIS FIXES IT
  }, []);
  return (
    
    
    <div className="min-h-screen bg-gradient-to-br from-[#F3F1EC] to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Title Section with Icon */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A]">
            Your Cart
          </h1>
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {Array.isArray(cartItems) && cartItems
            .filter(item => item.product)
            .map((item) => (

              <div
                key={item._id}
                className="
              relative group
              flex flex-col items-center sm:flex-row sm:items-center gap-4 sm:gap-5
              bg-white rounded-xl
              border border-[#E4E3E7]
              hover:border-[#88C7B3]
              shadow-sm hover:shadow-lg
              transition-all duration-300
              p-5
              overflow-hidden
            "
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1D9C7A]/5 to-[#88C7B3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                {/* Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={item.product.image?.[0]?.url}
                    alt={item.product.name}
                    className="
                  w-24 h-24 sm:w-28 sm:h-28 rounded-xl
                  object-cover
                  ring-2 ring-[#E4E3E7]
                  group-hover:ring-[#88C7B3]
                  transition-all duration-300
                  group-hover:scale-105
                "
                  />
                </div>

                {/* Info */}
                <div className="flex-1 w-full relative z-10 text-center sm:text-left">
                  <p className="font-bold text-lg text-[#0F172A] mb-1">
                    {item.product.name}
                  </p>
                  
                  {/* Price per unit with discount */}
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    {item.product.discount > 0 ? (
                      <>
                        {/* Original Price Strikethrough */}
                        <p className="text-base text-gray-400 line-through">
                          ₹{item.product.price}
                        </p>
                        {/* New Discounted Price */}
                        <p className="text-[#1D9C7A] font-bold text-lg">
                          ₹{Math.round(item.product.price - (item.product.price * item.product.discount / 100))}
                        </p>
                      </>
                    ) : (
                      <p className="text-[#88C7B3] font-semibold text-base">
                        ₹{item.product.price}
                      </p>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                    <span className="text-sm font-medium text-[#0F172A]">Quantity:</span>
                    <div className="flex items-center gap-2 bg-[#F3F1EC] rounded-lg p-1">
                      <button
                        onClick={() => decreaseQty(item)}
                        className="
                      w-8 h-8 rounded-lg
                      bg-white
                      border border-[#E4E3E7]
                      text-[#1D9C7A] font-bold
                      hover:bg-[#1D9C7A]
                      hover:text-white
                      hover:border-[#1D9C7A]
                      transition-all duration-300
                      shadow-sm
                    "
                      >
                        −
                      </button>

                      <span className="font-bold text-[#0F172A] min-w-[2rem] text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQty(item)}
                        className="
                      w-8 h-8 rounded-lg
                      bg-white
                      border border-[#E4E3E7]
                      text-[#1D9C7A] font-bold
                      hover:bg-[#1D9C7A]
                      hover:text-white
                      hover:border-[#1D9C7A]
                      transition-all duration-300
                      shadow-sm
                    "
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price & Remove */}
                <div className="w-full sm:w-auto flex flex-col items-center sm:items-end gap-3 text-center sm:text-right relative z-10">
                  <div>
                    {/* Discount Badge */}
                    {item.product.discount > 0 && (
                      <p className="text-xs font-bold text-white bg-[#1D9C7A] px-3 py-1 rounded-full inline-block mb-2">
                        {item.product.discount}% OFF
                      </p>
                    )}
                    
                    {/* Original Total Price (Strikethrough) */}
                    {/* {item.product.discount > 0 && (
                      <p className="text-base text-gray-400 line-through mb-1">
                        ₹{item.product.price * item.quantity}
                      </p>
                    )} */}
                    
                    {/* Price Label */}
                    <p className="text-xs text-[#88C7B3] font-medium mb-1">
                      Discounted Price
                    </p>
                    
                    {/* New/Final Discounted Price */}
                    <p className="font-bold text-2xl text-[#1D9C7A]">
                      ₹{item.totalPrice}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="
                  px-5 py-2
                  text-sm font-semibold
                  text-white
                  rounded-lg
                  bg-gradient-to-r from-[#88C7B3] to-[#1D9C7A]
                  hover:from-[#1D9C7A] hover:to-[#88C7B3]
                  shadow-md
                  hover:shadow-lg
                  transition-all duration-300
                  transform hover:scale-105
                  flex items-center gap-2
                "
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Summary Card */}
        <div
          className="
        mt-10 p-6 rounded-2xl
        bg-gradient-to-br
        from-white
        via-[#F3F1EC]/50
        to-[#BEDCD0]/20
        border-2 border-[#E4E3E7]
        shadow-xl
      "
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Total Amount */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[#88C7B3]">Grand Total</p>
                <h2 className="text-3xl font-bold text-[#0F172A]">
                  ₹{Number(totalAmount) || 0}
                </h2>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate("/pages/address", { state: { fromCheckout: true, returnTo: '/checkout' } })}
              className="
            group
            px-10 py-4 rounded-xl
            text-white font-bold text-lg
            bg-gradient-to-r
            from-[#1D9C7A]
            via-[#88C7B3]
            to-[#BEDCD0]
            hover:from-[#88C7B3]
            hover:via-[#1D9C7A]
            hover:to-[#88C7B3]
            shadow-lg
            hover:shadow-2xl
            transition-all duration-300
            transform hover:scale-105
            flex items-center gap-3
          "
            >
              <span>Proceed to Checkout</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-[#E4E3E7] flex flex-wrap gap-4 justify-center sm:justify-start">
            <div className="flex items-center gap-2 text-sm text-[#88C7B3]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#88C7B3]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <span className="font-medium">Free Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#88C7B3]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Easy Returns</span>
            </div>
          </div>
        </div>

      </div>
    </div>

   
  )
}

export default CartPage