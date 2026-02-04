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
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* LEFT SIDE: Subcategories */}
      {hasSubCategories && (
        <div className="w-full md:w-1/4 flex flex-col gap-4 md:sticky md:top-38 self-start">
          {subCategories.map(sub => (
            <div
              key={sub._id}
              className="cursor-pointer hover:shadow-lg transition p-2 flex items-center gap-3"
              onClick={() => {
                console.log("Clicked subcategory:", sub.name, "ID:", sub._id);
                fetchProductsBySubcategory(sub._id);
              }}
            >
              {sub.image?.url ? (
                <img
                  src={sub.image.url}
                  alt={sub.name}
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                  No Image
                </div>
              )}
              <p className="text-sm font-medium">{sub.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* RIGHT SIDE: Products */}
      <div
        className={`
    ${hasSubCategories ? "w-full md:w-3/4" : "w-full"}
   grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8
  `}
      >
        {products.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No products found.
          </p>
        ) : (
          products.map(product => (
            <div
              key={product._id}
              className="
          bg-white rounded-2xl p-4 relative
          shadow-md hover:shadow-xl
          transition-all duration-300
        "
            >
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
                className={`
                  absolute top-4 right-4 z-10
                  p-2 rounded-full cursor-pointer
                  backdrop-blur bg-white/90
                  shadow-md transition
                  ${wishlistProductIds.has(product._id)
                    ? "ring-2 ring-pink-400"
                    : ""
                  }
                `}
              >
                {wishlistProductIds.has(product._id) ? (
                  <FaHeart className="text-xl text-pink-500" />
                ) : (
                  <FaRegHeart className="text-xl text-gray-500 hover:text-pink-500" />
                )}
              </div>

              <img
                onClick={() => navigate(`/product/${product._id}`)}
                src={product.image?.[0]?.url}
                className="w-full h-80 object-cover rounded-xl cursor-pointer"
                alt={product.name}
              />

              <p className="mt-3 font-semibold text-center">{product.name}</p>
              <p className="text-sm text-gray-600 text-center">₹{product.price}</p>

              <button
                onClick={() => handleAddToCart(product._id)}
                className="
            mt-3 w-full px-4 py-2 rounded-lg
            text-white font-semibold text-sm
            bg-gradient-to-r from-[#7b7cff] via-[#b695ff] to-[#f3b3ff]
            hover:opacity-90 transition
          "
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>

    </div>


  );
};

export default CategoryProduct;
