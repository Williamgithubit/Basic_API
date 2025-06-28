import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Car {
  id: number;
  name: string;
  model: string;
  year: number;
  rentalPricePerDay: number;
  isAvailable: boolean;
}

interface CarListProps {
  onRentalCreated: (rental: any) => void;
  setMessage: (message: { text: string; type: 'success' | 'error' }) => void;
}

const CarList: React.FC<CarListProps> = ({ onRentalCreated, setMessage }) => {
  const { user } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.cars.getAll();
        setCars(response);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching cars');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleRentCar = async (carId: number) => {
    if (!user?.id) {
      setMessage({
        text: 'Please log in to rent a car',
        type: 'error'
      });
      return;
    }

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1); // Start from tomorrow
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7); // 7-day rental period

      const rental = await api.rentals.create({
        carId,
        customerId: user.id,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      });

      onRentalCreated(rental);
      setMessage({
        text: 'Car rented successfully',
        type: 'success'
      });
    } catch (error) {
      setMessage({
        text: 'Failed to rent the car',
        type: 'error'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg text-gray-600">Loading cars...</span>
          </div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="text-lg text-red-600 bg-red-50 px-4 py-3 rounded-lg shadow flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Error: {error}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1">{car.name}</h3>
                    <p className="text-gray-600 text-sm md:text-base">{car.model}</p>
                  </div>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                    {car.year}
                  </span>
                </div>
                <div className="flex items-center justify-between space-y-2 flex-wrap md:flex-nowrap">
                  <div className="flex-1">
                    <p className="text-xl md:text-2xl font-bold text-gray-900">
                      ${car.rentalPricePerDay}
                      <span className="text-sm md:text-base text-gray-500 font-normal ml-1">/day</span>
                    </p>
                  </div>
                  <div className="w-full md:w-auto mt-4 md:mt-0">
                    <button
                      onClick={() => handleRentCar(car.id)}
                      className={`w-full md:w-auto px-6 py-2 rounded-md transition-colors duration-200 font-medium ${car.isAvailable 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                      disabled={!car.isAvailable}
                    >
                      {car.isAvailable ? 'Rent Now' : 'Not Available'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarList;
