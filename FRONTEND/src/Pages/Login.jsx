
import React, { useState } from "react";
import { getLogin, getRegister } from "../Api/interceptor";
// import useNavigate from "react-router-dom"
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import AxiosToastError from "../Utils/AxiosToastError";
import about from '../assets/about1.jpg'
import { useAll } from '../GlobalProvider/UsesContext';

const Login = ({ onClose }) => {
    const [isLogin, setLogin] = useState(true)
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: ""
    })

    const navigate = useNavigate()
    const { fetchWishlist, fetchCart } = useAll();

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => {
            return {
                ...prev, [name]: value
            }
        })
    }

    const handleSubmits = async (e) => {
        e.preventDefault()
        try {
            const response = isLogin ? await getLogin(data) : await getRegister(data)
            // console.log(("LoginData", response.data));
            if (response.data.success) {
                toast.success(response.data.message)
                if (isLogin) {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("role", response.data.data.role)
                    localStorage.setItem("user", JSON.stringify(response.data.data))
                    // Fetch wishlist and cart immediately after login so UI reflects server data
                    try {
                        await fetchWishlist();
                    } catch (err) {
                        console.error('Failed to fetch wishlist after login', err);
                    }

                    try {
                        await fetchCart();
                    } catch (err) {
                        console.error('Failed to fetch cart after login', err);
                    }
                }
                onClose()
                if (response.data.data?.role === "Admin") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/")

                }
            }


        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-[900px] h-[500px] rounded-xl shadow-2xl flex overflow-hidden">

                {/* LEFT SIDE IMAGE */}
                <div className="w-1/2 h-full">
                    <img
                        src={about}
                        alt="Auth"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* RIGHT SIDE FORM */}
                <div className="w-1/2 p-6 flex flex-col">

                    {/* TOP ROW (Close Button) */}
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="text-xl font-bold"
                        >
                            ✕
                        </button>
                    </div>

                    {/* CENTER CONTENT */}
                    <div className="flex-1 flex flex-col space-y-12 justify-center">

                        <h2 className="text-2xl font-semibold text-center mb-4">
                            {isLogin ? "Login" : "Register"}
                        </h2>

                        <form onSubmit={handleSubmits} className="flex flex-col gap-3">

                            {!isLogin && (
                                <input
                                    name="name"
                                    placeholder="Name"
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 p-2 rounded 
             hover:border-violet-600 
             focus:border-violet-600 focus:outline-none "
                                />
                            )}

                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                onChange={handleChange}
                                required
                                className="border border-gray-300 p-2 rounded 
             hover:border-violet-600 
             focus:border-violet-600 focus:outline-none"
                            />

                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                autoComplete={isLogin ? "current-password" : "new-password"}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 p-2 rounded 
             hover:border-violet-600 
             focus:border-violet-600 focus:outline-none"
                            />

                            {!isLogin && (
                                <input
                                    name="confirm_password"
                                    type="password"
                                    placeholder="Confirm Password"
                                    autoComplete="new-password"
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 p-2 rounded 
             hover:border-violet-600 
             focus:border-violet-600 focus:outline-none"
                                />
                            )}

                            <button className=" bg-gradient-to-r from-purple-500 to-pink-400 text-white py-2 rounded-md mt-2">
                                {isLogin ? "Login" : "Register"}
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    className="flex items-center justify-center px-4 py-3 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-sm font-medium text-slate-700">Google</span>
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center justify-center px-4 py-3 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span className="text-sm font-medium text-slate-700">Facebook</span>
                                </button>
                            </div>
                        </form>

                        {/* TOGGLE */}
                        <p className="text-center mt-4 text-sm">
                            {isLogin ? "Don’t have an account?" : "Already have an account?"}
                            <span
                                className="text-blue-600 cursor-pointer ml-1 font-semibold"
                                onClick={() => setLogin(!isLogin)}
                            >
                                {isLogin ? "Register" : "Login"}
                            </span>
                        </p>

                    </div>
                </div>
            </div>
        </div>


    );
};


export default Login;
