import React from 'react';

interface NavbarProps {
  activeTab: 'cars' | 'rentals';
  onTabChange: (tab: 'cars' | 'rentals') => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white shadow-lg mb-6 rounded-lg p-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="text-2xl font-bold text-gray-800">Car Rental Service</div>
          <div className="flex space-x-4 items-center">

            <button
              onClick={() => onTabChange('cars')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'cars' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Cars
            </button>
            <button
              onClick={() => onTabChange('rentals')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'rentals' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Rentals
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
