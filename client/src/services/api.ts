import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response: any) => {
    // Always return the data property of the response
    return response.data;
  },
  (error: any) => {
    console.error('API Error:', error);
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.error || error.response.data.message || 'Server error');
    } else if (error.request) {
      // Request made but no response received
      throw new Error('No response from server');
    } else {
      // Error in request setup
      throw new Error('Error setting up request');
    }
  }
);

export interface Car {
  id: number;
  name: string;
  model: string;
  year: number;
  rentalPricePerDay: number;
  isAvailable: boolean;
  imageUrl: string;
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
  car?: Car;
  customer?: {
    id: number;
    name: string;
    email: string;
    phone: string;
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

interface ApiService {
  cars: {
    getAll: () => Promise<Car[]>;
    getOne: (id: number) => Promise<Car>;
  };
  customers: {
    getAll: () => Promise<Customer[]>;
    getOne: (id: number) => Promise<Customer>;
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

const api: ApiService = {
  cars: {
    getAll: () => axiosInstance.get('/cars'),
    getOne: (id: number) => axiosInstance.get(`/cars/${id}`),
  },

  customers: {
    getAll: () => axiosInstance.get('/customers'),
    getOne: (id: number) => axiosInstance.get(`/customers/${id}`),
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
