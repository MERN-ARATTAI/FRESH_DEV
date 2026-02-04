import Order from "../Models/OrderDetails.js";
import Cart from "../Models/CartProducDetails.js";

// Create a new order from cart items
export const createOrder = async (req, res) => {
    try {
        console.log("🔵 createOrder called");
        console.log("Request body:", req.body);
        console.log("User ID:", req.user?._id);

        const { shippingAddress, paymentMethod, discountAmount = 0, taxAmount = 0, items } = req.body;
        const userId = req.user._id;

        console.log("Shipping Address:", shippingAddress);
        console.log("Payment Method:", paymentMethod);
        console.log("Items from request:", items);

        // Validate required fields
        if (!shippingAddress || !paymentMethod) {
            console.log("❌ Missing required fields");
            return res.status(400).json({
                success: false,
                message: "Shipping address and payment method are required",
            });
        }

        // Fetch user's cart items OR use items from request
        let cartItems = items;

        if (!items || items.length === 0) {
            // Fallback: fetch from cart collection if items not provided
            cartItems = await Cart.find({ user: userId }).populate(
                "product",
                "name price image"
            );

            // Format items for order if fetched from cart
            if (cartItems && cartItems.length > 0) {
                cartItems = cartItems.map((item) => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.price,
                }));
            }
        }

        console.log("Cart items found:", cartItems?.length || 0);

        if (!cartItems || cartItems.length === 0) {
            console.log("❌ Cart is empty");
            return res.status(400).json({
                success: false,
                message: "Cart is empty. Cannot create order without items",
            });
        }

        // Calculate total amount
        const subtotal = cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        const totalAmount = subtotal + taxAmount - discountAmount;

        // Create order
        const newOrder = new Order({
            user: userId,
            items: cartItems,
            shippingAddress,
            paymentMethod,
            paymentStatus: "pending",
            orderStatus: "placed",
            totalAmount,
            discountAmount,
            taxAmount,
        });

        console.log("Order object created:", newOrder);
        const savedOrder = await newOrder.save();
        console.log("✅ Order saved successfully:", savedOrder._id);

        // Clear user's cart after successful order (only if items were fetched from cart)
        if (!items || items.length === 0) {
            await Cart.deleteMany({ user: userId });
            console.log("✅ Cart cleared");
        }

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: {
                orderId: savedOrder._id,
                totalAmount: savedOrder.totalAmount,
                orderStatus: savedOrder.orderStatus,
                paymentStatus: savedOrder.paymentStatus,
                createdAt: savedOrder.createdAt,
            },
        });
    } catch (error) {
        console.error("❌ Error in createOrder:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        return res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message,
        });
    }
};

// Get all orders for logged-in user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 10, status, paymentStatus } = req.query;

        // Build filter
        const filter = { user: userId };
        if (status) filter.orderStatus = status;
        if (paymentStatus) filter.paymentStatus = paymentStatus;

        // Fetch orders with pagination
        const skip = (page - 1) * limit;
        const orders = await Order.find(filter)
            .populate("items.product", "name image price")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Order.countDocuments(filter);

        return res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalOrders: total,
            },
        });
    } catch (error) {
        console.error("Error in getUserOrders:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user orders",
            error: error.message,
        });
    }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        // Validate user owns this order
        const order = await Order.findById(orderId)
            .populate("items.product", "name image price brand stock")
            .populate("user", "name email phone");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Ensure user can only see their own orders
        if (order.user._id.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to view this order",
            });
        }

        return res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Error in getOrderById:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch order",
            error: error.message,
        });
    }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, paymentStatus, userId } = req.query;

        // Build filter
        const filter = {};
        if (status) filter.orderStatus = status;
        if (paymentStatus) filter.paymentStatus = paymentStatus;
        if (userId) filter.user = userId;

        // Fetch all orders with pagination
        const skip = (page - 1) * limit;
        const orders = await Order.find(filter)
            .populate("user", "name email phone")
            .populate("items.product", "name image price")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Order.countDocuments(filter);

        // Calculate statistics
        const totalRevenue = await Order.aggregate([
            { $match: { paymentStatus: "paid" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);

        const statusDistribution = await Order.aggregate([
            { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
        ]);

        return res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalOrders: total,
            },
            statistics: {
                totalRevenue: totalRevenue[0]?.total || 0,
                statusDistribution,
            },
        });
    } catch (error) {
        console.error("Error in getAllOrders:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message,
        });
    }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus, paymentStatus, notes } = req.body;

        // Validate status values
        const validOrderStatus = [
            "placed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
        ];
        const validPaymentStatus = ["pending", "paid", "failed"];

        if (
            orderStatus &&
            !validOrderStatus.includes(orderStatus)
        ) {
            return res.status(400).json({
                success: false,
                message: `Invalid order status. Must be one of: ${validOrderStatus.join(
                    ", "
                )}`,
            });
        }

        if (
            paymentStatus &&
            !validPaymentStatus.includes(paymentStatus)
        ) {
            return res.status(400).json({
                success: false,
                message: `Invalid payment status. Must be one of: ${validPaymentStatus.join(
                    ", "
                )}`,
            });
        }

        // Update order
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                ...(orderStatus && { orderStatus }),
                ...(paymentStatus && { paymentStatus }),
                ...(notes && { notes }),
            },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: updatedOrder,
        });
    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message,
        });
    }
};

// Cancel an order (User can cancel placed orders)
export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Check ownership
        if (order.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to cancel this order",
            });
        }

        // Can only cancel placed orders
        if (order.orderStatus !== "placed") {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order with status: ${order.orderStatus}`,
            });
        }

        order.orderStatus = "cancelled";
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order,
        });
    } catch (error) {
        console.error("Error in cancelOrder:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to cancel order",
            error: error.message,
        });
    }
};

// Get order statistics (Admin only)
export const getOrderStatistics = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { paymentStatus: "paid" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);

        const ordersByStatus = await Order.aggregate([
            { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
        ]);

        const ordersByPaymentStatus = await Order.aggregate([
            { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
        ]);

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email");

        return res.status(200).json({
            success: true,
            data: {
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                ordersByStatus,
                ordersByPaymentStatus,
                recentOrders,
            },
        });
    } catch (error) {
        console.error("Error in getOrderStatistics:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch statistics",
            error: error.message,
        });
    }
};
