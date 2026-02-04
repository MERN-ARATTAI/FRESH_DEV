import express from "express";
import {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    getOrderStatistics,
} from "../controller/Order.js";
import { Protect } from "../Middleware/User.js";
import { Admin } from "../Middleware/Admin.js";

const router = express.Router();

// User routes (Protected)
router.post("/create", Protect, createOrder);
router.get("/my-orders", Protect, getUserOrders);
router.get("/details/:orderId", Protect, getOrderById);
router.put("/cancel/:orderId", Protect, cancelOrder);

// Admin routes (Protected + Admin only)
router.get("/admin/all", Protect, Admin, getAllOrders);
router.put("/admin/status/:orderId", Protect, Admin, updateOrderStatus);
router.get("/admin/statistics", Protect, Admin, getOrderStatistics);

export default router;
