import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CarList from './components/CarList';
import RentalList from './components/RentalList';
import CustomerSelect from './components/CustomerSelect';
import api from './services/api';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'cars' | 'rentals'>('cars');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.customers.getAll();
        if (Array.isArray(response)) {
          setCustomers(response);
          // Only set the first customer if no customer is selected and we have customers
          if (response.length > 0 && !selectedCustomerId) {
            setSelectedCustomerId(response[0].id);
          }
        } else {
          setCustomers([]);
          setMessage({
            text: 'No customers available. Please add a customer to proceed.',
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCustomers([]);
        setMessage({
          text: error instanceof Error ? error.message : 'Failed to fetch customers',
          type: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []); // Remove selectedCustomerId from dependency array to prevent infinite loop

  const handleRentCar = async (carId: number) => {
    if (!selectedCustomerId) {
      setMessage({ text: 'Please select a customer first', type: 'error' });
      return;
    }

    try {
      // Get current date in UTC
      const now = new Date();
      
      // Set start date to next day in UTC
      const startDate = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1
      ));
      
      // Set end date to 7 days after start date
      const endDate = new Date(Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate() + 7
      ));

      const rentalData = {
        carId,
        customerId: selectedCustomerId,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };

      console.log('Creating rental with data:', rentalData);
      await api.rentals.create(rentalData);

      setMessage({ text: 'Car rented successfully', type: 'success' });
      setActiveTab('rentals');
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'Failed to rent car',
        type: 'error'
      });
    }
  };

  const handleCancelRental = async (rentalId: number) => {
    try {
      await api.rentals.cancel(rentalId);
      setMessage({ text: 'Rental cancelled successfully', type: 'success' });
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'Failed to cancel rental',
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="container mx-auto px-4 py-8">
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex justify-between items-center ${message.type === 'success' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'}`}
          >
            <span>{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="text-sm hover:text-gray-600"
            >
              ×
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="mb-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <CustomerSelect
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            onSelectCustomer={setSelectedCustomerId}
          />
        )}

        {activeTab === 'cars' && (
          <CarList onRentCar={handleRentCar} />
        )}
        {activeTab === 'rentals' && (
          <RentalList onCancelRental={handleCancelRental} selectedCustomerId={selectedCustomerId} />
        )}
      </div>
    </div>
  );
}

export default App;
