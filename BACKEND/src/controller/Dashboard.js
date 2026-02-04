import ProductData from '../Models/ProductDetails.js';
import CategoryData from '../Models/CategoryDetails.js';
import UserData from '../Models/PersonDetails.js';
import CartData from '../Models/CartProducDetails.js';
import Order from '../Models/OrderDetails.js';

// Get dashboard stats
export const getStats = async (req, res) => {
    try {
        const totalProducts = await ProductData.countDocuments();
        const totalCategories = await CategoryData.countDocuments();
        const totalCustomers = await UserData.countDocuments();
        const totalOrders = await Order.countDocuments();

        // Calculate revenue: both paid orders and all orders
        const revenuePaidAgg = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        const paidRevenue = revenuePaidAgg[0]?.total || 0;

        const revenueAllAgg = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        const totalRevenue = revenueAllAgg[0]?.total || 0;

        res.status(200).json({
            success: true,
            data: {
                // numeric values
                paidRevenue,
                totalRevenue,
                // formatted display strings
                formattedPaidRevenue: `₹${Number(paidRevenue || 0).toLocaleString()}`,
                formattedTotalRevenue: `₹${Number(totalRevenue || 0).toLocaleString()}`,
                totalOrders,
                totalProducts,
                totalCustomers,
                totalCategories,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get recent orders (from orders collection)
export const getRecentOrders = async (req, res) => {
    try {
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'name price')
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            data: recentOrders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get top products
export const getTopProducts = async (req, res) => {
    try {
        const topProducts = await ProductData.find()
            .sort({ price: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            data: topProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
