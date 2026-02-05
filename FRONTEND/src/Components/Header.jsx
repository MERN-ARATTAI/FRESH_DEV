

import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import menzo from '../assets/Menzo.png'
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import OfferPage from '../Pages/OfferPage';
import Login from '../Pages/Login';
import { useAll } from '../GlobalProvider/UsesContext';
import { getLogout } from '../Api/interceptor';
import toast from 'react-hot-toast';

const Header = () => {


    const [rotateY, setRotateY] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRotateY(prev => prev + 180);
        }, 3000); // rotate every 2s

        return () => clearInterval(interval);
    }, []);







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
        // <>
        //     <header className="bg-white sticky top-0 z-50">

        //         {/* Offer Bar – Gradient */}
        //         <div className="bg-gradient-to-r from-[#7B7CFF] via-[#B79CFF] to-[#F4C2F4] text-white">
        //             <OfferPage />
        //         </div>

        //         {/* Main Header */}
        //         <div className="px-4 md:px-8 py-3">
        //             <div className="flex items-center justify-between">

        //                 {/* Logo */}
        //                 <img
        //                     src={logo}
        //                     alt="logo"
        //                     className="w-24 md:w-28 cursor-pointer"
        //                     onClick={() => navigate("/")}
        //                 />

        //                 {/* Navigation */}
        //                 <nav className="hidden md:flex gap-8 text-[16px] font-semibold text-gray-700">
        //                     <NavLink className="relative group" to="/">
        //                         Home
        //                         <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-gradient-to-r from-blue-500 to-pink-500 transition-all group-hover:w-full"></span>
        //                     </NavLink>

        //                     <NavLink className="relative group" to="/about">
        //                         About
        //                         <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-gradient-to-r from-blue-500 to-pink-500 transition-all group-hover:w-full"></span>
        //                     </NavLink>

        //                     <NavLink className={({ isActive }) => `relative group ${isActive ? 'text-blue-600' : 'text-gray-700'}`} to="/Product_Page">
        //                         Product
        //                         <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-gradient-to-r from-blue-500 to-pink-500 transition-all group-hover:w-full"></span>
        //                     </NavLink>

        //                     <NavLink className="relative group" to="/contact">
        //                         Contact
        //                         <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-gradient-to-r from-blue-500 to-pink-500 transition-all group-hover:w-full"></span>
        //                     </NavLink>
        //                 </nav>


        //                 {/* Icons + Auth */}
        //                 <div className="flex items-center gap-4 md:gap-6 relative">

        //                     {/* Wishlist */}
        //                     <div className="relative cursor-pointer">
        //                         <FaRegHeart
        //                             size={26}
        //                             className="text-gray-700 hover:text-pink-500"
        //                             onClick={() => navigate("/pages/WishListPage")}
        //                         />
        //                         {wishlistCount > 0 && (
        //                             <span className="absolute -top-2 -right-2 text-xs bg-pink-500 text-white rounded-full px-1">
        //                                 {wishlistCount}
        //                             </span>
        //                         )}
        //                     </div>

        //                     {/* Cart */}
        //                     <div className="relative cursor-pointer">
        //                         <MdOutlineShoppingCart
        //                             size={26}
        //                             className="text-gray-700 hover:text-pink-500"
        //                             onClick={() => navigate("/pages/cartPage")}
        //                         />
        //                         {cartCount > 0 && (
        //                             <span className="absolute -top-2 -right-2 text-xs bg-pink-500 text-white rounded-full px-1">
        //                                 {cartCount}
        //                             </span>
        //                         )}
        //                     </div>

        //                     {/* Login / User */}
        //                     {!isLoggedIn ? (
        //                         <button
        //                             onClick={() => setShowLogin(true)}
        //                             className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold hover:opacity-90 transition"
        //                         >
        //                             Login
        //                         </button>
        //                     ) : (
        //                         <div className="relative group flex items-center gap-2 cursor-pointer">

        //                             {/* Avatar */}
        //                             <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 text-white flex items-center justify-center font-bold">
        //                                 {user?.name?.charAt(0).toUpperCase()}
        //                             </div>

        //                             <span className="hidden sm:block text-sm font-medium text-gray-700">
        //                                 {user?.name}
        //                             </span>

        //                             {/* Dropdown */}
        //                             <div className="absolute top-12 right-0 w-40 bg-white shadow-lg rounded-md opacity-0 scale-95 invisible transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-hover:visible">
        //                                 <button
        //                                     onClick={() => navigate('/my-orders')}
        //                                     className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
        //                                 >
        //                                     My Orders
        //                                 </button>

        //                                 <button
        //                                     onClick={async () => {
        //                                         try {
        //                                             // Clear only local wishlist and cart state; do not wipe server wishlist on logout
        //                                             clearWishlistLocal();
        //                                             clearCartLocal();
        //                                             await getLogout();
        //                                             localStorage.clear();
        //                                             toast.success("Logged out successfully");
        //                                             navigate("/");
        //                                         } catch {
        //                                             toast.error("Logout failed");
        //                                         }
        //                                     }}
        //                                     className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
        //                                 >
        //                                     Logout
        //                                 </button>
        //                             </div>
        //                         </div>
        //                     )}
        //                 </div>
        //             </div>
        //         </div>
        //     </header>

        //     {showLogin && <Login onClose={() => setShowLogin(false)} />}
        //     {/* <Outlet /> */}
        // </>    

        <>
            <header className="bg-white sticky top-0 z-50">

                {/* Offer Bar – Gradient */}
                <div className="bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] text-[#0F172A]">
                    <OfferPage />
                </div>

                {/* Main Header */}
                <div className="px-4 md:px-6 py-2">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        {/* <img
                            src={menzo}
                            alt="logo"
                            className="w-14 md:w-16 cursor-pointer"
                            onClick={() => navigate("/")}
                        /> */}
                        <img
                            src={menzo}
                            alt="logo"
                            className="w-14 md:w-14 transition-transform duration-[2500ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                            style={{
                                transform: `perspective(1400px) rotateY(${rotateY}deg)`,
                                transformStyle: "preserve-3d",
                            }}
                        />




                        {/* Navigation */}
                        <nav className="hidden md:flex pl-30  gap-8 text-[18px] font-semibold text-[#0F172A]">
                            <NavLink className="relative group" to="/">
                                Home
                                <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] transition-all group-hover:w-full"></span>
                            </NavLink>

                            <NavLink className="relative group" to="/about">
                                About
                                <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] transition-all group-hover:w-full"></span>
                            </NavLink>

                            <NavLink className={({ isActive }) => `relative group ${isActive ? 'text-[#1D9C7A]' : 'text-[#0F172A]'}`} to="/Product_Page">
                                Product
                                <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] transition-all group-hover:w-full"></span>
                            </NavLink>

                            <NavLink className="relative group" to="/contact">
                                Contact
                                <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] transition-all group-hover:w-full"></span>
                            </NavLink>
                        </nav>




                        {/* Icons + Auth */}
                        <div className="flex items-center gap-4 md:gap-6 relative">

                            {/* Wishlist */}
                            <div className="relative cursor-pointer">
                                <FaRegHeart
                                    size={24}
                                    className="text-[#0F172A] hover:text-[#1D9C7A]"
                                    onClick={() => navigate("/pages/WishListPage")}
                                />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-2 text-xs bg-[#1D9C7A] text-white rounded-full px-1">
                                        {wishlistCount}
                                    </span>
                                )}
                            </div>

                            {/* Cart */}
                            <div className="relative cursor-pointer">
                                <MdOutlineShoppingCart
                                    size={24}
                                    className="text-[#0F172A] hover:text-[#1D9C7A]"
                                    onClick={() => navigate("/pages/cartPage")}
                                />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 text-xs bg-[#1D9C7A] text-white rounded-full px-1">
                                        {cartCount}
                                    </span>
                                )}
                            </div>

                            {/* Login / User */}
                            {!isLoggedIn ? (
                                <button
                                    onClick={() => setShowLogin(true)}
                                    className="px-4 py-2 rounded-md bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white font-semibold hover:opacity-90 transition"
                                >
                                    Login
                                </button>
                            ) : (
                                <div className="relative group flex items-center gap-2 cursor-pointer">

                                    {/* Avatar */}
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1D9C7A] to-[#88C7B3] text-white flex items-center justify-center font-bold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>

                                    <span className="hidden sm:block text-sm font-medium text-[#0F172A]">
                                        {user?.name}
                                    </span>

                                    {/* Dropdown */}
                                    <div className="absolute top-12 right-0 w-40 bg-white shadow-lg rounded-md opacity-0 scale-95 invisible transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-hover:visible">
                                        <button
                                            onClick={() => navigate('/my-orders')}
                                            className="w-full text-left px-4 py-2 hover:bg-[#BEDCD0] text-[#0F172A]"
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
                                            className="w-full text-left px-4 py-2 hover:bg-[#BEDCD0] text-[#1D9C7A]"
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
