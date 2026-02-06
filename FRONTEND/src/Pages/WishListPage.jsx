import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAll } from '../GlobalProvider/UsesContext';
import { FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';

const WishListPage = () => {
    const navigate = useNavigate();
    const { Wishlist, handleRemoveFromWishlist, handleAddToCart, fetchWishlist } = useAll();
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    // Fetch wishlist when page loads to ensure fresh data
    useEffect(() => {
        const loadWishlist = async () => {
            try {
                setPageLoading(true);
                await fetchWishlist();
                console.log("Wishlist loaded successfully");
            } catch (error) {
                console.error("Error loading wishlist:", error);
            } finally {
                setPageLoading(false);
            }
        };
        loadWishlist();
    }, []);

    // Debug: Log whenever Wishlist changes
    useEffect(() => {
        console.log("Wishlist updated:", Wishlist);
    }, [Wishlist]);

    // Show loading state
    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading wishlist...</p>
                </div>
            </div>
        );
    }

    const handleRemove = async (productId) => {
        try {
            await handleRemoveFromWishlist(productId);
            toast.success('Removed from wishlist');
        } catch (error) {
            toast.error('Failed to remove from wishlist');
        }
    };

    const handleAddCart = async (productId) => {
        try {
            setIsLoading(true);
            await handleAddToCart(productId);
            toast.success('Added to cart');
        } catch (error) {
            toast.error('Failed to add to cart');
        } finally {
            setIsLoading(false);
        }
    };

    if (Wishlist.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaHeart className="mx-auto mb-4 text-gray-300" size={80} />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Wishlist is Empty</h2>
                    <p className="text-gray-500 mb-6">Start adding products to your wishlist!</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        // <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
        //     <div className="max-w-6xl mx-auto">
        //         <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

        //         {/* Wishlist Count */}
        //         <p className="text-gray-600 mb-6">
        //             You have <span className="font-semibold text-purple-600">{Wishlist.length}</span> item(s) in your wishlist
        //         </p>

        //         {/* Products Grid */}
        //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        //             {Wishlist.map((item) => {
        //                 const product = item.product;
        //                 if (!product) return null;

        //                 return (
        //                     <div
        //                         key={product._id}
        //                         className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        //                     >
        //                         {/* Image Container */}
        //                         <div className="relative w-full h-48 bg-gray-200 overflow-hidden group">
        //                             <img
        //                                 src={product.image?.[0]?.url || '/placeholder.png'}
        //                                 alt={product.name}
        //                                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
        //                                 onClick={() => navigate(`/product/${product._id}`)}
        //                             />

        //                             {/* Remove from Wishlist Button */}
        //                             <button
        //                                 onClick={() => handleRemove(product._id)}
        //                                 className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
        //                             >
        //                                 <FaHeart size={16} fill="white" />
        //                             </button>

        //                             {/* Discount Badge */}
        //                             {product.discount && (
        //                                 <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
        //                                     -{product.discount}%
        //                                 </div>
        //                             )}
        //                         </div>

        //                         {/* Product Details */}
        //                         <div className="p-4">
        //                             <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
        //                                 {product.name}
        //                             </h3>

        //                             {product.brand && (
        //                                 <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
        //                             )}

        //                             {/* Price Section */}
        //                             <div className="flex items-center gap-2 mb-4">
        //                                 <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
        //                                 {product.discount && (
        //                                     <span className="text-sm text-gray-400 line-through">
        //                                         ₹{Math.round(product.price / (1 - product.discount / 100))}
        //                                     </span>
        //                                 )}
        //                             </div>

        //                             {/* Stock Status */}
        //                             <div className="mb-4">
        //                                 {product.stock > 0 ? (
        //                                     <span className="text-sm text-green-600 font-semibold">In Stock</span>
        //                                 ) : (
        //                                     <span className="text-sm text-red-600 font-semibold">Out of Stock</span>
        //                                 )}
        //                             </div>

        //                             {/* Actions */}
        //                             <div className="flex gap-2">
        //                                 <button
        //                                     onClick={() => handleAddCart(product._id)}
        //                                     disabled={isLoading || product.stock === 0}
        //                                     className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
        //                                 >
        //                                     Add to Cart
        //                                 </button>
        //                                 <button
        //                                     onClick={() => navigate(`/product/${product._id}`)}
        //                                     className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition"
        //                                 >
        //                                     View
        //                                 </button>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 );
        //             })}
        //         </div>
        //     </div>
        // </div>
        // <div className="min-h-screen bg-[#F3F1EC] py-12 px-4 md:px-8">
        //     <style>{`
        //     @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');

        //     .wishlist-title {
        //         font-family: 'Playfair Display', serif;
        //     }

        //     .product-card {
        //         transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        //     }

        //     .product-card:hover {
        //         transform: translateY(-8px);
        //     }

        //     .product-image {
        //         transition: transform 0.5s ease;
        //     }

        //     .product-card:hover .product-image {
        //         transform: scale(1.1);
        //     }

        //     .heart-btn {
        //         transition: all 0.3s ease;
        //     }

        //     .heart-btn:hover {
        //         transform: scale(1.1);
        //     }
        // `}</style>

        //     <div className="max-w-6xl mx-auto">
        //         <h1 className="wishlist-title text-5xl font-bold text-[#0F172A] mb-4">My Wishlist</h1>

        //         {/* Wishlist Count */}
        //         <p className="text-[#0F172A] text-lg mb-8 opacity-70">
        //             You have <span className="font-semibold text-[#1D9C7A] text-xl">{Wishlist.length}</span> item(s) in your wishlist
        //         </p>

        //         {/* Products Grid */}
        //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        //             {Wishlist.map((item) => {
        //                 const product = item.product;
        //                 if (!product) return null;

        //                 return (
        //                     <div
        //                         key={product._id}
        //                         className="product-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl"
        //                     >
        //                         {/* Image Container */}
        //                         <div className="relative w-full h-48 bg-[#E4E3E7] overflow-hidden group">
        //                             <img
        //                                 src={product.image?.[0]?.url || '/placeholder.png'}
        //                                 alt={product.name}
        //                                 className="product-image w-full h-full object-cover cursor-pointer"
        //                                 onClick={() => navigate(`/product/${product._id}`)}
        //                             />

        //                             {/* Remove from Wishlist Button */}
        //                             <button
        //                                 onClick={() => handleRemove(product._id)}
        //                                 className="heart-btn absolute top-3 right-3 bg-white hover:bg-[#1D9C7A] text-[#1D9C7A] hover:text-white rounded-full p-2.5 transition-colors shadow-lg"
        //                             >
        //                                 <FaHeart size={16} />
        //                             </button>

        //                             {/* Discount Badge */}
        //                             {product.discount && (
        //                                 <div className="absolute top-3 left-3 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
        //                                     -{product.discount}%
        //                                 </div>
        //                             )}
        //                         </div>

        //                         {/* Product Details */}
        //                         <div className="p-5">
        //                             <h3 className="text-lg font-semibold text-[#0F172A] mb-2 line-clamp-2">
        //                                 {product.name}
        //                             </h3>

        //                             {product.brand && (
        //                                 <p className="text-sm text-[#88C7B3] font-medium mb-3 uppercase tracking-wide">{product.brand}</p>
        //                             )}

        //                             {/* Price Section */}
        //                             <div className="flex items-center gap-2 mb-4">
        //                                 <span className="text-2xl font-bold text-[#0F172A]">₹{product.price}</span>
        //                                 {product.discount && (
        //                                     <span className="text-sm text-[#D5D5E1] line-through">
        //                                         ₹{Math.round(product.price / (1 - product.discount / 100))}
        //                                     </span>
        //                                 )}
        //                             </div>

        //                             {/* Stock Status */}
        //                             <div className="mb-4">
        //                                 {product.stock > 0 ? (
        //                                     <span className="inline-flex items-center gap-1.5 text-sm text-[#1D9C7A] font-semibold bg-[#BEDCD0]/30 px-3 py-1 rounded-full">
        //                                         <span className="w-2 h-2 bg-[#1D9C7A] rounded-full animate-pulse"></span>
        //                                         In Stock
        //                                     </span>
        //                                 ) : (
        //                                     <span className="inline-flex items-center gap-1.5 text-sm text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full">
        //                                         <span className="w-2 h-2 bg-red-600 rounded-full"></span>
        //                                         Out of Stock
        //                                     </span>
        //                                 )}
        //                             </div>

        //                             {/* Actions */}
        //                             <div className="flex gap-2">
        //                                 <button
        //                                     onClick={() => handleAddCart(product._id)}
        //                                     disabled={isLoading || product.stock === 0}
        //                                     className="flex-1 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white py-2.5 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        //                                 >
        //                                     Add to Cart
        //                                 </button>
        //                                 <button
        //                                     onClick={() => navigate(`/product/${product._id}`)}
        //                                     className="flex-1 border-2 border-[#BEDCD0] text-[#0F172A] font-medium py-2.5 rounded-xl hover:bg-[#BEDCD0] hover:border-[#88C7B3] transition-all"
        //                                 >
        //                                     View
        //                                 </button>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 );
        //             })}
        //         </div>
        //     </div>
        // </div>
        <div className="min-h-screen bg-[#F3F1EC] py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-[#0F172A] mb-4 tracking-tight">My Wishlist</h1>

                {/* Wishlist Count */}
                <p className="text-[#0F172A] text-lg mb-8 opacity-70">
                    You have <span className="font-semibold text-[#1D9C7A] text-sm">{Wishlist.length}</span> item(s) in your wishlist
                </p>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Wishlist.map((item) => {
                        const product = item.product;
                        if (!product) return null;

                        return (
                            <div
                                key={product._id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                            >
                                {/* Image Container */}
                                <div className="relative w-full h-48 bg-[#E4E3E7] overflow-hidden group">
                                    <img
                                        src={product.image?.[0]?.url || '/placeholder.png'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    />

                                    {/* Remove from Wishlist Button */}
                                    <button
                                        onClick={() => handleRemove(product._id)}
                                        className="absolute top-3 right-3 bg-white hover:bg-[#1D9C7A] text-[#1D9C7A] hover:text-white rounded-full p-2.5 transition-all duration-300 shadow-lg hover:scale-110"
                                    >
                                        <FaHeart size={16} />
                                    </button>

                                    {/* Discount Badge */}
                                    {product.discount && (
                                        <div className="absolute top-3 left-3 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                                            -{product.discount}%
                                        </div>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-[#0F172A] mb-2 line-clamp-2 leading-tight">
                                        {product.name}
                                    </h3>

                                    {product.brand && (
                                        <p className="text-sm text-[#88C7B3] font-medium mb-3 uppercase tracking-wide">{product.brand}</p>
                                    )}

                                    {/* Price Section */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-2xl font-bold text-[#0F172A]">₹{product.price}</span>
                                        {product.discount && (
                                            <span className="text-sm text-[#D5D5E1] line-through">
                                                ₹{Math.round(product.price / (1 - product.discount / 100))}
                                            </span>
                                        )}
                                    </div>

                                    {/* Stock Status */}
                                    <div className="mb-4">
                                        {product.stock > 0 ? (
                                            <span className="inline-flex items-center gap-1.5 text-sm text-[#1D9C7A] font-semibold bg-[#BEDCD0]/30 px-3 py-1 rounded-full">
                                                <span className="w-2 h-2 bg-[#1D9C7A] rounded-full animate-pulse"></span>
                                                {product.stock}<span>Stock</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-sm text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full">
                                                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddCart(product._id)}
                                            disabled={isLoading || product.stock === 0}
                                            className="flex-1 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white py-2.5 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={() => navigate(`/product/${product._id}`)}
                                            className="flex-1 border-2 border-[#BEDCD0] text-[#0F172A] font-medium py-2.5 rounded-xl hover:bg-[#BEDCD0] hover:border-[#88C7B3] transition-all duration-300"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default WishListPage;

