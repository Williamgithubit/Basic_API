import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
const LoadingFallback = () => (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" }) }));
const AppContent = () => {
    const { isAuthenticated } = useAuth();
    console.log('AppContent rendering', { isAuthenticated });
    return (_jsx(Suspense, { fallback: _jsx(LoadingFallback, {}), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/signup", element: _jsx(Signup, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(DashboardRouter, {}) }) }), _jsx(Route, { path: "/dashboard/customer", element: _jsx(RoleProtectedRoute, { allowedRoles: ['customer'], children: _jsx(CustomerDashboard, {}) }) }), _jsx(Route, { path: "/dashboard/owner", element: _jsx(RoleProtectedRoute, { allowedRoles: ['owner'], children: _jsx(OwnerDashboard, {}) }) }), _jsx(Route, { path: "/dashboard/admin", element: _jsx(RoleProtectedRoute, { allowedRoles: ['admin'], children: _jsx(AdminDashboard, {}) }) }), _jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/cars", element: _jsx(BrowseCars, {}) }), _jsx(Route, { path: "/role-test", element: _jsx(ProtectedRoute, { children: _jsx(RoleTest, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
};
const App = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
    console.log('Rendering App component');
    return (_jsxs("div", { className: "app-container", style: { padding: '0', width: '100%' }, children: [!isAuthPage && (_jsx(_Fragment, { children: _jsx(Header, {}) })), _jsx(AppContent, {}), _jsx(Toaster, { position: "top-center" })] }));
};
export default App;
