import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    // <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
    //   <div className="px-6 py-4 flex items-center justify-between">
    //     {/* Search */}
    //     <div className="flex-1 max-w-md">
    //       <div className="relative">
    //         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    //         <input
    //           type="text"
    //           placeholder="Search anything..."
    //           className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
    //         />
    //       </div>
    //     </div>

    //     {/* Right side */}
    //     <div className="flex items-center gap-4 ml-6">
    //       {/* Notifications */}
    //       <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
    //         <Bell className="w-5 h-5 text-gray-600" />
    //         <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
    //       </button>

    //       {/* Admin Profile */}
    //       <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
    //         <div className="text-right">
    //           <p className="text-sm font-semibold text-gray-900">
    //             {user?.name || 'Admin User'}
    //           </p>
    //           <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
    //         </div>
    //         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold shadow-md">
    //           {user?.name?.charAt(0) || <User className="w-5 h-5" />}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </header>

    <header className="bg-white border-b-2 border-[#E4E3E7] shadow-lg sticky top-0 z-50">
  <div className="px-6 py-4 flex items-center justify-between">
    {/* Search */}
    <div className="flex-1 max-w-md">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#88C7B3] group-focus-within:text-[#1D9C7A] transition-colors" />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#E4E3E7] focus:outline-none focus:border-[#1D9C7A] focus:ring-2 focus:ring-[#1D9C7A]/20 transition-all bg-[#F3F1EC]/50 hover:bg-white"
        />
      </div>
    </div>

    {/* Right side */}
    <div className="flex items-center gap-4 ml-6">
      {/* Notifications */}
      <button className="relative p-2.5 rounded-xl hover:bg-[#F3F1EC] transition-all duration-300 group border-2 border-transparent hover:border-[#1D9C7A]">
        <Bell className="w-5 h-5 text-[#88C7B3] group-hover:text-[#1D9C7A] transition-colors" />
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#1D9C7A] rounded-full border-2 border-white animate-pulse"></span>
      </button>

      {/* Admin Profile */}
      <div className="flex items-center gap-3 pl-4 border-l-2 border-[#E4E3E7]">
        <div className="text-right">
          <p className="text-sm font-bold text-[#0F172A]">
            {user?.name || 'Admin User'}
          </p>
          <p className="text-xs text-[#88C7B3] font-medium">{user?.email || 'admin@example.com'}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-[#1D9C7A] flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-[#1D9C7A] hover:scale-105">
          {user?.name?.charAt(0) || <User className="w-5 h-5" />}
        </div>
      </div>
    </div>
  </div>
</header>
  );
};

export default Navbar;
