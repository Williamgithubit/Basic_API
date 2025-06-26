import React from 'react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface CustomerSelectProps {
  customers: Customer[];
  selectedCustomerId: number | null;
  onSelectCustomer: (customerId: number) => void;
}

const CustomerSelect: React.FC<CustomerSelectProps> = ({
  customers,
  selectedCustomerId,
  onSelectCustomer,
}) => {
  if (customers.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-yellow-800 text-sm">
          No customers found. Please add a customer to proceed with rentals.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-2">
        Select Customer
      </label>
      <div className="relative">
        <select
          id="customer"
          value={selectedCustomerId || ''}
          onChange={(e) => onSelectCustomer(Number(e.target.value))}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
        >
          <option value="">Select a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} ({customer.email})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CustomerSelect;
