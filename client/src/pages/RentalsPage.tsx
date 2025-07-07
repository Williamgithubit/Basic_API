import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { Rental } from '../services/api';

interface RentalWithCar extends Rental {
  car?: {
    id: number;
    name: string;
    model: string;
    make: string;
    year: number;
  };
}

const RentalsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: rentals = [], isLoading } = useQuery<RentalWithCar[]>({
    queryKey: ['rentals'],
    queryFn: async () => {
      if (!user?.id) return [];
      const rentals = await api.rentals.getAll();
      
      // Fetch car details for each rental
      const rentalsWithCars = await Promise.all(
        rentals.map(async (rental) => {
          try {
            const car = await api.cars.getOne(rental.carId);
            return { ...rental, car };
          } catch (error) {
            console.error(`Failed to fetch car ${rental.carId}:`, error);
            return rental;
          }
        })
      );
      
      return rentalsWithCars;
    },
    enabled: !!user?.id,
  });

  const userRentals = rentals.filter((rental) => rental.customerId === user?.id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Rentals</h1>
      
      {userRentals.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600 mb-4">You don't have any rentals yet</h2>
          <button
            onClick={() => navigate('/cars')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Cars
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userRentals.map((rental: any) => (
            <div key={rental.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">
                {rental.car ? `${rental.car.make} ${rental.car.model} (${rental.car.year})` : `Rental #${rental.id}`}
              </h3>
              {rental.car && (
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Car:</span> {rental.car.name}
                </p>
              )}
              <p className="text-gray-600 mb-2">
                <span className="font-medium">From:</span> {new Date(rental.startDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-medium">To:</span> {new Date(rental.endDate).toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {rental.status || 'Active'}
                </span>
                <button
                  onClick={() => navigate(`/rentals/${rental.id}`)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentalsPage;
