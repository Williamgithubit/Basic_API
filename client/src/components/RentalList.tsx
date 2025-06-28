import React from 'react';
import { type Rental } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface RentalListProps {
  rentals: Rental[];
  onRentalDeleted: (rentalId: number) => Promise<void>;
  setMessage: (message: { text: string; type: 'success' | 'error' }) => void;
  isLoading: boolean;
}

const RentalList: React.FC<RentalListProps> = ({ rentals, onRentalDeleted, setMessage, isLoading }) => {
  const { user } = useAuth();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] p-8">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading rentals...</span>
        </div>
      </div>
    );
  }

  if (!rentals || rentals.length === 0) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-100 text-yellow-700 rounded-lg text-center">
        <svg className="w-12 h-12 mx-auto mb-3 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-medium">No active rentals found</p>
        <p className="text-sm mt-1">Your rental history will appear here once you rent a car.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {rentals.map((rental) => (
        <div
          key={rental.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          <div className="p-4 md:p-6">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                      {rental.car?.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Model: {rental.car?.model}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Start Date:</span>
                  <span className="text-sm font-medium">{rental.startDate}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">End Date:</span>
                  <span className="text-sm font-medium">{rental.endDate}</span>
                </div>
                <div className="flex justify-between items-center mb-4 pt-2 border-t border-gray-100">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="text-lg font-semibold text-blue-600">
                    ${rental.totalCost}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={async () => {
                    try {
                      await onRentalDeleted(rental.id);
                      setMessage({ text: 'Rental cancelled successfully', type: 'success' });
                    } catch (error: any) {
                      setMessage({ 
                        text: error.response?.data?.message || 'Failed to cancel rental', 
                        type: 'error' 
                      });
                    }
                  }}
                  className={`w-full px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 ${rental.customerId === user?.id ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  title={rental.customerId === user?.id ? 'Cancel this rental' : 'You cannot cancel this rental'}
                  disabled={new Date(rental.endDate) < new Date() || rental.customerId !== user?.id}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancel Rental</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RentalList;
