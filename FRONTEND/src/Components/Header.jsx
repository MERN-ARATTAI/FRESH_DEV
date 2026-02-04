// import React, { useEffect, useState } from 'react'
// import { NavLink, useNavigate } from "react-router-dom";
// import logo from '../assets/NextGen.png'
// import { IoBagCheck } from "react-icons/io5";
// import { FaRegHeart } from "react-icons/fa";
// import { MdOutlineShoppingCart } from "react-icons/md";
// import { IoIosSearch } from "react-icons/io";
// import OfferPage from '../Pages/OfferPage';
// import contact from '../assets/contact.png'
// import Login from '../Pages/Login';
// import { Outlet } from 'react-router-dom';
// import { useAll } from '../GlobalProvider/UsesContext';
// import { getLogout } from '../Api/interceptor';
// import toast from 'react-hot-toast';

// const Header = () => {
//     const { cartCount, Wishlist } = useAll()
//     const [showLogin, setShowLogin] = useState(false);
//     const navigate = useNavigate()
//     const user = JSON.parse(localStorage.getItem("user"));
//     const isLoggedIn = !!localStorage.getItem("token")
//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         if (token) return;

//         // 🔹 show immediately on first visit
//         setShowLogin(true);

//         // 🔹 repeat every 10 sec AFTER close
//         const interval = setInterval(() => {
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 setShowLogin(true);
//             }
//         }, 10000);

//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <>
//             <header className="bg-gray-200 shadow-lg">

//                 {/* Offer Bar */}
//                 <div className="bg-black text-white">
//                     <OfferPage />
//                 </div>

//                 {/* Main Header */}
//                 <div className="p-2">

//                     {/* Top Row */}
//                     <div className="flex items-center justify-between px-7 py-1">

//                         {/* Logo */}
//                         <img src={logo} className="w-25" alt="logo" />

//                         <nav className="hidden md:block">
//                             <ul className="flex justify-center gap-8 text-[17px] font-bold">
//                                 <NavLink to="/">Home</NavLink>
//                                 <NavLink to="/about">About</NavLink>
//                                 <NavLink to="/Product_Page">Product</NavLink>
//                                 <NavLink to="/contact">Contact</NavLink>
//                             </ul>
//                         </nav>

//                         {/* Icons */}
//                         <div className="flex gap-4 justify-center items-center relative group">

//                             <FaRegHeart className='cursor-pointer' onClick={() => navigate("/pages/WishListPage")} size={28} />
//                             {Wishlist.length > 0 && (
//                                 <span className="absolute -top-2 left-6 text-xs bg-pink-500 text-white rounded-full px-1">
//                                     {Wishlist.length}
//                                 </span>

//                             )}




//                             <MdOutlineShoppingCart onClick={() => navigate("/pages/cartPage")} size={28} />
//                             {cartCount > 0 && (
//                                 <span className="absolute text-xs bg-pink-500 rounded-full px-1">
//                                     {cartCount}
//                                 </span>

//                             )}

//                             {!isLoggedIn ? (
//                                 <button
//                                     onClick={() => setShowLogin(true)}
//                                     className="px-4 py-2  rounded-md bg-black text-white font-semibold"
//                                 >
//                                     Login
//                                 </button>
//                             ) : (
//                                 <div className="flex gap-2 mt-1 items-center cursor-pointer group">
//                                     {/* Avatar */}
//                                     <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
//                                         {user?.name?.charAt(0).toUpperCase()}
//                                     </div>

//                                     {/* Username */}

//                                     <span className="text-sm mt-1 font-medium">
//                                         {user?.name}
//                                     </span>


//                                     {/* Dropdown */}
//                                     <div className="
//       absolute top-14 right-0 w-32
//       bg-white shadow-lg rounded-md
//       opacity-0 scale-95 invisible
//       transition-all duration-200
//       group-hover:opacity-100
//       group-hover:scale-100
//       group-hover:visible
//     ">
//                                         <button
//                                             onClick={async () => {
//                                                 try {
//                                                     await getLogout();
//                                                     localStorage.clear();
//                                                     toast.success("Logged out successfully");
//                                                     navigate("/");
//                                                 } catch {
//                                                     toast.error("Logout failed");
//                                                 }
//                                             }}
//                                             className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
//                                         >
//                                             Logout
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Menu */}


//                 </div>
//             </header>

//             {/* Login Popup */}
//             {showLogin && <Login onClose={() => setShowLogin(false)} />}

//         </>

//     )
// }

// export default Header;

import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import logo from '../assets/NextGen.png'
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import OfferPage from '../Pages/OfferPage';
import Login from '../Pages/Login';
import { useAll } from '../GlobalProvider/UsesContext';
import { getLogout } from '../Api/interceptor';
import toast from 'react-hot-toast';

const Header = () => {
    const { cartCount, Wishlist, wishlistCount, clearWishlistLocal, clearCartLocal } = useAll()
    const [showLogin, setShowLogin] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [showLogin]);

    const isLoggedIn = !!localStorage.getItem("token")

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) return;

        setShowLogin(true);

        const interval = setInterval(() => {
            if (!localStorage.getItem("token")) {
                setShowLogin(true);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <header className="bg-white sticky top-0 z-50">

                {/* Offer Bar – Gradient */}
                <div className="bg-gradient-to-r from-[#7B7CFF] via-[#B79CFF] to-[#F4C2F4] text-white">
                    <OfferPage />
                </div>

                {/* Main Header */}
                <div className="px-4 md:px-8 py-3">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <img
                            src={logo}
                            alt="logo"
                            className="w-24 md:w-28 cursor-pointer"
                            onClick={() => navigate("/")}
                        />

                        {/* Navigation */}
                        <nav className="hidden md:flex gap-8 text-[16px] font-semibold text-gray-700">
                            <NavLink className="relative group" to="/">
                                Home
                                <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-gradient-to-r from-blue-500 to-pink-500 transition-all group-hover:w-full"></span>
                            </NavLink>

                            <NavLink className="relative group" to="/about">
                                About
                                <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-gradient-to-r from-blue-500 to-pink-500 transition-all group-hover:w-full"></span>
                            </NavLink>

                            <NavLink className={({ isActive }) => `relative group ${isActive ? 'text-blue-600' : 'text-gray-700'}`} to="/Product_Page">
                                Product
                                <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-gradient-to-r from-blue-500 to-pink-500 transition-all group-hover:w-full"></span>
                            </NavLink>

                            <NavLink className="relative group" to="/contact">
                                Contact
                                <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-gradient-to-r from-blue-500 to-pink-500 transition-all group-hover:w-full"></span>
                            </NavLink>
                        </nav>


                        {/* Icons + Auth */}
                        <div className="flex items-center gap-4 md:gap-6 relative">

                            {/* Wishlist */}
                            <div className="relative cursor-pointer">
                                <FaRegHeart
                                    size={26}
                                    className="text-gray-700 hover:text-pink-500"
                                    onClick={() => navigate("/pages/WishListPage")}
                                />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-2 text-xs bg-pink-500 text-white rounded-full px-1">
                                        {wishlistCount}
                                    </span>
                                )}
                            </div>

                            {/* Cart */}
                            <div className="relative cursor-pointer">
                                <MdOutlineShoppingCart
                                    size={26}
                                    className="text-gray-700 hover:text-pink-500"
                                    onClick={() => navigate("/pages/cartPage")}
                                />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 text-xs bg-pink-500 text-white rounded-full px-1">
                                        {cartCount}
                                    </span>
                                )}
                            </div>

                            {/* Login / User */}
                            {!isLoggedIn ? (
                                <button
                                    onClick={() => setShowLogin(true)}
                                    className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold hover:opacity-90 transition"
                                >
                                    Login
                                </button>
                            ) : (
                                <div className="relative group flex items-center gap-2 cursor-pointer">

                                    {/* Avatar */}
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 text-white flex items-center justify-center font-bold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>

                                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                                        {user?.name}
                                    </span>

                                    {/* Dropdown */}
                                    <div className="absolute top-12 right-0 w-40 bg-white shadow-lg rounded-md opacity-0 scale-95 invisible transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-hover:visible">
                                        <button
                                            onClick={() => navigate('/my-orders')}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                                        >
                                            My Orders
                                        </button>

                                        <button
                                            onClick={async () => {
                                                try {
                                                    // Clear only local wishlist and cart state; do not wipe server wishlist on logout
                                                    clearWishlistLocal();
                                                    clearCartLocal();
                                                    await getLogout();
                                                    localStorage.clear();
                                                    toast.success("Logged out successfully");
                                                    navigate("/");
                                                } catch {
                                                    toast.error("Logout failed");
                                                }
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {showLogin && <Login onClose={() => setShowLogin(false)} />}
            {/* <Outlet /> */}
        </>
    )
}

export default Header;
