import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CarList from './components/CarList';
import RentalList from './components/RentalList';
import CustomerSelect from './components/CustomerSelect';
import api, { type Rental } from './services/api';

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
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [customersResponse, rentalsResponse] = await Promise.all([
          api.customers.getAll(),
          api.rentals.getAll()
        ]);

        if (Array.isArray(customersResponse)) {
          setCustomers(customersResponse);
          if (customersResponse.length > 0 && !selectedCustomerId) {
            setSelectedCustomerId(customersResponse[0].id);
          }
        } else {
          setCustomers([]);
          setMessage({
            text: 'No customers available. Please add a customer to proceed.',
            type: 'error'
          });
        }

        if (Array.isArray(rentalsResponse)) {
          setRentals(rentalsResponse);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setMessage({
          text: error instanceof Error ? error.message : 'Failed to fetch data',
          type: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

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
      const newRental = await api.rentals.create(rentalData);
      
      // Update rentals list with the new rental
      setRentals(prevRentals => [...prevRentals, newRental]);
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
      await api.rentals.delete(rentalId);
      setMessage({ text: 'Rental cancelled successfully', type: 'success' });
      // Refresh the rentals list
      const updatedRentals = await api.rentals.getAll();
      setRentals(updatedRentals);
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
            className={`mb-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        {isLoading ? (
          <div className="text-center">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <CustomerSelect
              customers={customers}
              selectedCustomerId={selectedCustomerId}
              onSelectCustomer={setSelectedCustomerId}
            />
            <div className="mt-6">
              {activeTab === 'cars' ? (
                <CarList onRentCar={handleRentCar} />
              ) : (
                <RentalList
                  rentals={rentals}
                  onCancelRental={handleCancelRental}
                  selectedCustomerId={selectedCustomerId}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
