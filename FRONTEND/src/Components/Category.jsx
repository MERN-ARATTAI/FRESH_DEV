// import React, { useMemo, useState } from 'react'
// import { FiChevronRight } from "react-icons/fi";
// import { FiChevronLeft } from "react-icons/fi";
// import { getData } from '../Api/interceptor'
// import { Link, Outlet } from 'react-router-dom'

// const ITEM_WIDTH = 100
// const CategoryCart = () => {

//     const [cart, setCart] = useState([])
//     const fetchData = async () => {
//         try {
//             const responseData = await getData() 
//             // console.log("response", responseData);   
//             setCart(responseData.data.data)

//         } catch (error) {
//             console.log("ERROR", error.message)

//         }
//     }
//     useMemo(() => {
//         fetchData()
//     }, [])

//     return (
//         <div className="h-[30vh] mt-5 mb-5 flex flex-col items-center justify-center">


//             {/* Row layout: arrow | slider | arrow */}
//             <div className="flex justify-center items-center gap-25 ">
//                 {/* Left Arrow */}



//                 {cart.map((item) => (
//                     <Link
//                     to={`/sub-cat/${item.name}`}
//                     key={item._id}
//                     className=" flex flex-col items-center justify-center  shrink-0"
//                     >
//                         {/* neglect object-cover in img */}
//                         <img
//                             src={item.image.url}
//                             alt={item.name}
//                             className="w-[130px] h-[130px] rounded-full"      
//                             />
//                         <p className="text-center mt-2 font-semibold text-sm">
//                             {item.name}
//                         </p>
//                     </Link>
//                 ))}



//                 {/* Right Arrow */}

//             </div>

//         </div>
//     );
// };

// export default CategoryCart

import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { useAll } from "../GlobalProvider/UsesContext";

const CategoryCart = () => {
  const { Category } = useAll()



  return (
    <div className="w-full py-6">
      {/* Scroll container */}
      <div className="flex gap-6 overflow-x-auto px-4 scrollbar-hide md:justify-center">
        {Category && Category.length > 0 ? (
          Category.map((item) => (
            <Link
              to={`/category/${item.name}/${item._id}`}
              key={item._id}
              className="flex flex-col items-center shrink-0"
            >
              {/* Responsive Circle */}
              <div className="
                w-17.5 h-17.5
                sm:w-22.5 sm:h-22.5
                md:w-27.5 md:h-27.5
                lg:w-32.5 lg:h-32.5
                rounded-full overflow-hidden shadow bg-gray-200"
              >
                {item.image?.url ? (
                  <img
                    src={item.image.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <p className="mt-2 text-xs sm:text-sm md:text-base font-semibold text-center">
                {item.name}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500 w-full">No categories available</p>
        )}
      </div>
    </div>
  );
};

export default CategoryCart;






// const [index, setIndex] = useState(0);
// const next = () => {
//     if (index < cart.length - 1) {
//         setIndex(index + 1);
//     }
// }
// const prev = () => {
//     if (index > 0) {
//         setIndex(index - 1);
//     }
// };