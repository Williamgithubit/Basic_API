import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import api, { type Rental } from './services/api';
import Navbar from './components/Navbar';
import CarList from './components/CarList';
import RentalList from './components/RentalList';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'cars' | 'rentals'>('cars');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const rentalsResponse = await api.rentals.getAll();
        setRentals(rentalsResponse);
      } catch (error) {
        setMessage({
          text: 'Error fetching data',
          type: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setMessage({
        text: 'Error signing out',
        type: 'error'
      });
    }
  };

  const handleRentalCreated = async (rental: Rental) => {
    setRentals(prev => [...prev, rental]);
    setActiveTab('rentals');
  };

  const handleRentalDeleted = async (rentalId: number) => {
    try {
      await api.rentals.delete(rentalId);
      setRentals(prev => prev.filter(rental => rental.id !== rentalId));
      setMessage({
        text: 'Rental deleted successfully',
        type: 'success'
      });
    } catch (error) {
      setMessage({
        text: 'Failed to delete rental',
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-semibold">
            Welcome, {user?.name}
          </div>
          {/* <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
          >
            Sign Out
          </button> */}
        </div>
        {message && (
          <div
            className={`p-4 mb-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
          >
            {message.text}
          </div>
        )}
        {activeTab === 'cars' ? (
          <CarList
            onRentalCreated={handleRentalCreated}
            setMessage={setMessage}
          />
        ) : (
          <RentalList
            rentals={rentals}
            onRentalDeleted={handleRentalDeleted}
            setMessage={setMessage}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
