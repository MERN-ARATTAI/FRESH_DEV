import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

import logo from "../assets/about1.jpg";



const Login = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('📝 Form submitted with:', credentials);
      await login(credentials);
      console.log('✅ Login completed');
    } catch (error) {
      console.error('❌ Login error in form:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (

    
//  <>
//    <div>
// <img src={logo} alt="image" /> 
//    </div>

//     <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center p-4">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute inset-0" style={{
//           backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
//           backgroundSize: '40px 40px'
//         }}></div>
//       </div>

//       {/* Login Card */}
//       <div className="relative w-full max-w-md">
//         <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-in">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-10 text-center">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
//               <ShieldCheck className="w-8 h-8 text-white" />
//             </div>
//             <h1 className="text-3xl font-display font-bold text-white mb-2">
//               Admin Portal
//             </h1>
//             <p className="text-primary-100 text-sm">
//               E-Commerce Platform Management
//             </p>
//           </div>

//           {/* Form */}
//           <div className="px-8 py-10">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Email */}
//               <div>
//                 <label className="label">Email Address</label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="email"
//                     name="email"
//                     value={credentials.email}
//                     onChange={handleChange}
//                     placeholder="admin@example.com"
//                     className="input pl-10"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="label">Password</label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="password"
//                     name="password"
//                     value={credentials.password}
//                     onChange={handleChange}
//                     placeholder="Enter your password"
//                     className="input pl-10"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full btn btn-primary py-3 text-lg font-semibold"
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
//                     Signing in...
//                   </span>
//                 ) : (
//                   'Sign In'
//                 )}
//               </button>
//             </form>

//             {/* Demo Credentials Info */}
//             <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
//               <p className="text-xs text-gray-600 font-medium mb-2">Demo Credentials:</p>
//               <p className="text-xs text-gray-500 font-mono">
//                 Email: admin@example.com<br />
//                 Password: admin123
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <p className="text-center text-primary-200 text-sm mt-6">
//           © 2024 E-Commerce Platform. All rights reserved.
//         </p>
//       </div>
//     </div>
 
//  </>
   


<>
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 relative overflow-hidden p-4">
    {/* Blurred Background */}
    <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>

    {/* Main Container - Split Layout */}
    <div className="relative w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-2xl">
      {/* Left Side - Image Section */}
      <div className="hidden lg:block lg:w-1/2 relative">
        {/* Background Image */}
        <img 
          src={logo} 
          alt="Admin Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50"></div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col justify-start p-8">
          {/* Welcome Back Badge */}
          <div className="inline-flex items-center self-start mb-6">
            <span className="bg-white text-teal-600 px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
              Welcome Back
            </span>
          </div>
          
          {/* Main Text */}
          <div className="flex-1 flex items-start pt-16">
            <div>
              <h1 className="text-5xl font-bold text-white leading-tight">
                Admin
                <br />
                Control
                <br />
                Panel
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 bg-white p-8 relative">
        {/* Close Button */}
        <button className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors">
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Login Card Content */}
        <div className="h-full flex flex-col justify-center">
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome Back!
            </h2>
            <p className="text-gray-500 text-sm">
              Admin Portal Access
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-11 pr-4 py-3 bg-white border-2 border-teal-500 rounded-xl focus:border-teal-600 focus:ring-4 focus:ring-teal-100 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  Signing in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 mt-6">
            <p className="text-xs font-semibold text-gray-700 mb-1">Demo Credentials:</p>
            <p className="text-xs text-gray-600 font-mono">
              Email: admin@example.com<br />
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</>
  );
};

export default Login;
