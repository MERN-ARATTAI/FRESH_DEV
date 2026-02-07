import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEachProduct } from "../Api/interceptor";
import AxiosToastError from "../Utils/AxiosToastError";
import toast from 'react-hot-toast';
import { useAll } from "../GlobalProvider/UsesContext";
import { useAuth } from "../GlobalProvider/AuthContext";
import Product from "../Components/Product";


const ProductDetail = () => {
  const { id } = useParams();
  const { cartItems, handleAddToCart } = useAll()
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState("");
  const [loading, setLoading] = useState(true);

  const getDeliveryDates = (days = 3) => {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + days);

    const options = { day: "2-digit", month: "short", year: "numeric" };

    return {
      startDate: start.toLocaleDateString("en-IN", options),
      endDate: end.toLocaleDateString("en-IN", options),
    };
  };
  const { startDate, endDate } = getDeliveryDates(3);

  const getSingleProduct = async () => {
    try {
      const res = await getEachProduct(id);
      setProduct(res.data.data);
      setMainImg(res.data.data.image?.[0]?.url);
    } catch (error) {
      AxiosToastError(error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, [id]);



  // Handle Add to Cart
  const addToCartHandler = async () => {
    if (!isLoggedIn()) {
      toast.error('Please login to add items to cart');
      navigate('/');
      return;
    }

    await handleAddToCart(product._id);
  };



  const handleBuyNow = () => {
    if (!isLoggedIn()) {
      toast.error("Please login to continue");
      navigate(<Login />, { state: { from: `/checkout/${id}` } });
      return;
    }

    navigate(`/checkout/${id}`);
  };

  return (

    <>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">

          {/* LEFT: IMAGE SECTION */}
          <div className="flex justify-center items-start">
            <div className="w-full relative group sticky top-20">
              {/* Decorative background elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1D9C7A]/5 via-[#88C7B3]/10 to-[#BEDCD0]/5 rounded-3xl blur-3xl transform group-hover:scale-105 transition-transform duration-700"></div>

              {/* Main image container */}
              <div className="relative bg-gradient-to-br from-white via-[#F3F1EC]/30 to-white p-8 rounded-2xl shadow-2xl border-2 border-[#E4E3E7]/50 backdrop-blur-sm overflow-hidden">
                {/* Animated corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1D9C7A]/20 to-transparent rounded-bl-full transform group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#88C7B3]/20 to-transparent rounded-tr-full transform group-hover:scale-150 transition-transform duration-500"></div>

                {/* Image wrapper with enhanced effects */}
                <div className="relative bg-white rounded-xl overflow-hidden shadow-lg ring-1 ring-[#E4E3E7]">
                  <img
                    src={mainImg}
                    alt={product?.name}
                    className="w-full h-[450px] object-contain transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                  />

                  {/* Hover overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1D9C7A]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Zoom hint badge - enhanced */}
                <div className="absolute bottom-6 right-6 bg-gradient-to-r from-[#0F172A] to-[#1D9C7A] text-white px-4 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl flex items-center gap-2 transform group-hover:scale-110">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  Click to zoom
                </div>

                {/* Product badge */}
                <div className="absolute top-6 left-6 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-pulse">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Premium
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT DETAILS */}
          <div className="space-y-5">

            {/* Product Title */}
            <div className="border-b border-[#E4E3E7] pb-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-[#0F172A] leading-tight">
                {product?.name}
              </h1>
            </div>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#F3F1EC] to-white p-3 rounded-lg border border-[#E4E3E7]">
              <div className="flex text-xl text-[#1D9C7A]">
                ★★★★★
              </div>
              <div className="flex flex-col">
                <span className="text-[#0F172A] font-bold text-base">4.8/5</span>
                <span className="text-[#88C7B3] text-xs font-medium">(367 reviews)</span>
              </div>
            </div>

            {/* Price Section */}
            {/* <div className="bg-gradient-to-br from-[#1D9C7A]/10 to-[#88C7B3]/10 p-4 rounded-xl border border-[#1D9C7A]/30">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-[#88C7B3] font-semibold">Price:</span>
                <p className="text-3xl font-bold text-[#0F172A]">
                  ₹{product?.price}
                </p>
              </div>
              <p className="text-xs text-[#88C7B3] mt-1 font-medium">Inclusive of all taxes</p>
            </div> */}
            <div className="bg-gradient-to-br from-[#1D9C7A]/10 to-[#88C7B3]/10 p-4 rounded-xl border border-[#1D9C7A]/30">
  <div className="flex items-baseline gap-2">
    <span className="text-sm text-[#88C7B3] font-semibold">Price:</span>
    <div className="flex items-baseline gap-2">
      {product?.discount ? (
        <>
          <p className="text-3xl font-bold text-[#1D9C7A]">
            ₹{(product.price - (product.price * product.discount / 100)).toFixed(2)}
          </p>
          <p className="text-lg font-medium text-[#88C7B3] line-through">
            ₹{product.price}
          </p>
          <span className="ml-1 px-2 py-0.5 bg-[#1D9C7A] text-white text-xs font-bold rounded-full">
            {product.discount}% OFF
          </span>
        </>
      ) : (
        <p className="text-3xl font-bold text-[#0F172A]">
          ₹{product?.price}
        </p>
      )}
    </div>
  </div>
  <p className="text-xs text-[#88C7B3] mt-1 font-medium">Inclusive of all taxes</p>
           </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white shadow-md">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                In Stock
              </span>
              <span className="text-[#88C7B3] text-xs font-medium">Ready to ship</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-3">
              <button
                onClick={() => addToCartHandler()}
                className="w-full border-2 border-[#1D9C7A] text-[#1D9C7A] bg-white hover:bg-[#1D9C7A] hover:text-white px-5 py-3 rounded-lg font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] hover:from-[#88C7B3] hover:via-[#1D9C7A] hover:to-[#88C7B3] text-white py-3 rounded-lg font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Buy it Now
              </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] p-4 rounded-xl mt-5 border border-[#E4E3E7] shadow-inner">
              <div className="flex items-center gap-1.5 mb-3">
                <svg className="w-4 h-4 text-[#1D9C7A]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <p className="font-bold text-[#0F172A] text-base">
                  Delivery Information
                </p>
              </div>

              <p className="text-[#0F172A] font-semibold text-sm mb-3">
                Expected delivery: <span className="text-[#1D9C7A]">{startDate}</span> - <span className="text-[#1D9C7A]">{endDate}</span>
              </p>

              {/* Timeline */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] rounded-full flex items-center justify-center mb-1.5 shadow-md">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-bold text-[#0F172A] text-xs">Purchased</p>
                  <p className="text-[10px] text-[#88C7B3] mt-0.5">{startDate}</p>
                </div>

                <div className="text-center">
                  <div className="w-10 h-10 mx-auto bg-gradient-to-br from-[#88C7B3] to-[#BEDCD0] rounded-full flex items-center justify-center mb-1.5 shadow-md">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-bold text-[#0F172A] text-xs">Processing</p>
                  <p className="text-[10px] text-[#88C7B3] mt-0.5">1-2 days</p>
                </div>

                <div className="text-center">
                  <div className="w-10 h-10 mx-auto bg-gradient-to-br from-[#BEDCD0] to-[#D5D5E1] rounded-full flex items-center justify-center mb-1.5 shadow-md">
                    <svg className="w-5 h-5 text-[#1D9C7A]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                  </div>
                  <p className="font-bold text-[#0F172A] text-xs">Delivered</p>
                  <p className="text-[10px] text-[#88C7B3] mt-0.5">{endDate}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-1.5 bg-[#E4E3E7] rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Product Description */}
            {product?.description && (
              <div className="mt-6 bg-white p-4 rounded-xl border border-[#E4E3E7] shadow-md">
                <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-[#E4E3E7]">
                  <svg className="w-4 h-4 text-[#1D9C7A]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-bold text-lg text-[#0F172A]">Product Description</h3>
                </div>
                <p className="text-[#0F172A] text-sm leading-relaxed">{product?.description}</p>
              </div>
            )}

            {/* Additional Features/Benefits */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="bg-gradient-to-br from-[#F3F1EC] to-white p-3 rounded-lg border border-[#E4E3E7] text-center">
                <div className="w-10 h-10 mx-auto bg-gradient-to-br from-[#1D9C7A] to-[#88C7B3] rounded-full flex items-center justify-center mb-1.5">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="font-bold text-[#0F172A] text-xs">Genuine Product</p>
                <p className="text-[10px] text-[#88C7B3] mt-0.5">100% Authentic</p>
              </div>

              <div className="bg-gradient-to-br from-[#F3F1EC] to-white p-3 rounded-lg border border-[#E4E3E7] text-center">
                <div className="w-10 h-10 mx-auto bg-gradient-to-br from-[#88C7B3] to-[#BEDCD0] rounded-full flex items-center justify-center mb-1.5">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="font-bold text-[#0F172A] text-xs">Easy Returns</p>
                <p className="text-[10px] text-[#88C7B3] mt-0.5">7 Days Return</p>
              </div>
            </div>


          </div>
        </div>
      </div>

      <div>

        <Product />
      </div>


    </>



  );
};

export default ProductDetail;



