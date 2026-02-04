import express from 'express';
import { getStats, getRecentOrders, getTopProducts } from '../controller/Dashboard.js';
import { Protect } from '../Middleware/User.js';
import { Admin } from '../Middleware/Admin.js';

const DashboardRouter = express.Router();

// All dashboard routes require authentication and admin access
DashboardRouter.get('/stats', Protect, Admin, getStats);
DashboardRouter.get('/recent-orders', Protect, Admin, getRecentOrders);
DashboardRouter.get('/top-products', Protect, Admin, getTopProducts);

export default DashboardRouter;
