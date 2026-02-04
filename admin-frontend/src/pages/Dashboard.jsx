import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { dashboardAPI } from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="card group hover:shadow-glow transition-all duration-300"
          >
            <div className="card-body">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-display font-bold text-gray-900 mb-2">
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                  )}
                  <div className="flex items-center gap-1">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-success-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-danger-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${stat.trend === 'up' ? 'text-success-600' : 'text-danger-600'
                        }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500">vs last month</span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-gray-900">
              Recent Orders
            </h2>
            <p className="text-sm text-gray-600 mt-1">Latest transactions from customers</p>
          </div>
          <button className="btn btn-secondary">View All</button>
        </div>
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-medium text-primary-600">
                          #{String(order.id).substring(0, 8)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{order.customer}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          ₹{Number(order.amount || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${order.status === 'delivered' ? 'badge-success' :
                          order.status === 'shipped' ? 'badge-primary' :
                            order.status === 'pending' ? 'badge-warning' :
                              'badge-gray'
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.date ? new Date(order.date).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
