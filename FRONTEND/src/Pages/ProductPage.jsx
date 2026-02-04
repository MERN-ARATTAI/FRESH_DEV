// import React, { useMemo, useState } from 'react'
// import { getsubcategory } from '../Api/interceptor'
// import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
// import { CiHeart } from "react-icons/ci";
// import { FaHeart } from "react-icons/fa";
// import { useAll } from '../GlobalProvider/UsesContext';



// const SubCategoryPage = () => {

//     const { addCart } = useAll()

//     const { categoryName } = useParams()
//     // console.log("subcat", categoryName);


//     const [product, setProduct] = useState([])

//     const ProductData = async () => {
//         try {
//             const responseData = await getsubcategory(categoryName)
//             // console.log("ResponseData", responseData);
//             setProduct(responseData.data.data)
//         } catch (error) {
//             console.log("ERROR", error.message)

//         }
// }
//     useMemo(() => {
//         if (categoryName) ProductData()

//     }, [categoryName])
//     const navigate = useNavigate();

//     return (
//         <div className='h-[25vh] flex justify-center items-center mt-5'>

//             <div className=" flex gap-3 text-black">
//                 {product.map((item) => (
//                     <div

//                         key={item._id} className="w-50 h-27.5 m-2 p-1  overflow-hidden flex flex-col  justify-center items-center ">


//                         <img
//                             onClick={() => navigate(`/sub-cat/${categoryName}/${item._id}`)}
//                             src={item.image.url || "/no-image.png"}
//                             className='w-18.75 h-18.75 object-cover rounded-full'

//                         />

//                         <p className="text-center text-black text-sm mt-1 truncate w-full">
//                             {item.name}
//                         </p>


//                     </div>
//                 ))}
//                 <Outlet />
//             </div>


//         </div>
//     )
// }

// export default SubCategoryPage

