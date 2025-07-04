// App.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </Suspense>
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<BrowseCars />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </Router>
      <Toaster position="top-center" />
    </AuthProvider>
  );
};

export default App;
