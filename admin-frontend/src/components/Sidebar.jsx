import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  ShoppingCart,
  Users,
  LogOut,
  Contact
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/products', icon: Package, label: 'Products' },
    { to: '/categories', icon: FolderTree, label: 'Categories' },
    { to: '/subcategories', icon: Tag, label: 'Subcategories' },
    { to: '/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/customers', icon: Users, label: 'Customers' },
    { to: '/contact', icon: Contact, label: "Contact" }
  ];

  return (
    // <aside className="w-64 bg-primary-900 text-white flex flex-col min-h-screen">
    //   {/* Logo */}
    //   <div className="p-6 border-b border-primary-800">
    //     <h1 className="text-2xl font-display font-bold tracking-tight">
    //       Admin<span className="text-accent-400">Panel</span>
    //     </h1>
    //     <p className="text-primary-300 text-xs mt-1 font-mono">E-Commerce Platform</p>
    //   </div>

    //   {/* Navigation */}
    //   <nav className="flex-1 p-4 space-y-1">
    //     {navItems.map(({ to, icon: Icon, label }) => (
    //       <NavLink
    //         key={to}
    //         to={to}
    //         end={to === '/'}
    //         className={({ isActive }) =>
    //           `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
    //             ? 'bg-primary-800 text-white shadow-lg'
    //             : 'text-primary-200 hover:bg-primary-800/50 hover:text-white'
    //           }`
    //         }
    //       >
    //         <Icon className="w-5 h-5" />
    //         <span className="font-medium">{label}</span>
    //       </NavLink>
    //     ))}
    //   </nav>

    //   {/* Logout */}
    //   <div className="p-4 border-t border-primary-800">
    //     <button
    //       onClick={logout}
    //       className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-primary-200 hover:bg-primary-800/50 hover:text-white transition-all duration-200"
    //     >
    //       <LogOut className="w-5 h-5" />
    //       <span className="font-medium">Logout</span>
    //     </button>
    //   </div>
    // </aside>
  <aside className="fixed top-0 left-0 w-64 bg-[#0F172A] text-white flex flex-col h-screen z-50 transform transition-transform duration-300 lg:translate-x-0 -translate-x-full lg:sticky">
      {/* Logo */}
      <div className="p-6 border-b border-[#0F172A]/50">
        <h1 className="text-2xl font-bold tracking-tight">
          Admin<span className="text-[#1D9C7A]">Panel</span>
        </h1>
        <p className="text-[#D5D5E1] text-xs mt-1">E-Commerce Platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                ? 'bg-[#1D9C7A] text-white shadow-lg'
                : 'text-[#D5D5E1] hover:bg-[#1D9C7A]/20 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#0F172A]/50">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#D5D5E1] hover:bg-[#1D9C7A]/20 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;


