
import React, { useEffect, useState } from "react";
import { getLogin, getRegister } from "../Api/interceptor";
// import useNavigate from "react-router-dom"
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import AxiosToastError from "../Utils/AxiosToastError";
import about from '../assets/about1.jpg'
import { useAll } from '../GlobalProvider/UsesContext';
import menzo from '../assets/Menzo.png'

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
        
        if (response.data.success) {
            toast.success(response.data.message)
           
            if (isLogin) {
                // Login successful - store data and redirect
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
                
                onClose()
                
                
            } else {
                // Registration successful - switch to login form
                // Keep email and password, only clear name and confirm_password
                setLogin(true);
                setData({
                    name: "",
                    email: data.email,
                    password: data.password,
                    confirm_password: ""
                })
            }
        }

    } catch (error) {
        AxiosToastError(error)
    }
}
 const [rotateY, setRotateY] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRotateY(prev => prev + 180);
        }, 3000); // rotate every 2s

        return () => clearInterval(interval);
    }, []);

    return (
       

<div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div className="bg-white w-full max-w-[900px] h-auto sm:h-[600px] rounded-2xl shadow-2xl flex flex-col sm:flex-row overflow-hidden relative animate-in">
    
    {/* Decorative gradient border */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] p-[2px] pointer-events-none">
      <div className="w-full h-full bg-white rounded-2xl"></div>
    </div>

    {/* LEFT SIDE IMAGE */}
    <div className="relative w-full sm:w-1/2 h-48 sm:h-full overflow-hidden">
      <img
        src={about}
        alt="Auth"
        className="w-full h-full object-cover"
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1D9C7A]/20 to-[#88C7B3]/20"></div>
      
      {/* Logo or branding badge */}
      <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
        <span className="text-[#1D9C7A] font-bold text-sm">Welcome Back</span>
      </div>
    </div>

    {/* RIGHT SIDE FORM */}
    <div className="relative w-full sm:w-1/2 p-6 sm:p-8 flex flex-col bg-white">

      {/* TOP ROW (Close Button) */}
      <div className="flex justify-end mb-2">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-[#F3F1EC] hover:bg-[#E4E3E7] text-[#0F172A] flex items-center justify-center transition-all duration-300 hover:rotate-90"
        >
          <svg className="w-4 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* CENTER CONTENT */}
      <div className="flex-1 flex flex-col justify-center">

        {/* Title with icon */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14  mb-2 shadow-2xl">
            <img
                     src={menzo}
                     alt="logo"
                     className="w-14 md:w-14 transition-transform duration-[2500ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                     style={{
                       transform: `perspective(1400px) rotateY(${rotateY}deg)`,
                       transformStyle: "preserve-3d",
                     }}
                     
                   />
             
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A]">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>
          <p className="text-sm text-[#88C7B3] mt-1 mb-2">
            {isLogin ? "Login to continue your journey" : "Join us today and start shopping"}
          </p>
        </div>

        <form onSubmit={handleSubmits} className="flex flex-col gap-3.5">

          {!isLogin && (
            <div className="relative">
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
                className="w-full border-2 border-[#E4E3E7] p-3 pl-10 rounded-lg 
                  hover:border-[#88C7B3] 
                  focus:border-[#1D9C7A] focus:outline-none
                  transition-all duration-300"
              />
              <svg className="w-5 h-5 text-[#88C7B3] absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}

          <div className="relative">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="w-full border-2 border-[#E4E3E7] p-3 pl-10 rounded-lg 
                hover:border-[#88C7B3] 
                focus:border-[#1D9C7A] focus:outline-none
                transition-all duration-300"
            />
            <svg className="w-5 h-5 text-[#88C7B3] absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <div className="relative">
            <input
              name="password"
              type="password"
              placeholder="Password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              onChange={handleChange}
              required
              className="w-full border-2 border-[#E4E3E7] p-3 pl-10 rounded-lg 
                hover:border-[#88C7B3] 
                focus:border-[#1D9C7A] focus:outline-none
                transition-all duration-300"
            />
            <svg className="w-5 h-5 text-[#88C7B3] absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {!isLogin && (
            <div className="relative">
              <input
                name="confirm_password"
                type="password"
                placeholder="Confirm Password"
                autoComplete="new-password"
                onChange={handleChange}
                required
                className="w-full border-2 border-[#E4E3E7] p-3 pl-10 rounded-lg 
                  hover:border-[#88C7B3] 
                  focus:border-[#1D9C7A] focus:outline-none
                  transition-all duration-300"
              />
              <svg className="w-5 h-5 text-[#88C7B3] absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}

          <button className="bg-gradient-to-r from-[#1D9C7A] via-[#88C7B3] to-[#BEDCD0] text-white font-semibold py-3 rounded-lg mt-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            {isLogin ? "Login" : "Create Account"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-[#E4E3E7]"></div>
            <span className="text-xs text-[#88C7B3] font-medium">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-[#E4E3E7]"></div>
          </div>

          {/* Social Buttons */}
          {/* <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2.5 border-2 border-[#E4E3E7] rounded-lg hover:border-[#88C7B3] hover:bg-[#F3F1EC] transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm font-medium text-[#0F172A]">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2.5 border-2 border-[#E4E3E7] rounded-lg hover:border-[#88C7B3] hover:bg-[#F3F1EC] transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm font-medium text-[#0F172A]">Facebook</span>
            </button>
          </div> */}
        </form>

      </div>

      {/* TOGGLE - Moved outside flex-1 container */}
      <p className="text-center mt-1 text-sm text-[#0F172A]">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <span
          className="text-[#1D9C7A] cursor-pointer ml-1 font-bold hover:text-[#88C7B3] transition-colors"
          onClick={() => setLogin(!isLogin)}
        >
          {isLogin ? "Register" : "Login"}
        </span>
      </p>
    </div>
  </div>
</div>


    );
};


export default Login;
