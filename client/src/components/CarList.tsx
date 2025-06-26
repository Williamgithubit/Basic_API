import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Car {
  id: number;
  name: string;
  model: string;
  year: number;
  rentalPricePerDay: number;
  isAvailable: boolean;
}

interface CarListProps {
  onRentCar: (carId: number) => void;
}

const CarList: React.FC<CarListProps> = ({ onRentCar }) => {
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

  const handleRentCar = (carId: number) => {
    onRentCar(carId);
  };

  return (
    <div className="container mx-auto px-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading cars...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{car.name}</h3>
                    <p className="text-gray-600">{car.model}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {car.year}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl font-bold text-blue-600">
                    ${car.rentalPricePerDay}
                    <span className="text-sm text-gray-500 font-normal">/day</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${car.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {car.isAvailable ? 'Available' : 'Rented'}
                  </span>
                </div>
                <button
                  onClick={() => handleRentCar(car.id)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${car.isAvailable
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-200 cursor-not-allowed text-gray-500'}`}
                  disabled={!car.isAvailable}
                >
                  {car.isAvailable ? 'Rent Now' : 'Not Available'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarList;
