import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Car, Rental } from '../services/api';
import CarList from './CarList';
import RentalList from './RentalList';

type Tab = 'cars' | 'rentals';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('cars');
  const [cars, setCars] = useState<Car[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'cars') {
        const response = await api.cars.getAll();
        setCars(response.data);
      } else {
        const response = await api.rentals.getActive();
        setRentals(response.data);
      }
    } catch (error) {
      setMessage({ text: 'Failed to load data', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRentCar = async (carId: number) => {
    try {
      await api.rentals.create({
        carId,
        startDate: new Date().toISOString().split('T')[0],
        // Set end date to 7 days from now
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      
      setMessage({ text: 'Car rented successfully', type: 'success' });
      loadData(); // Refresh the car list
    } catch (error: any) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to rent car', 
        type: 'error' 
      });
    }
  };

  const handleCancelRental = async (rentalId: number) => {
    try {
      await api.rentals.delete(rentalId);
      await loadData(); // Refresh the rentals list after cancellation
    } catch (error) {
      throw error; // Let RentalList component handle the error
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600">
          {activeTab === 'cars' ? 'Browse and rent available cars' : 'Manage your active rentals'}
        </p>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {message.text}
          </div>
        </div>
      )}

      {activeTab === 'cars' ? (
        <CarList 
          cars={cars} 
          onRentCar={handleRentCar} 
          isLoading={isLoading} 
        />
      ) : (
        <RentalList 
          rentals={rentals} 
          onRentalDeleted={handleCancelRental}
          setMessage={setMessage}
          isLoading={isLoading} 
        />
      )}
    </div>
  );
};

export default Dashboard;
