import Api from './interceptor';

/**
 * Order API Service
 * All functions return response.data from interceptor
 */

export const orderAPI = {
    // ============ USER ENDPOINTS ============

    /**
     * Create a new order from cart items
     * @param {Object} orderData - Order details
     * @param {Object} orderData.shippingAddress - Shipping address
     * @param {string} orderData.paymentMethod - Payment method
     * @param {number} [orderData.discountAmount=0] - Discount amount
     * @param {number} [orderData.taxAmount=0] - Tax amount
     * @returns {Promise} - Order response with orderId
     */
    createOrder: async (orderData) => {
        try {
            const response = await Api.post('/orders/create', orderData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get user's order history with pagination
     * @param {Object} [params] - Query parameters
     * @param {number} [params.page=1] - Page number
     * @param {number} [params.limit=10] - Items per page
     * @param {string} [params.status] - Filter by order status
     * @param {string} [params.paymentStatus] - Filter by payment status
     * @returns {Promise} - Array of orders with pagination info
     */
    getUserOrders: async (params = {}) => {
        try {
            const response = await Api.get('/orders/my-orders', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get single order details
     * @param {string} orderId - Order ID
     * @returns {Promise} - Order details with populated product info
     */
    getOrderById: async (orderId) => {
        try {
            const response = await Api.get(`/orders/details/${orderId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Cancel a placed order
     * @param {string} orderId - Order ID
     * @returns {Promise} - Cancelled order details
     */
    cancelOrder: async (orderId) => {
        try {
            const response = await Api.put(`/orders/cancel/${orderId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // ============ ADMIN ENDPOINTS ============

    /**
     * Get all orders (Admin only)
     * @param {Object} [params] - Query parameters
     * @param {number} [params.page=1] - Page number
     * @param {number} [params.limit=20] - Items per page
     * @param {string} [params.status] - Filter by order status
     * @param {string} [params.paymentStatus] - Filter by payment status
     * @param {string} [params.userId] - Filter by specific user
     * @returns {Promise} - All orders with statistics
     */
    getAllOrders: async (params = {}) => {
        try {
            const response = await Api.get('/orders/admin/all', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Update order status (Admin only)
     * @param {string} orderId - Order ID
     * @param {Object} statusData - Status update data
     * @param {string} [statusData.orderStatus] - New order status
     * @param {string} [statusData.paymentStatus] - New payment status
     * @param {string} [statusData.notes] - Admin notes
     * @returns {Promise} - Updated order details
     */
    updateOrderStatus: async (orderId, statusData) => {
        try {
            const response = await Api.put(`/orders/admin/status/${orderId}`, statusData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get order statistics (Admin only)
     * @returns {Promise} - Statistics including revenue and status distribution
     */
    getOrderStatistics: async () => {
        try {
            const response = await Api.get('/orders/admin/statistics');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default orderAPI;
