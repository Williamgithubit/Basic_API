// client/src/services/api.ts
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('API Base URL:', API_BASE_URL);
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// ✅ Token setter
export const setAuthToken = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};
// ✅ Interceptor with type-safe generic
axiosInstance.interceptors.response.use((response) => response.data, (error) => {
    console.error('API Error:', error);
    const message = error.response?.data?.error ||
        error.response?.data?.message ||
        'Server error';
    // Handle authentication errors
    if (error.response?.status === 401) {
        console.log('Authentication error detected:', message);
        // If it's not a login/signup request that failed
        const isAuthRequest = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/signup');
        if (!isAuthRequest) {
            console.log('Non-auth request failed with 401, clearing token');
            // Clear token from localStorage
            localStorage.removeItem('token');
            // Clear auth header
            delete axiosInstance.defaults.headers.common['Authorization'];
            // Redirect to login page if we're in a browser environment
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        throw new Error(message);
    }
    if (error.response) {
        throw new Error(message);
    }
    else if (error.request) {
        throw new Error('No response from server');
    }
    else {
        throw new Error('Error setting up request');
    }
});
// ✅ Main API object
const api = {
    auth: {
        login: (credentials) => axiosInstance.post('/auth/login', credentials),
        signup: (data) => axiosInstance.post('/auth/signup', data),
        getMe: () => axiosInstance.get('/auth/me'),
    },
    admin: {
        getUsers: () => axiosInstance.get('/admin/users'),
        getNotifications: () => axiosInstance.get('/admin/notifications'),
        createUser: (userData) => axiosInstance.post('/admin/users', userData),
        updateUser: (id, userData) => axiosInstance.put(`/admin/users/${id}`, userData),
        deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),
        getDashboardStats: () => axiosInstance.get('/admin/dashboard/stats'),
    },
    setAuthToken,
    cars: {
        getAll: (params = {}) => axiosInstance.get('/cars', { params }),
        getOne: (id) => axiosInstance.get(`/cars/${id}`),
        toggleLike: (id) => axiosInstance.post(`/cars/${id}/like`),
        addReview: (id, rating) => axiosInstance.post(`/cars/${id}/review`, { rating }),
        create: (car) => axiosInstance.post('/cars', car),
        update: (id, car) => axiosInstance.put(`/cars/${id}`, car),
        delete: (id) => axiosInstance.delete(`/cars/${id}`),
        getByOwner: (ownerId) => axiosInstance.get(`/cars/owner/${ownerId}`),
    },
    customers: {
        getAll: () => axiosInstance.get('/customers'),
        getOne: (id) => axiosInstance.get(`/customers/${id}`),
        create: (customer) => axiosInstance.post('/customers', customer),
        update: (id, customer) => axiosInstance.put(`/customers/${id}`, customer),
        delete: (id) => axiosInstance.delete(`/customers/${id}`),
    },
    rentals: {
        getAll: () => axiosInstance.get('/rentals'),
        create: (rental) => axiosInstance.post('/rentals', rental),
        delete: (id) => axiosInstance.delete(`/rentals/${id}`),
        getStats: () => axiosInstance.get('/rentals/stats'),
        getByDateRange: (startDate, endDate) => axiosInstance.get(`/rentals?startDate=${startDate}&endDate=${endDate}`),
        getActive: () => axiosInstance.get('/rentals/active'),
        getByCustomer: (customerId) => axiosInstance.get(`/rentals/customer/${customerId}`),
        getByOwner: (ownerId) => axiosInstance.get(`/rentals/owner/${ownerId}`),
        updateStatus: (id, status) => axiosInstance.put(`/rentals/${id}/status`, { status }),
        getRevenue: (period) => axiosInstance.get(`/rentals/revenue?period=${period}`),
    },
    users: {
        getAll: () => axiosInstance.get('/users'),
        getOne: (id) => axiosInstance.get(`/users/${id}`),
        create: (user) => axiosInstance.post('/users', user),
        update: (id, user) => axiosInstance.put(`/users/${id}`, user),
        delete: (id) => axiosInstance.delete(`/users/${id}`),
        toggleActive: (id) => axiosInstance.put(`/users/${id}/toggle-active`),
        changeRole: (id, role) => axiosInstance.put(`/users/${id}/role`, { role }),
    },
    reviews: {
        getAll: () => axiosInstance.get('/reviews'),
        getByUser: (userId) => axiosInstance.get(`/reviews/user/${userId}`),
        getByCar: (carId) => axiosInstance.get(`/reviews/car/${carId}`),
        create: (review) => axiosInstance.post('/reviews', review),
        update: (id, review) => axiosInstance.put(`/reviews/${id}`, review),
        delete: (id) => axiosInstance.delete(`/reviews/${id}`),
    },
    maintenance: {
        getAll: () => axiosInstance.get('/maintenance'),
        getByCar: (carId) => axiosInstance.get(`/maintenance/car/${carId}`),
        create: (record) => axiosInstance.post('/maintenance', record),
        update: (id, record) => axiosInstance.put(`/maintenance/${id}`, record),
        delete: (id) => axiosInstance.delete(`/maintenance/${id}`),
    },
    dashboard: {
        getCustomerStats: (customerId) => axiosInstance.get(`/dashboard/customer/${customerId}`),
        getOwnerStats: (ownerId) => axiosInstance.get(`/dashboard/owner/${ownerId}`),
        getAdminStats: () => axiosInstance.get('/dashboard/admin'),
    },
};
export default api;
