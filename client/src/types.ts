export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  isAvailable: boolean;
}

export interface Rental {
  id: number;
  carId: number;
  startDate: string;
  endDate: string;
  car?: Car;
}
