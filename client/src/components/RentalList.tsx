import React, { useState, useEffect } from 'react';
import api, { type Rental } from '../services/api';

interface RentalListProps {
  onCancelRental: (rentalId: number) => void;
  selectedCustomerId: number | null;
}

const RentalList: React.FC<RentalListProps> = ({ onCancelRental, selectedCustomerId }) => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const rentals = await api.rentals.getAll();
      setRentals(Array.isArray(rentals) ? rentals : []); // Ensure rentals is always an array
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rentals');
      setRentals([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
        {error}
      </div>
    );
  }

  if (!rentals || rentals.length === 0) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg text-center">
        No active rentals found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {rentals.map((rental) => (
        <div key={rental.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {rental.car?.name} {rental.car?.model}
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>Start Date: {new Date(rental.startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(rental.endDate).toLocaleDateString()}</p>
              <p>Total Cost: ${rental.totalCost}</p>
              <p>Customer: {rental.customer?.name}</p>
              <p>Email: {rental.customer?.email}</p>
            </div>
          </div>
          {selectedCustomerId === rental.customerId ? (
            <button
              onClick={() => onCancelRental(rental.id)}
              className="mt-4 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              Cancel Rental
            </button>
          ) : (
            <p className="mt-4 text-sm text-gray-500 italic">
              Rented by {rental.customer?.name}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default RentalList;
