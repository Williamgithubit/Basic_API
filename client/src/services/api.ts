// client/src/services/api.ts
import axios, { AxiosError, type AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('API Base URL:', API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Token setter
export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// ✅ Interceptor with type-safe generic
axiosInstance.interceptors.response.use(
  <T>(response: AxiosResponse<T>) => response.data,
  (error: AxiosError<any>) => {
    console.error('API Error:', error);

    const message =
      error.response?.data?.error ||
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
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error('Error setting up request');
    }
  }
);

// ✅ Interfaces
export interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  seats: number;
  fuelType: 'Petrol' | 'Electric' | 'Hybrid';
  location: string;
  features: string[];
  rentalPricePerDay: number;
  isAvailable: boolean;
  isLiked: boolean;
  imageUrl: string;
  rating: number;
  reviews: number;
  description: string;
  make?: string;
  transmission?: string;
  capacity?: number;
  color?: string;
}

export interface DashboardStats {
  totalRentals: number;
  activeRentals: number;
  totalRevenue: number;
  popularCars: Array<{
    carId: number;
    name: string;
    model: string;
    rentCount: number;
  }>;
  revenueByMonth?: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;
  carTypeDistribution?: Array<{
    type: string;
    count: number;
  }>;
  userStats?: {
    totalUsers: number;
    newUsersThisMonth: number;
    usersByRole: {
      customer: number;
      owner: number;
      admin: number;
    };
  };
}

export interface Rental {
  id: number;
  carId: number;
  customerId: number;
  startDate: string;
  endDate: string;
  totalCost: number;
  Car?: {
    id: number;
    name: string;
    model: string;
    rentalPricePerDay: number;
  };
  Customer?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface RentalCreate {
  carId: number;
  customerId: number;
  startDate: string;
  endDate: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'owner' | 'admin';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'owner';
}

export interface Review {
  id: number;
  userId: number;
  carId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  car?: Car;
}

export interface RevenueData {
  period: string;
  revenue: number;
  bookings: number;
}

export interface CarMaintenanceRecord {
  id: number;
  carId: number;
  description: string;
  cost: number;
  date: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  car?: Car;
}

interface ApiService {
  auth: {
    login: (credentials: AuthCredentials) => Promise<{ token: string; user: User }>;
    signup: (data: SignupData) => Promise<{ token: string; user: User }>;
    getMe: () => Promise<User>;
  };
  admin: {
    getUsers: () => Promise<User[]>;
    getNotifications: () => Promise<any[]>;
    createUser: (userData: Partial<User>) => Promise<User>;
    updateUser: (id: number, userData: Partial<User>) => Promise<User>;
    deleteUser: (id: number) => Promise<void>;
    getDashboardStats: () => Promise<any>;
  };
  setAuthToken: (token: string | null) => void;
  cars: {
    getAll: (params?: {
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
      fuelType?: string;
      seats?: number;
      location?: string;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    }) => Promise<Car[]>;
    getOne: (id: number) => Promise<Car>;
    toggleLike: (id: number) => Promise<{ isLiked: boolean }>;
    addReview: (id: number, rating: number) => Promise<{ rating: number; reviews: number }>;
    create: (car: Omit<Car, 'id'>) => Promise<Car>;
    update: (id: number, car: Partial<Car>) => Promise<Car>;
    delete: (id: number) => Promise<void>;
    getByOwner: (ownerId: number) => Promise<Car[]>;
  };
  customers: {
    getAll: () => Promise<Customer[]>;
    getOne: (id: number) => Promise<Customer>;
    create: (customer: Omit<Customer, 'id'>) => Promise<Customer>;
    update: (id: number, customer: Partial<Customer>) => Promise<Customer>;
    delete: (id: number) => Promise<void>;
  };
  rentals: {
    getAll: () => Promise<Rental[]>;
    create: (rental: RentalCreate) => Promise<Rental>;
    delete: (id: number) => Promise<void>;
    getStats: () => Promise<DashboardStats>;
    getByDateRange: (startDate: string, endDate: string) => Promise<Rental[]>;
    getActive: () => Promise<Rental[]>;
    getByCustomer: (customerId: number) => Promise<Rental[]>;
    getByOwner: (ownerId: number) => Promise<Rental[]>;
    updateStatus: (id: number, status: string) => Promise<Rental>;
    getRevenue: (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => Promise<RevenueData[]>;
  };
  users: {
    getAll: () => Promise<User[]>;
    getOne: (id: number) => Promise<User>;
    create: (user: Omit<User, 'id'>) => Promise<User>;
    update: (id: number, user: Partial<User>) => Promise<User>;
    delete: (id: number) => Promise<void>;
    toggleActive: (id: number) => Promise<User>;
    changeRole: (id: number, role: 'customer' | 'owner' | 'admin') => Promise<User>;
  };
  reviews: {
    getAll: () => Promise<Review[]>;
    getByUser: (userId: number) => Promise<Review[]>;
    getByCar: (carId: number) => Promise<Review[]>;
    create: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Review>;
    update: (id: number, review: Partial<Review>) => Promise<Review>;
    delete: (id: number) => Promise<void>;
  };
  maintenance: {
    getAll: () => Promise<CarMaintenanceRecord[]>;
    getByCar: (carId: number) => Promise<CarMaintenanceRecord[]>;
    create: (record: Omit<CarMaintenanceRecord, 'id'>) => Promise<CarMaintenanceRecord>;
    update: (id: number, record: Partial<CarMaintenanceRecord>) => Promise<CarMaintenanceRecord>;
    delete: (id: number) => Promise<void>;
  };
  dashboard: {
    getCustomerStats: (customerId: number) => Promise<{
      totalBookings: number;
      activeBookings: number;
      totalSpent: number;
      upcomingBookings: Rental[];
    }>;
    getOwnerStats: (ownerId: number) => Promise<{
      totalCars: number;
      totalBookings: number;
      totalEarnings: number;
      activeBookings: number;
      earningsByMonth: RevenueData[];
    }>;
    getAdminStats: () => Promise<{
      totalUsers: number;
      totalCars: number;
      totalBookings: number;
      totalRevenue: number;
      revenueByMonth: RevenueData[];
      usersByRole: { [key: string]: number };
      carsByStatus: { [key: string]: number };
    }>;
  };
}

// ✅ Main API object
const api: ApiService = {
  auth: {
    login: (credentials) =>
      axiosInstance.post('/auth/login', credentials),
    signup: (data) =>
      axiosInstance.post('/auth/signup', data),
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
    addReview: (id, rating) =>
      axiosInstance.post(`/cars/${id}/review`, { rating }),
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
    getByDateRange: (startDate, endDate) =>
      axiosInstance.get(`/rentals?startDate=${startDate}&endDate=${endDate}`),
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
