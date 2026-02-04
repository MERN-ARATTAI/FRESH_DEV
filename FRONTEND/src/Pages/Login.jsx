
import React, { useState } from "react";
import { getLogin, getRegister } from "../Api/interceptor";
// import useNavigate from "react-router-dom"
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import AxiosToastError from "../Utils/AxiosToastError";
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
            <div className="bg-white w-[400px] rounded-xl p-6 relative shadow-2xl">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-xl font-bold"
                >
                    ✕
                </button>

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
                            className="border p-2 rounded"
                        />
                    )}

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className="border p-2 rounded"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        autoComplete={isLogin ? "current-password" : "new-password"}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded"
                    />

                    {!isLogin && (
                        <input
                            name="confirm_password"
                            type="password"
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                            onChange={handleChange}
                            required
                            className="border p-2 rounded"
                        />
                    )}

                    <button className="bg-black text-white py-2 rounded-md mt-2">
                        {isLogin ? "Login" : "Register"}
                    </button>
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
    );
};


export default Login;
