import axios, { AxiosError, type AxiosResponse } from 'axios';

// Use environment variable for API base URL with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Log the API base URL for debugging
console.log('API Base URL:', API_BASE_URL);

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  <T>(response: AxiosResponse<T>) => {
    return response.data;
  },
  (error: AxiosError<any>) => {
    console.error('API Error:', error);

    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Server error';

    if (error.response) {
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error('Error setting up request');
    }
  }
);

export interface Car {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
  rentalPricePerDay: number;
  isAvailable: boolean;
  imageUrl?: string; // Make imageUrl optional since it might not be present
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
}

export interface Rental {
  id: number;
  carId: number;
  customerId: number;
  startDate: string;
  endDate: string;
  totalCost: number;
  Car?: {              // capital C here
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

interface AuthCredentials {
  email: string;
  password: string;
}

interface SignupData extends AuthCredentials {
  name: string;
  phone: string;
}

interface ApiService {
  auth: {
    login: (credentials: AuthCredentials) => Promise<{ token: string; customer: Customer }>;
    signup: (data: SignupData) => Promise<{ token: string; customer: Customer }>;
  };
  setAuthToken: (token: string | null) => void;
  cars: {
    getAll: () => Promise<Car[]>;
    getOne: (id: number) => Promise<Car>;
  };
  customers: {
    getAll: () => Promise<Customer[]>;
    getOne: (id: number) => Promise<Customer>;
    create: (customer: Omit<Customer, 'id'>) => Promise<Customer>;
  };
  rentals: {
    getAll: () => Promise<Rental[]>;
    create: (rental: RentalCreate) => Promise<Rental>;
    delete: (id: number) => Promise<void>;
    getStats: () => Promise<DashboardStats>;
    getByDateRange: (startDate: string, endDate: string) => Promise<Rental[]>;
    getActive: () => Promise<Rental[]>;
  };
}

interface AuthCredentials {
  email: string;
  password: string;
}

interface SignupData extends AuthCredentials {
  name: string;
  phone: string;
}

const api: ApiService = {
  auth: {
    login: (credentials: AuthCredentials) => 
      axiosInstance.post('/auth/login', credentials),
    signup: (data: SignupData) => 
      axiosInstance.post('/auth/signup', data),
  },
  setAuthToken,
  cars: {
    getAll: () => axiosInstance.get('/cars'),
    getOne: (id: number) => axiosInstance.get(`/cars/${id}`),
    // create: (car: { name: string; model: string; year: number; rentalPricePerDay: number }) => 
    //   axiosInstance.post('/cars', car),
  },

  customers: {
    getAll: () => axiosInstance.get('/customers'),
    getOne: (id) => axiosInstance.get(`/customers/${id}`),
    create: (customer) => axiosInstance.post('/customers', customer)
  },

  rentals: {
    getAll: () => axiosInstance.get('/rentals'),
    create: (rental: RentalCreate) => axiosInstance.post('/rentals', rental),
    delete: (id: number) => axiosInstance.delete(`/rentals/${id}`),
    getStats: () => axiosInstance.get('/rentals/stats'),
    getByDateRange: (startDate: string, endDate: string) => 
      axiosInstance.get(`/rentals?startDate=${startDate}&endDate=${endDate}`),
    getActive: () => axiosInstance.get('/rentals/active'),
  },
};

export default api;
