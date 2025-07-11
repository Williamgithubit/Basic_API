import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';

// Lazy load components
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const DashboardRouter = lazy(() => import('./components/DashboardRouter'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const RoleProtectedRoute = lazy(() => import('./components/RoleProtectedRoute'));
const Home = lazy(() => import('./pages/Home'));
const BrowseCars = lazy(() => import('./components/BrowseCars'));
const RoleTest = lazy(() => import('./components/RoleTest'));

// Lazy load dashboard components
const CustomerDashboard = lazy(() => import('./components/dashboards/CustomerDashboard'));
const OwnerDashboard = lazy(() => import('./components/dashboards/OwnerDashboard'));
const AdminDashboard = lazy(() => import('./components/dashboards/AdminDashboard'));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  console.log('AppContent rendering', { isAuthenticated });

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Legacy dashboard route - redirects to role-specific dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />
        
        {/* Role-specific dashboard routes */}
        <Route
          path="/dashboard/customer"
          element={
            <RoleProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/dashboard/owner"
          element={
            <RoleProtectedRoute allowedRoles={['owner']}>
              <OwnerDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />
        
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<BrowseCars />} />
        <Route path="/role-test" element={<ProtectedRoute><RoleTest /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  console.log('Rendering App component');
  return (
    <div className="app-container" style={{ padding: '0', width: '100%' }}>
      {!isAuthPage && (
        <>
          <Header />
        </>
       
      )}
      <AppContent />
      <Toaster position="top-center" />
    </div>
  );
};

export default App;
