import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import AxiosToastError from '../Utils/AxiosToastError';
import { useAll } from '../GlobalProvider/UsesContext';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getCategoryProduct, getsubcategory } from '../Api/interceptor';


const CategoryProduct = () => {
  const navigate = useNavigate();

  const { categoryName, id } = useParams();
  const {
    products,
    subCategories,
    Wishlist,
    fetchAllCategoryProducts,
    fetchSubCategories,
    fetchProductsBySubcategory,
    handleAddToCart,
    handleAddToWishlist,
    handleRemoveFromWishlist
  } = useAll();

  const [wishlistProductIds, setWishlistProductIds] = useState(new Set());

  useEffect(() => {
    const ids = new Set(Wishlist.map(item => item.product?._id));
    setWishlistProductIds(ids);
  }, [Wishlist]);
  useEffect(() => {
    if (id) fetchAllCategoryProducts(id);
    if (categoryName) fetchSubCategories(categoryName);
  }, [categoryName, id]);





  const hasSubCategories = subCategories.length > 0;



  return (
    // <div className="flex gap-6 p-6">
    //     {/* LEFT SIDE: Subcategories */}
    //     <div className="w-1/4 flex flex-col gap-4">
    //         {subCategories.map(sub => (
    //             <div
    //                 key={sub._id}
    //                 className="cursor-pointer hover:shadow-lg transition p-2 flex items-center"
    //                 onClick={() => fetchProductsBySubcategory(sub._id)}
    //             >
    //                 <img
    //                     src={sub.image.url || sub.image?.[0]?.url}
    //                     alt={sub.name}
    //                     className="w-16 h-16 object-cover rounded"
    //                 />
    //                 <p className="ml-2">{sub.name}</p>
    //             </div>
    //         ))}
    //     </div>

    //     {/* RIGHT SIDE: Products */}
    //     <div className="w-3/4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
    //         {products.length === 0 ? (
    //             <p className="col-span-full text-center text-gray-500">No products found.</p>
    //         ) : (
    //             products.map(product => (
    //                 <div
    //                     key={product._id}
    //                     className="shadow p-3 flex flex-col items-center cursor-pointer"
    //                 >
    //                     <img
    //                         onClick={() => navigate(`/product/${product._id}`)}
    //                         src={product.image?.[0]?.url}
    //                         className="w-full h-full object-cover"
    //                         alt={product.name}
    //                     />
    //                     <p className="mt-2 font-semibold text-center">{product.name}</p>
    //                     <p className="text-sm text-gray-600">₹{product.price}</p>
    //                     <button
    //                         onClick={() => handleAddToCart(product._id)}
    //                         className="bg-black text-white p-2 w-full mt-2"
    //                     >
    //                         Add to cart
    //                     </button>
    //                 </div>
    //             ))
    //         )}
    //     </div>
    // </div>
    //         <div className="flex gap-6 p-6">
    //   {/* LEFT SIDE: Subcategories */}
    //   <div className="w-1/4 flex flex-col gap-4 sticky top-40 self-start">
    //     {subCategories.map(sub => (
    //       <div
    //         key={sub._id}
    //         className="cursor-pointer hover:shadow-lg transition p-2 flex items-center"
    //         onClick={() => fetchProductsBySubcategory(sub._id)}
    //       >
    //         <img
    //           src={sub.image.url || sub.image?.[0]?.url}
    //           alt={sub.name}
    //           className="w-16 h-16 object-cover rounded"
    //         />
    //         <p className="ml-2">{sub.name}</p>
    //       </div>
    //     ))}
    //   </div>

    //   {/* RIGHT SIDE: Products */}
    //   <div className="w-3/4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
    //     {products.length === 0 ? (
    //       <p className="col-span-full text-center text-gray-500">No products found.</p>
    //     ) : (
    //       products.map(product => (
    //         <div
    //           key={product._id}
    //           className="shadow p-3 flex flex-col items-center cursor-pointer"
    //         >
    //           <img
    //             onClick={() => navigate(`/product/${product._id}`)}
    //             src={product.image?.[0]?.url}
    //             className="w-full h-full object-cover"
    //             alt={product.name}
    //           />
    //           <p className="mt-2 font-semibold text-center">{product.name}</p>
    //           <p className="text-sm text-gray-600">₹{product.price}</p>
    //           <button
    //             onClick={() => handleAddToCart(product._id)}
    //             className="bg-black text-white p-2 w-full mt-2"
    //           >
    //             Add to cart
    //           </button>
    //         </div>
    //       ))
    //     )}
    //   </div>
    // </div>


  //   <div className="flex flex-col md:flex-row gap-6 p-6">
  //     {/* LEFT SIDE: Subcategories */}
  //     {hasSubCategories && (
  //       <div className="w-full md:w-1/4 flex flex-col gap-4 md:sticky md:top-38 self-start">
  //         {subCategories.map(sub => (
  //           <div
  //             key={sub._id}
  //             className="cursor-pointer hover:shadow-lg transition p-2 flex items-center gap-3"
  //             onClick={() => {
  //               console.log("Clicked subcategory:", sub.name, "ID:", sub._id);
  //               fetchProductsBySubcategory(sub._id);
  //             }}
  //           >
  //             {sub.image?.url ? (
  //               <img
  //                 src={sub.image.url}
  //                 alt={sub.name}
  //                 className="w-16 h-16 object-cover rounded"
  //               />
  //             ) : (
  //               <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
  //                 No Image
  //               </div>
  //             )}
  //             <p className="text-sm font-medium">{sub.name}</p>
  //           </div>
  //         ))}
  //       </div>
  //     )}

  //     {/* RIGHT SIDE: Products */}
  //     <div
  //       className={`
  //   ${hasSubCategories ? "w-full md:w-3/4" : "w-full"}
  //  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8
  // `}
  //     >
  //       {products.length === 0 ? (
  //         <p className="col-span-full text-center text-gray-500">
  //           No products found.
  //         </p>
  //       ) : (
  //         products.map(product => (
  //           <div
  //             key={product._id}
  //             className="
  //         bg-white rounded-2xl p-4 relative
  //         shadow-md hover:shadow-xl
  //         transition-all duration-300
  //       "
  //           >
  //             {/* Wishlist Heart Button */}
  //             <div
  //               onClick={() => {
  //                 if (wishlistProductIds.has(product._id)) {
  //                   handleRemoveFromWishlist(product._id);
  //                   toast.success('Removed from wishlist');
  //                 } else {
  //                   handleAddToWishlist(product);
  //                   toast.success('Added to wishlist');
  //                 }
  //               }}
  //               className={`
  //                 absolute top-4 right-4 z-10
  //                 p-2 rounded-full cursor-pointer
  //                 backdrop-blur bg-white/90
  //                 shadow-md transition
  //                 ${wishlistProductIds.has(product._id)
  //                   ? "ring-2 ring-pink-400"
  //                   : ""
  //                 }
  //               `}
  //             >
  //               {wishlistProductIds.has(product._id) ? (
  //                 <FaHeart className="text-xl text-pink-500" />
  //               ) : (
  //                 <FaRegHeart className="text-xl text-gray-500 hover:text-pink-500" />
  //               )}
  //             </div>

  //             <img
  //               onClick={() => navigate(`/product/${product._id}`)}
  //               src={product.image?.[0]?.url}
  //               className="w-full h-80 object-cover rounded-xl cursor-pointer"
  //               alt={product.name}
  //             />

  //             <p className="mt-3 font-semibold text-center">{product.name}</p>
  //             <p className="text-sm text-gray-600 text-center">₹{product.price}</p>

  //             <button
  //               onClick={() => handleAddToCart(product._id)}
  //               className="
  //           mt-3 w-full px-4 py-2 rounded-lg
  //           text-white font-semibold text-sm
  //           bg-gradient-to-r from-[#7b7cff] via-[#b695ff] to-[#f3b3ff]
  //           hover:opacity-90 transition
  //         "
  //             >
  //               Add to Cart
  //             </button>
  //           </div>
  //         ))
  //       )}
  //     </div>

  //   </div>

//   <div className="min-h-screen bg-gradient-to-b from-[#F3F1EC] to-white p-4 md:p-6">
//   <div className="container mx-auto">
//     <div className="flex flex-col md:flex-row gap-6">
      
//       {/* LEFT SIDE: Subcategories */}
//       {hasSubCategories && (
//         <div className="w-full md:w-1/4">
//           <div className="md:sticky md:top-24 space-y-3">
//             <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-[#E4E3E7] mb-4">
//               <h3 className="font-bold text-lg text-[#0F172A] mb-1">Categories</h3>
//               <div className="w-16 h-1 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] rounded-full"></div>
//             </div>

//             <div className="space-y-3">
//               {subCategories.map((sub, index) => (
//                 <div
//                   key={sub._id}
//                   className="group bg-white rounded-xl p-3 cursor-pointer border-2 border-[#E4E3E7] hover:border-[#1D9C7A] transition-all duration-300 hover:shadow-xl transform hover:scale-105"
//                   onClick={() => {
//                     console.log("Clicked subcategory:", sub.name, "ID:", sub._id);
//                     fetchProductsBySubcategory(sub._id);
//                   }}
//                   style={{ animationDelay: `${index * 50}ms` }}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="relative flex-shrink-0">
//                       {sub.image?.url ? (
//                         <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] border-2 border-[#E4E3E7] group-hover:border-[#1D9C7A] transition-all duration-300">
//                           <img
//                             src={sub.image.url}
//                             alt={sub.name}
//                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                           />
//                         </div>
//                       ) : (
//                         <div className="w-16 h-16 bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] rounded-lg flex items-center justify-center border-2 border-[#E4E3E7] group-hover:border-[#1D9C7A] transition-all duration-300">
//                           <span className="text-[#88C7B3] text-2xl font-bold">
//                             {sub.name.charAt(0)}
//                           </span>
//                         </div>
//                       )}
//                       {/* Animated dot indicator */}
//                       <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
//                     </div>
                    
//                     <div className="flex-1">
//                       <p className="font-semibold text-sm text-[#0F172A] group-hover:text-[#1D9C7A] transition-colors duration-300">
//                         {sub.name}
//                       </p>
//                       <div className="w-0 h-0.5 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] group-hover:w-full transition-all duration-300 rounded-full mt-1"></div>
//                     </div>

//                     {/* Arrow icon */}
//                     <svg 
//                       className="w-5 h-5 text-[#88C7B3] group-hover:text-[#1D9C7A] group-hover:translate-x-1 transition-all duration-300" 
//                       fill="none" 
//                       stroke="currentColor" 
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* RIGHT SIDE: Products */}
//       <div className={`${hasSubCategories ? "w-full md:w-3/4" : "w-full"}`}>
//         {products.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-32 h-32 bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] rounded-full flex items-center justify-center mb-6 shadow-lg">
//               <svg className="w-16 h-16 text-[#88C7B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//               </svg>
//             </div>
//             <p className="text-xl font-bold text-[#0F172A] mb-2">No Products Found</p>
//             <p className="text-sm text-[#88C7B3]">Try selecting a different category</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {products.map((product, index) => (
//               <div
//                 key={product._id}
//                 className="group bg-white rounded-2xl p-4 relative shadow-lg border-2 border-[#E4E3E7] hover:border-[#1D9C7A] transition-all duration-300 hover:shadow-2xl transform hover:scale-105"
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 {/* Wishlist Heart Button */}
//                 <div
//                   onClick={() => {
//                     if (wishlistProductIds.has(product._id)) {
//                       handleRemoveFromWishlist(product._id);
//                       toast.success('Removed from wishlist');
//                     } else {
//                       handleAddToWishlist(product);
//                       toast.success('Added to wishlist');
//                     }
//                   }}
//                   className={`absolute top-4 right-4 z-10 p-2.5 rounded-full cursor-pointer transition-all duration-300 ${
//                     wishlistProductIds.has(product._id)
//                       ? 'bg-[#1D9C7A] shadow-lg scale-110'
//                       : 'bg-white shadow-md hover:bg-[#F3F1EC] hover:scale-110'
//                   }`}
//                 >
//                   {wishlistProductIds.has(product._id) ? (
//                     <FaHeart className="text-xl text-white" />
//                   ) : (
//                     <FaRegHeart className="text-xl text-[#0F172A] hover:text-[#1D9C7A]" />
//                   )}
//                 </div>

//                 {/* Product Image */}
//                 <div 
//                   onClick={() => navigate(`/product/${product._id}`)}
//                   className="w-full h-72 overflow-hidden rounded-xl bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] cursor-pointer mb-4 relative"
//                 >
//                   <img
//                     src={product.image?.[0]?.url}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                     alt={product.name}
//                   />
//                   {/* Gradient overlay on hover */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 </div>

//                 {/* Product Info */}
//                 <div className="space-y-3">
//                   <p className="font-bold text-base text-[#0F172A] text-center group-hover:text-[#1D9C7A] transition-colors duration-300 line-clamp-2">
//                     {product.name}
//                   </p>

//                   {/* Price */}
//                   <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#F3F1EC] to-[#E4E3E7] py-2 rounded-lg">
//                     <svg className="w-5 h-5 text-[#1D9C7A]" fill="currentColor" viewBox="0 0 20 20">
//                       <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
//                     </svg>
//                     <span className="text-xl font-bold text-[#0F172A]">₹{product.price}</span>
//                   </div>

//                   {/* Add to Cart Button */}
//                   <button
//                     onClick={() => handleAddToCart(product._id)}
//                     className="mt-3 w-full px-4 py-3 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] hover:from-[#88C7B3] hover:via-[#1D9C7A] hover:to-[#88C7B3] transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
//                     </svg>
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//     </div>
//   </div>
// </div>



//     <div className="min-h-screen bg-gradient-to-b from-[#F3F1EC] to-white p-4 md:p-6"> 
//   <div className="container mx-auto">
//     <div className="flex flex-col md:flex-row gap-6">
      
//       {/* LEFT SIDE: Subcategories */}
//       {hasSubCategories && (
//         <div className="w-full md:w-1/4">
//           <div className="md:sticky md:top-24 space-y-3">
//             <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-[#E4E3E7] mb-4">
//               <h3 className="font-bold text-lg text-[#0F172A] mb-1">Categories</h3>
//               <div className="w-16 h-1 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] rounded-full"></div>
//             </div>

//             <div className="space-y-3">
//               {subCategories.map((sub, index) => (
//                 <div
//                   key={sub._id}
//                   className="group bg-white rounded-xl p-3 cursor-pointer border-2 border-[#E4E3E7] hover:border-[#1D9C7A] transition-all duration-300 hover:shadow-xl transform hover:scale-105"
//                   onClick={() => {
//                     console.log("Clicked subcategory:", sub.name, "ID:", sub._id);
//                     fetchProductsBySubcategory(sub._id);
//                   }}
//                   style={{ animationDelay: `${index * 50}ms` }}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="relative flex-shrink-0">
//                       {sub.image?.url ? (
//                         <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] border-2 border-[#E4E3E7] group-hover:border-[#1D9C7A] transition-all duration-300">
//                           <img
//                             src={sub.image.url}
//                             alt={sub.name}
//                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                           />
//                         </div>
//                       ) : (
//                         <div className="w-16 h-16 bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] rounded-lg flex items-center justify-center border-2 border-[#E4E3E7] group-hover:border-[#1D9C7A] transition-all duration-300">
//                           <span className="text-[#88C7B3] text-2xl font-bold">
//                             {sub.name.charAt(0)}
//                           </span>
//                         </div>
//                       )}
//                       <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
//                     </div>
                    
//                     <div className="flex-1">
//                       <p className="font-semibold text-sm text-[#0F172A] group-hover:text-[#1D9C7A] transition-colors duration-300">
//                         {sub.name}
//                       </p>
//                       <div className="w-0 h-0.5 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] group-hover:w-full transition-all duration-300 rounded-full mt-1"></div>
//                     </div>

//                     <svg 
//                       className="w-5 h-5 text-[#88C7B3] group-hover:text-[#1D9C7A] group-hover:translate-x-1 transition-all duration-300" 
//                       fill="none" 
//                       stroke="currentColor" 
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* RIGHT SIDE: Products */}
//       <div className={`${hasSubCategories ? "w-full md:w-3/4" : "w-full"}`}>
//         {products.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-32 h-32 bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] rounded-full flex items-center justify-center mb-6 shadow-lg">
//               <svg className="w-16 h-16 text-[#88C7B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//               </svg>
//             </div>
//             <p className="text-xl font-bold text-[#0F172A] mb-2">No Products Found</p>
//             <p className="text-sm text-[#88C7B3]">Try selecting a different category</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {products.map((product, index) => (
//               <div
//                 key={product._id}
//                 className="group bg-white rounded-2xl p-4 relative shadow-lg border-2 border-[#E4E3E7] hover:border-[#1D9C7A] transition-all duration-300 hover:shadow-2xl transform hover:scale-101"
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 {/* Wishlist Heart Button */}
//                 <div
//                   onClick={() => {
//                     if (wishlistProductIds.has(product._id)) {
//                       handleRemoveFromWishlist(product._id);
//                       toast.success('Removed from wishlist');
//                     } else {
//                       handleAddToWishlist(product);
//                       toast.success('Added to wishlist');
//                     }
//                   }}
//                   className={`absolute top-4 right-4 z-10 p-2.5 rounded-full cursor-pointer transition-all duration-300 ${
//                     wishlistProductIds.has(product._id)
//                       ? 'bg-[#1D9C7A] shadow-lg scale-110'
//                       : 'bg-white shadow-md hover:bg-[#F3F1EC] hover:scale-110'
//                   }`}
//                 >
//                   {wishlistProductIds.has(product._id) ? (
//                     <FaHeart className="text-xl text-white" />
//                   ) : (
//                     <FaRegHeart className="text-xl text-[#0F172A] hover:text-[#1D9C7A]" />
//                   )}
//                 </div>

//                 {/* Product Image */}
//                 <div 
//                   onClick={() => navigate(`/product/${product._id}`)}
//                   className="w-full h-72 overflow-hidden rounded-xl bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] cursor-pointer mb-4 relative"
//                 >
//                   <img
//                     src={product.image?.[0]?.url}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                     alt={product.name}
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 </div>

//                 {/* Product Info */}
//                 <div className="space-y-3">
//                   {/* Product Name */}
//                   <h3 className="font-bold text-lg text-[#0F172A] group-hover:text-[#1D9C7A] transition-colors duration-300 line-clamp-1 min-h-[28px]">
//                     {product.name}
//                   </h3>

//                   {/* Price Section */}
//                   <div className="flex items-baseline justify-between">
//                     <div className="flex items-baseline gap-2">
//                       <span className="text-2xl font-bold text-[#1D9C7A]">₹{product.price}</span>
//                       {product.originalPrice && (
//                         <span className="text-sm text-[#88C7B3] line-through">₹{product.originalPrice}</span>
//                       )}
//                     </div>
//                     {product.discount && (
//                       <span className="text-xs font-bold text-white bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] px-2 py-1 rounded-full">
//                         {product.discount}% OFF
//                       </span>
//                     )}
//                   </div>

//                   {/* Brand or Category */}
//                   {product.brand && (
//                     <p className="text-xs text-[#88C7B3] font-medium">
//                       Brand: <span className="text-[#0F172A]">{product.brand}</span>
//                     </p>
//                   )}

//                   {/* Add to Cart Button */}
//                   <button
//                     onClick={() => handleAddToCart(product._id)}
//                     className="w-full bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] text-white py-2.5 rounded-lg font-semibold text-sm hover:from-[#88C7B3] hover:via-[#1D9C7A] hover:to-[#88C7B3] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
//                     </svg>
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//     </div>
//   </div>
// </div>



//     <div className="min-h-screen bg-gradient-to-b from-[#F3F1EC] to-white p-4 md:p-6">
//   <div className="container mx-auto">
//     <div className="flex flex-col md:flex-row gap-6">
      
//       {/* LEFT SIDE: Subcategories */}
//       {hasSubCategories && (
//         <div className="w-full md:w-1/4">
//           <div className="md:sticky md:top-24 space-y-3">
//             <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-[#E4E3E7] mb-4">
//               <h3 className="font-bold text-lg text-[#0F172A] mb-1">Categories</h3>
//               <div className="w-16 h-1 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] rounded-full"></div>
//             </div>

//             <div className="space-y-3">
//               {subCategories.map((sub, index) => (
//                 <div
//                   key={sub._id}
//                   className="group bg-white rounded-xl p-3 cursor-pointer border-2 border-[#E4E3E7] hover:border-[#1D9C7A] transition-all duration-300 hover:shadow-xl transform hover:scale-105"
//                   onClick={() => {
//                     console.log("Clicked subcategory:", sub.name, "ID:", sub._id);
//                     fetchProductsBySubcategory(sub._id);
//                   }}
//                   style={{ animationDelay: `${index * 50}ms` }}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="relative flex-shrink-0">
//                       {sub.image?.url ? (
//                         <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] border-2 border-[#E4E3E7] group-hover:border-[#1D9C7A] transition-all duration-300">
//                           <img
//                             src={sub.image.url}
//                             alt={sub.name}
//                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                           />
//                         </div>
//                       ) : (
//                         <div className="w-16 h-16 bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] rounded-lg flex items-center justify-center border-2 border-[#E4E3E7] group-hover:border-[#1D9C7A] transition-all duration-300">
//                           <span className="text-[#88C7B3] text-2xl font-bold">
//                             {sub.name.charAt(0)}
//                           </span>
//                         </div>
//                       )}
//                       <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
//                     </div>
                    
//                     <div className="flex-1">
//                       <p className="font-semibold text-sm text-[#0F172A] group-hover:text-[#1D9C7A] transition-colors duration-300">
//                         {sub.name}
//                       </p>
//                       <div className="w-0 h-0.5 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] group-hover:w-full transition-all duration-300 rounded-full mt-1"></div>
//                     </div>

//                     <svg 
//                       className="w-5 h-5 text-[#88C7B3] group-hover:text-[#1D9C7A] group-hover:translate-x-1 transition-all duration-300" 
//                       fill="none" 
//                       stroke="currentColor" 
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* RIGHT SIDE: Products */}
//       <div className={`${hasSubCategories ? "w-full md:w-3/4" : "w-full"}`}>
//         {products.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-32 h-32 bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] rounded-full flex items-center justify-center mb-6 shadow-lg">
//               <svg className="w-16 h-16 text-[#88C7B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//               </svg>
//             </div>
//             <p className="text-xl font-bold text-[#0F172A] mb-2">No Products Found</p>
//             <p className="text-sm text-[#88C7B3]">Try selecting a different category</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {products.map((product, index) => {
//               // Calculate discount percentage if originalPrice exists
//               const hasDiscount = product.originalPrice && product.originalPrice > product.price;
//               const discountPercentage = hasDiscount 
//                 ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
//                 : 0;

//               return (
//                 <div
//                   key={product._id}
//                   className="group bg-white rounded-2xl p-4 relative shadow-lg border-2 border-[#E4E3E7] hover:border-[#1D9C7A] transition-all duration-300 hover:shadow-2xl transform hover:scale-105"
//                   style={{ animationDelay: `${index * 100}ms` }}
//                 >
//                   {/* Discount Badge on Image */}
//                   {hasDiscount && (
//                     <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-lg animate-pulse">
//                       {discountPercentage}% OFF
//                     </div>
//                   )}

//                   {/* Wishlist Heart Button */}
//                   <div
//                     onClick={() => {
//                       if (wishlistProductIds.has(product._id)) {
//                         handleRemoveFromWishlist(product._id);
//                         toast.success('Removed from wishlist');
//                       } else {
//                         handleAddToWishlist(product);
//                         toast.success('Added to wishlist');
//                       }
//                     }}
//                     className={`absolute top-4 right-4 z-10 p-2.5 rounded-full cursor-pointer transition-all duration-300 ${
//                       wishlistProductIds.has(product._id)
//                         ? 'bg-[#1D9C7A] shadow-lg scale-110'
//                         : 'bg-white shadow-md hover:bg-[#F3F1EC] hover:scale-110'
//                     }`}
//                   >
//                     {wishlistProductIds.has(product._id) ? (
//                       <FaHeart className="text-xl text-white" />
//                     ) : (
//                       <FaRegHeart className="text-xl text-[#0F172A] hover:text-[#1D9C7A]" />
//                     )}
//                   </div>

//                   {/* Product Image */}
//                   <div 
//                     onClick={() => navigate(`/product/${product._id}`)}
//                     className="w-full h-72 overflow-hidden rounded-xl bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] cursor-pointer mb-4 relative"
//                   >
//                     <img
//                       src={product.image?.[0]?.url}
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                       alt={product.name}
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   </div>

//                   {/* Product Info */}
//                   <div className="space-y-3">
//                     {/* Product Name */}
//                     <h3 className="font-bold text-lg text-[#0F172A] group-hover:text-[#1D9C7A] transition-colors duration-300 line-clamp-1 min-h-[28px]">
//                       {product.name}
//                     </h3>

//                     {/* Price Section */}
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         {hasDiscount ? (
//                           <>
//                             {/* New Discounted Price */}
//                             <span className="text-2xl font-bold text-[#1D9C7A]">
//                               ₹{product.price}
//                             </span>
//                             {/* Original Price - Strikethrough */}
//                             <span className="text-base text-[#88C7B3] line-through font-medium">
//                               ₹{product.originalPrice}
//                             </span>
//                           </>
//                         ) : (
//                           /* Regular Price - No Discount */
//                           <span className="text-2xl font-bold text-[#0F172A]">
//                             ₹{product.price}
//                           </span>
//                         )}
//                       </div>

//                       {/* Savings Badge */}
//                       {hasDiscount && (
//                         <div className="flex flex-col items-end">
//                           <span className="text-xs font-bold text-white bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] px-2 py-1 rounded-full">
//                             SAVE ₹{product.originalPrice - product.price}
//                           </span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Brand or Category */}
//                     {product.brand && (
//                       <p className="text-xs text-[#88C7B3] font-medium">
//                         Brand: <span className="text-[#0F172A]">{product.brand}</span>
//                       </p>
//                     )}

//                     {/* Add to Cart Button */}
//                     <button
//                       onClick={() => handleAddToCart(product._id)}
//                       className="w-full bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] text-white py-2.5 rounded-lg font-semibold text-sm hover:from-[#88C7B3] hover:via-[#1D9C7A] hover:to-[#88C7B3] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
//                     >
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
//                       </svg>
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//     </div>
//   </div>
// </div>

<div className="min-h-screen bg-gradient-to-b from-[#F3F1EC] to-white p-4 md:p-6">
  <div className="container mx-auto">
    <div className="flex flex-col md:flex-row gap-6">
      
      {/* LEFT SIDE: Subcategories */}
      {hasSubCategories && (
        <div className="w-full md:w-1/4">
          <div className="md:sticky md:top-24 space-y-3">
            <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-[#E4E3E7] mb-4">
              <h3 className="font-bold text-lg text-[#0F172A] mb-1">Categories</h3>
              <div className="w-16 h-1 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] rounded-full"></div>
            </div>

            <div className="space-y-3">
              {subCategories.map((sub, index) => (
                <div
                  key={sub._id}
                  className="group bg-white rounded-xl p-3 cursor-pointer border-2 border-[#E4E3E7] hover:border-[#1D9C7A] transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                  onClick={() => {
                    console.log("Clicked subcategory:", sub.name, "ID:", sub._id);
                    fetchProductsBySubcategory(sub._id);
                  }}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      {sub.image?.url ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] border-2 border-[#E4E3E7] group-hover:border-[#1D9C7A] transition-all duration-300">
                          <img
                            src={sub.image.url}
                            alt={sub.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] rounded-lg flex items-center justify-center border-2 border-[#E4E3E7] group-hover:border-[#1D9C7A] transition-all duration-300">
                          <span className="text-[#88C7B3] text-2xl font-bold">
                            {sub.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-[#0F172A] group-hover:text-[#1D9C7A] transition-colors duration-300">
                        {sub.name}
                      </p>
                      <div className="w-0 h-0.5 bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] group-hover:w-full transition-all duration-300 rounded-full mt-1"></div>
                    </div>

                    <svg 
                      className="w-5 h-5 text-[#88C7B3] group-hover:text-[#1D9C7A] group-hover:translate-x-1 transition-all duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RIGHT SIDE: Products */}
      <div className={`${hasSubCategories ? "w-full md:w-3/4" : "w-full"}`}>
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-16 h-16 text-[#88C7B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-xl font-bold text-[#0F172A] mb-2">No Products Found</p>
            <p className="text-sm text-[#88C7B3]">Try selecting a different category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => {
              // Calculate discount percentage if originalPrice exists
              const hasDiscount = product.originalPrice && product.originalPrice > product.price;
              const discountPercentage = hasDiscount 
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl p-4 relative shadow-lg border-2 border-[#E4E3E7] hover:border-[#1D9C7A] transition-all duration-300 hover:shadow-2xl transform hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Discount Badge on Image */}
                  {hasDiscount && (
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-lg animate-pulse">
                      {discountPercentage}% OFF
                    </div>
                  )}

                  {/* Wishlist Heart Button */}
                  <div
                    onClick={() => {
                      if (wishlistProductIds.has(product._id)) {
                        handleRemoveFromWishlist(product._id);
                        toast.success('Removed from wishlist');
                      } else {
                        handleAddToWishlist(product);
                        toast.success('Added to wishlist');
                      }
                    }}
                    className={`absolute top-4 right-4 z-10 p-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                      wishlistProductIds.has(product._id)
                        ? 'bg-[#1D9C7A] shadow-lg scale-110'
                        : 'bg-white shadow-md hover:bg-[#F3F1EC] hover:scale-110'
                    }`}
                  >
                    {wishlistProductIds.has(product._id) ? (
                      <FaHeart className="text-xl text-white" />
                    ) : (
                      <FaRegHeart className="text-xl text-[#0F172A] hover:text-[#1D9C7A]" />
                    )}
                  </div>

                  {/* Product Image */}
                  <div 
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="w-full h-72 overflow-hidden rounded-xl bg-gradient-to-br from-[#F3F1EC] to-[#E4E3E7] cursor-pointer mb-4 relative"
                  >
                    <img
                      src={product.image?.[0]?.url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={product.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3">
                    {/* Product Name */}
                    <h3 className="font-bold text-lg text-[#0F172A] group-hover:text-[#1D9C7A] transition-colors duration-300 line-clamp-1 min-h-[28px]">
                      {product.name}
                    </h3>

                    {/* Price Section */}
  {/* Price Section */}
  {/* Price Section */}
<div className="flex items-center justify-between">
  <div className="space-y-1">
    {/* New Price */}
    <div className="text-2xl font-bold text-[#1D9C7A]">
      ₹{product.discount ? (product.price - (product.price * product.discount / 100)).toFixed(2) : product.price}
    </div>
    
    {/* Original Price - Strikethrough */}
    {product.discount && (
      <div className="text-sm text-gray-400 line-through">
        ₹{product.price}
      </div>
    )}
  </div>

  {/* Discount Badge */}
  {product.discount && (
    <span className="text-xs font-bold text-white bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] px-2 py-1 rounded-full">
      {product.discount}% OFF
    </span>
  )}
</div>       


                    {/* Brand or Category */}
                    {product.brand && (
                      <p className="text-xs text-[#88C7B3] font-medium">
                        Brand: <span className="text-[#0F172A]">{product.brand}</span>
                      </p>
                    )}

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="w-full bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] text-white py-2.5 rounded-lg font-semibold text-sm hover:from-[#88C7B3] hover:via-[#1D9C7A] hover:to-[#88C7B3] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  </div>
</div>


  );
};

export default CategoryProduct;
