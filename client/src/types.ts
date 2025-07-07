export interface Car {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
  rentalPricePerDay: number;
  isAvailable: boolean;
  imageUrl?: string;
}

export interface Rental {
  id: number;
  carId: number;
  customerId: number;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  car?: Car;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  // Add other user properties as needed
}
