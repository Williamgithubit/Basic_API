import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Lazy load components
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const Home = lazy(() => import('./pages/Home'));
const BrowseCars = lazy(() => import('./components/BrowseCars'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const Contact = lazy(() => import('./components/Contact'));
const RentalsPage = lazy(() => import('./pages/RentalsPage'));
const TestPage = lazy(() => import('./pages/TestPage'));



// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const AppContent: React.FC = () => {
  const { isInitialized, isAuthenticated } = useAuth();
  console.log('AppContent rendering', { isInitialized, isAuthenticated });

  if (!isInitialized) {
    console.log('App not initialized, showing loading...');
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
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
        <Route path="/rentals" element={
          <ProtectedRoute>
            <RentalsPage />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<BrowseCars />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<Navigate to="/test" replace />} />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  console.log('Rendering App component');
  return (
    <div className="app-container" style={{ padding: '20px' }}>
      <nav style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
        <Link to="/" style={{ margin: '0 10px', textDecoration: 'none', color: '#333' }}>Home</Link> | 
        <Link to="/cars" style={{ margin: '0 10px', textDecoration: 'none', color: '#333' }}>Cars</Link> | 
        <Link to="/about" style={{ margin: '0 10px', textDecoration: 'none', color: '#333' }}>About</Link> | 
        <Link to="/contact" style={{ margin: '0 10px', textDecoration: 'none', color: '#333' }}>Contact</Link> |
        <Link to="/test" style={{ margin: '0 10px', textDecoration: 'none', color: '#333' }}>Test Page</Link>
      </nav>
      <AppContent />
      <Toaster position="top-center" />
    </div>
  );
};

export default App;
