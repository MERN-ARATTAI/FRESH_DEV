// import React, { useEffect, useState } from 'react'
// import { getCart, removeCartItem, updateCartqty } from '../Api/interceptor';
// import AxiosToastError from '../Utils/AxiosToastError';
// import { useAll } from '../GlobalProvider/UsesContext';

// const CartPage = () => {
//     const { setCartCount } = useAll()
//     const [cartItems, setCartItems] = useState([]);
//     const [totalAmount, setTotalAmount] = useState(0);
//     const [loading, setLoading] = useState(true);

//     const fetchCart = async () => {
//         try {
//             const res = await getCart();
//             setCartItems(res.data || [])
//             setTotalAmount(res.totalAmount || 0)
//             // console.log("fetchCart", res);
//             // console.log("fetchCart", res);
//             // ✅ update global cart count HERE
//             setCartCount(Array.isArray(res.data) ? res.data.length : 0);


//         } catch (error) {
//             AxiosToastError(error)

//         } finally {
//             setLoading(false)
//         }
//     }
//     useEffect(() => {
//         fetchCart()
//     }, [])

//     const increaseQty = async (item) => {
//         await updateCartqty(item._id, item.quantity + 1);
//         fetchCart();
//     };

//     const decreaseQty = async (item) => {
//         if (item.quantity === 1) return;
//         await updateCartqty(item._id, item.quantity - 1);
//         fetchCart();
//     };

//     const removeItem = async (cartItemId) => {
//         try {
//             const res = await removeCartItem(cartItemId);

//             if (!res.success) return;

//             await fetchCart()// 👈 backend truth


//         } catch (error) {
//             AxiosToastError(error);
//         }
//     };
//     return (
//         <div className="max-w-5xl mx-auto p-6">
//             <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

//             {Array.isArray(cartItems) && cartItems
//                 .filter(item => item.product)
//                 .map((item) => (
//                     <div
//                         key={item._id}
//                         className="flex items-center gap-6 border p-4 mb-4"
//                     >
//                         <img
//                             src={item.product.image?.[0]?.url}
//                             alt={item.product.name}
//                             className="w-24 h-24 object-cover"
//                         />

//                         <div className="flex-1">
//                             <p className="font-semibold">{item.product.name}</p>
//                             <p>₹{item.product.price}</p>

//                             <div className="flex items-center gap-3 mt-2">
//                                 <button
//                                     onClick={() => decreaseQty(item)}
//                                     className="px-3 py-1 border"
//                                 >
//                                     -
//                                 </button>
//                                 <span>{item.quantity}</span>
//                                 <button
//                                     onClick={() => increaseQty(item)}
//                                     className="px-3 py-1 border"
//                                 >
//                                     +
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="text-right">
//                             <p className="font-semibold">₹{item.totalPrice}</p>
//                             <button
//                                 onClick={() => removeItem(item._id)}
//                                 className="text-red-500 mt-2"
//                             >
//                                 Remove
//                             </button>
//                         </div>
//                     </div>
//                 ))}

//             <div className="text-right mt-6">
//                 <h2 className="text-xl font-bold">
//                     Total: ₹{Number(totalAmount) || 0}
//                 </h2>
//                 <button className="bg-black text-white px-6 py-2 mt-4">
//                     Checkout
//                 </button>
//             </div>
//         </div>
//     )
// }

// export default CartPage  


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
    // <div className="min-h-screen bg-white">
    //   <div className="max-w-5xl mx-auto px-4 py-10">

    //     <h1 className="text-3xl font-bold mb-8 text-[#1F3A93]">
    //       Your Cart
    //     </h1>

    //     {Array.isArray(cartItems) && cartItems
    //       .filter(item => item.product)
    //       .map((item) => (
    //         <div
    //           key={item._id}
    //           className="
    //             flex flex-col sm:flex-row items-center gap-6
    //             bg-white rounded-2xl
    //             shadow-md hover:shadow-lg
    //             transition p-4 mb-6
    //           "
    //         >
    //           {/* Image */}
    //           <img
    //             src={item.product.image?.[0]?.url}
    //             alt={item.product.name}
    //             className="w-24 h-24 rounded-xl object-cover bg-gray-100"
    //           />

    //           {/* Info */}
    //           <div className="flex-1 w-full">
    //             <p className="font-semibold text-lg text-gray-800">
    //               {item.product.name}
    //             </p>
    //             <p className="text-gray-600 mt-1">
    //               ₹{item.product.price}
    //             </p>

    //             {/* Quantity */}
    //             <div className="flex items-center gap-3 mt-3">
    //               <button
    //                 onClick={() => decreaseQty(item)}
    //                 className="
    //                   w-8 h-8 rounded-md
    //                   border border-gray-300
    //                   hover:bg-gray-100 transition
    //                 "
    //               >
    //                 −
    //               </button>

    //               <span className="font-semibold">
    //                 {item.quantity}
    //               </span>

    //               <button
    //                 onClick={() => increaseQty(item)}
    //                 className="
    //                   w-8 h-8 rounded-md
    //                   border border-gray-300
    //                   hover:bg-gray-100 transition
    //                 "
    //               >
    //                 +
    //               </button>
    //             </div>
    //           </div>

    //           {/* Price & Remove */}
    //           <div className="text-right">
    //             <p className="font-bold text-lg text-gray-900">
    //               ₹{item.totalPrice}
    //             </p>
    //             <button
    //               onClick={() => removeItem(item._id)}
    //               className="text-red-500 text-sm mt-2 hover:underline"
    //             >
    //               Remove
    //             </button>
    //           </div>
    //         </div>
    //       ))}

    //     {/* Summary */}
    //     <div className="
    //       mt-10 p-6 rounded-2xl
    //       bg-gradient-to-r from-[#7b7cff]/10 via-[#b695ff]/10 to-[#f3b3ff]/10
    //       flex flex-col sm:flex-row
    //       items-center justify-between gap-6
    //     ">
    //       <h2 className="text-2xl font-bold text-gray-900">
    //         Total: ₹{Number(totalAmount) || 0}
    //       </h2>

    //       <button className="
    //         px-8 py-3 rounded-xl
    //         text-white font-semibold
    //         bg-gradient-to-r from-[#7b7cff] via-[#b695ff] to-[#f3b3ff]
    //         hover:opacity-90 transition
    //       ">
    //         Checkout
    //       </button>
    //     </div>

    //   </div>
    // </div>
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-10 text-[#1F3A93]">
          Your Cart
        </h1>

        {Array.isArray(cartItems) && cartItems
          .filter(item => item.product)
          .map((item) => (
            <div
              key={item._id}
              className="
            flex flex-col sm:flex-row items-center gap-6
            bg-white rounded-2xl
            border border-gray-100
            shadow-sm hover:shadow-md
            transition p-5 mb-6
          "
            >
              {/* Image */}
              <img
                src={item.product.image?.[0]?.url}
                alt={item.product.name}
                className="
              w-24 h-24 rounded-xl
              object-cover bg-gray-100
            "
              />

              {/* Info */}
              <div className="flex-1 w-full">
                <p className="font-semibold text-lg text-gray-900">
                  {item.product.name}
                </p>
                <p className="text-gray-500 mt-1">
                  ₹{item.product.price}
                </p>

                {/* Quantity */}
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={() => decreaseQty(item)}
                    className="
                  w-9 h-9 rounded-lg
                  border border-gray-300
                  text-gray-700
                  hover:bg-gray-100
                  transition
                "
                  >
                    −
                  </button>

                  <span className="font-semibold text-gray-900">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQty(item)}
                    className="
                  w-9 h-9 rounded-lg
                  border border-gray-300
                  text-gray-700
                  hover:bg-gray-100
                  transition
                "
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price & Remove */}
              <div className="text-right">
                <p className="font-bold text-lg text-[#1F3A93]">
                  ₹{item.totalPrice}
                </p>
                <button
                  onClick={() => removeItem(item._id)}
                  className="
    mt-2 px-4 py-1.5
    text-sm font-medium text-white
    rounded-full
    bg-gradient-to-r from-[#7B7CFF] via-[#B695FF] to-[#F3B3FF]
    shadow-sm
    hover:opacity-90
    hover:shadow-md
    transition-all
  "
                >
                  Remove
                </button>

              </div>
            </div>
          ))}

        {/* Summary */}
        <div
          className="
        mt-12 p-6 rounded-2xl
        bg-gradient-to-r
        from-[#7C7BFF]/15
        via-[#B9A4FF]/15
        to-[#F4B6FF]/15
        flex flex-col sm:flex-row
        items-center justify-between gap-6
      "
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Total: ₹{Number(totalAmount) || 0}
          </h2>

          <button            onClick={() => navigate("/pages/address", { state: { fromCheckout: true, returnTo: '/checkout' } })}            className="
          px-10 py-3 rounded-xl
          text-white font-semibold
          bg-gradient-to-r
          from-[#7C7BFF]
          via-[#B9A4FF]
          to-[#F4B6FF]
          hover:opacity-90
          shadow-md
          transition
        "
          >
            Checkout
          </button>
        </div>

      </div>
    </div>




  )
}

export default CartPage
