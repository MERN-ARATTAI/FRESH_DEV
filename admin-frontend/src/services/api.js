import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  // baseURL: 'https://fresh-dev.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true,
});

// Request interceptor - Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - Token expired or invalid
      if (error.response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/login';
      }

      // Handle 403 Forbidden - Insufficient permissions
      if (error.response.status === 403) {
        console.error('Access denied');
      }
    }

    return Promise.reject(error);
  }
);

// API Service methods - Aligned with backend routes
export const authAPI = {
  login: (credentials) => api.post('/user/login', credentials),
  logout: () => api.get('/user/logout'),
  register: (userData) => api.post('/user/register', userData),
};

export const productAPI = {
  getAll: (params) => api.get('/product/list-product', { params }),
  getById: (id) => api.get(`/product/${id}`),
  create: (data) => api.post('/product/create-product', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/product/update/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/product/delete/${id}`),
  getByCategory: (categoryId) => api.get('/product/get-product-category', { params: { id: categoryId } }),
  getByCategoryAndSubcategory: (filters) => api.get('/product/get-product-cat-sub', { params: filters }),
};

export const categoryAPI = {
  getAll: (params) => api.get('/category/get', { params }),
  getById: (id) => api.get(`/category/${id}`),
  create: (data) => api.post('/category/create', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/category/update/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/category/delete/${id}`),
};

export const subcategoryAPI = {
  getAll: (params) => api.get('/subcategory/subcategory', { params }),
  create: (data) => api.post('/subcategory/create', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/subcategory/subcategory/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/subcategory/subcategory/${id}`),
  getByCategory: (categoryName) => api.get(`/subcategory/by-category-name/${categoryName}`),
};

// Order API endpoints
export const orderAPI = {
  // Admin list with pagination and filters
  getAll: (params) => api.get('/orders/admin/all', { params }),
  // Update order status (admin)
  updateStatus: (id, statusData) => api.put(`/orders/admin/status/${id}`, statusData),
  // Get order statistics
  getStatistics: () => api.get('/orders/admin/statistics'),
};

export const customerAPI = {
  getAll: (params) => api.get('/user', { params }),
  getById: (id) => api.get(`/user/${id}`),
  toggleStatus: (id) => api.patch(`/user/${id}/toggle-status`),
};

export const cartAPI = {
  getCart: () => api.get('/cart/getcart'),
  addToCart: (data) => api.post('/cart/cart', data),
  updateCart: (data) => api.put('/cart/updatecart', data),
};

export const addressAPI = {
  getAll: () => api.get('/address'),
  create: (data) => api.post('/address', data),
  update: (id, data) => api.put(`/address/${id}`, data),
  delete: (id) => api.delete(`/address/${id}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentOrders: () => api.get('/dashboard/recent-orders'),
  getTopProducts: () => api.get('/dashboard/top-products'),
};
export const contactApi = {
  getAll: () => api.get('/contact/all'),
  delete: (id) => api.delete(`/contact/${id}`)
}

export default api;
