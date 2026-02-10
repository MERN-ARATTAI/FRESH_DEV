
import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Bell,
  Download,
  Search,
  Filter,
  Eye,
  MoreVertical,
  Clock
} from 'lucide-react';
import { dashboardAPI } from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('📊 Fetching dashboard data...');
      const [statsRes, ordersRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRecentOrders(),
      ]);

      const statsPayload = statsRes.data?.data || statsRes.data;
      setStats(statsPayload || null);

      // Normalize recent orders for UI
      const orders = ordersRes.data?.data || [];
      const normalized = (Array.isArray(orders) ? orders : []).map((o) => ({
        id: o._id,
        customer: o.user?.name || o.user?.email || 'N/A',
        amount: o.totalAmount || 0,
        status: o.orderStatus || o.status || 'pending',
        date: o.createdAt || o.createdAt,
      }));

      setRecentOrders(normalized);

      console.log('✅ Dashboard data loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data: ' + (error.response?.data?.message || error.message));
      setRecentOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const statCards = [
    {
      title: 'Total Revenue (Paid)',
      value: stats?.formattedPaidRevenue || `₹0`,
      subtitle: `All orders: ${stats?.formattedTotalRevenue || '₹0'}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders ?? '0',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts ?? '0',
      change: '+3.1%',
      trend: 'up',
      icon: Package,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers ?? '0',
      change: '-2.4%',
      trend: 'down',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      delivered: {
        class: 'bg-green-100 text-green-700 border border-green-200',
        label: 'Delivered'
      },
      shipped: {
        class: 'bg-blue-100 text-blue-700 border border-blue-200',
        label: 'Shipped'
      },
      pending: {
        class: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
        label: 'Pending'
      },
      processing: {
        class: 'bg-purple-100 text-purple-700 border border-purple-200',
        label: 'Processing'
      },
      cancelled: {
        class: 'bg-red-100 text-red-700 border border-red-200',
        label: 'Cancelled'
      }
    };
    return configs[status] || configs.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-semibold text-lg">Loading dashboard...</p>
          <p className="mt-2 text-gray-500 text-sm">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    

  <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 bg-[#F3F1EC] min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-[#0F172A]/60 mt-1 sm:mt-2">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 sm:p-2.5 bg-white border border-[#BEDCD0]/40 rounded-xl hover:bg-[#BEDCD0]/10 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-[#0F172A] ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-2 sm:p-2.5 bg-white border border-[#BEDCD0]/40 rounded-xl hover:bg-[#BEDCD0]/10 transition-all duration-200 shadow-sm hover:shadow relative">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F172A]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1D9C7A] rounded-full text-white text-xs flex items-center justify-center font-bold">
              3
            </span>
          </button>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-[#1D9C7A] text-white rounded-xl hover:bg-[#1D9C7A]/90 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#BEDCD0]/30 hover:border-[#88C7B3]/50 overflow-hidden"
            >
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-[#0F172A]/60 uppercase tracking-wide mb-2">
                      {stat.title}
                    </p>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] mb-1">
                      {stat.value}
                    </p>
                    {stat.subtitle && (
                      <p className="text-xs sm:text-sm text-[#0F172A]/50">{stat.subtitle}</p>
                    )}
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#1D9C7A] shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-3 border-t border-[#BEDCD0]/30">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-[#1D9C7A]/10' : 'bg-red-50'
                    }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1D9C7A]" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                    )}
                    <span className={`text-xs sm:text-sm font-bold ${stat.trend === 'up' ? 'text-[#1D9C7A]' : 'text-red-600'
                      }`}>
                      {stat.change}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-[#0F172A]/50">vs last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#BEDCD0]/30 overflow-hidden">
        {/* Table Header */}
        <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 border-b border-[#BEDCD0]/30 bg-[#F3F1EC]/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#1D9C7A]" />
                Recent Orders
              </h2>
              <p className="text-xs sm:text-sm text-[#0F172A]/60 mt-1">
                Latest transactions from customers
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#F3F1EC] border border-[#BEDCD0]/40 rounded-xl flex-1 sm:flex-initial sm:min-w-[200px]">
                <Search className="w-4 h-4 text-[#0F172A]/40" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="bg-transparent border-none outline-none text-sm text-[#0F172A] placeholder-[#0F172A]/40 w-full"
                />
              </div>

              {/* Filter */}
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#F3F1EC] border border-[#BEDCD0]/40 rounded-xl hover:bg-[#BEDCD0]/20 transition-colors text-sm font-medium text-[#0F172A]">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>

              {/* View All */}
              <button className="px-3 sm:px-4 py-2 bg-[#1D9C7A] text-white rounded-xl hover:bg-[#1D9C7A]/90 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-semibold">
                View All
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F3F1EC]/30 border-b border-[#BEDCD0]/30">
                <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left">
                  <span className="text-xs font-bold text-[#0F172A]/70 uppercase tracking-wider">
                    Order ID
                  </span>
                </th>
                <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left">
                  <span className="text-xs font-bold text-[#0F172A]/70 uppercase tracking-wider">
                    Customer
                  </span>
                </th>
                <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left">
                  <span className="text-xs font-bold text-[#0F172A]/70 uppercase tracking-wider">
                    Amount
                  </span>
                </th>
                <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left">
                  <span className="text-xs font-bold text-[#0F172A]/70 uppercase tracking-wider">
                    Status
                  </span>
                </th>
                <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left hidden lg:table-cell">
                  <span className="text-xs font-bold text-[#0F172A]/70 uppercase tracking-wider">
                    Date
                  </span>
                </th>
                <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-right">
                  <span className="text-xs font-bold text-[#0F172A]/70 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#BEDCD0]/20">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#F3F1EC]/30 transition-colors group"
                    >
                      <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 whitespace-nowrap">
                        <span className="font-mono text-xs sm:text-sm font-semibold text-[#1D9C7A] bg-[#1D9C7A]/10 px-2 py-1 rounded-lg border border-[#1D9C7A]/20">
                          #{String(order.id).substring(0, 8)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#88C7B3] flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md flex-shrink-0">
                            {order.customer.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-[#0F172A] truncate">
                            {order.customer}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                          ₹{Number(order.amount || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.class}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#0F172A]/60">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0F172A]/40" />
                          {order.date ? new Date(order.date).toLocaleString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 sm:p-2 hover:bg-[#BEDCD0]/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                            <Eye className="w-4 h-4 text-[#0F172A]" />
                          </button>
                          <button className="p-1.5 sm:p-2 hover:bg-[#BEDCD0]/20 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-[#0F172A]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-16 sm:py-20 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F3F1EC] mb-4">
                      <Package className="w-8 h-8 text-[#0F172A]/40" />
                    </div>
                    <p className="text-sm sm:text-base text-[#0F172A]/60 font-medium">
                      No recent orders
                    </p>
                    <p className="text-xs sm:text-sm text-[#0F172A]/40 mt-1">
                      Orders will appear here once customers make purchases
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {recentOrders.length > 0 && (
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-t border-[#BEDCD0]/30 bg-[#F3F1EC]/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs sm:text-sm text-[#0F172A]/60">
                Showing <span className="font-semibold text-[#0F172A]">1</span> to{' '}
                <span className="font-semibold text-[#0F172A]">{recentOrders.length}</span> of{' '}
                <span className="font-semibold text-[#0F172A]">{recentOrders.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 border border-[#BEDCD0]/50 rounded-xl text-xs sm:text-sm font-medium text-[#0F172A] hover:bg-[#BEDCD0]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                <button className="px-3 py-2 bg-[#1D9C7A] text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-[#1D9C7A]/90 transition-colors">
                  1
                </button>
                <button className="px-3 py-2 border border-[#BEDCD0]/50 rounded-xl text-xs sm:text-sm font-medium text-[#0F172A] hover:bg-[#BEDCD0]/10 transition-colors">
                  2
                </button>
                <button className="px-3 py-2 border border-[#BEDCD0]/50 rounded-xl text-xs sm:text-sm font-medium text-[#0F172A] hover:bg-[#BEDCD0]/10 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default Dashboard;