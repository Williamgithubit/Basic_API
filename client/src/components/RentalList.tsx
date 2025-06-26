import React from 'react';
import { type Rental } from '../services/api';

interface RentalListProps {
  rentals: Rental[];
  onCancelRental: (rentalId: number) => void;
  selectedCustomerId: number | null;
}

const RentalList: React.FC<RentalListProps> = ({ rentals, onCancelRental, selectedCustomerId }) => {
  // Filter rentals by selected customer if one is selected
  const filteredRentals = selectedCustomerId
    ? rentals.filter(rental => rental.customerId === selectedCustomerId)
    : rentals;

  if (!filteredRentals || filteredRentals.length === 0) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg text-center">
        {selectedCustomerId 
          ? 'No rentals found for selected customer.'
          : 'No active rentals found.'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {filteredRentals.map((rental) => (
        <div
          key={rental.id}
          className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg font-semibold">
              {rental.car?.name} {rental.car?.model}
            </h3>
            <p className="text-gray-600">
              Customer: {rental.customer?.name}
            </p>
            <p className="text-sm text-gray-500">
              {rental.startDate} to {rental.endDate}
            </p>
            <p className="text-sm font-medium text-blue-600">
              Total Cost: ${rental.totalCost}
            </p>
          </div>
          <button
            onClick={() => onCancelRental(rental.id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            title="Cancel this rental"
          >
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
};

export default RentalList;
