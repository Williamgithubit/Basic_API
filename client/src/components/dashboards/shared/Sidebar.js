import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { FaCar, FaCalendarAlt, FaMoneyBillWave, FaTools, FaStar, FaEnvelope, FaChartLine, FaUsers, FaCog, FaBars, FaTimes, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
const Sidebar = ({ role, activeSection, onSectionChange }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const { user, logout } = useAuth();
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const sidebarItems = [
        // Customer Items
        { id: 'bookings', label: 'My Bookings', icon: _jsx(FaCalendarAlt, {}), roles: ['customer'] },
        { id: 'booking-status', label: 'Booking Status', icon: _jsx(FaChartLine, {}), roles: ['customer'] },
        { id: 'payments', label: 'Payment History', icon: _jsx(FaMoneyBillWave, {}), roles: ['customer'] },
        { id: 'reviews', label: 'My Reviews', icon: _jsx(FaStar, {}), roles: ['customer'] },
        { id: 'notifications', label: 'Notifications', icon: _jsx(FaEnvelope, {}), roles: ['customer'] },
        { id: 'profile', label: 'My Profile', icon: _jsx(FaUserCircle, {}), roles: ['customer'] },
        // Owner Items
        { id: 'car-listings', label: 'My Car Listings', icon: _jsx(FaCar, {}), roles: ['owner'] },
        { id: 'booking-requests', label: 'Booking Requests', icon: _jsx(FaCalendarAlt, {}), roles: ['owner'] },
        { id: 'earnings', label: 'Earnings', icon: _jsx(FaMoneyBillWave, {}), roles: ['owner'] },
        { id: 'maintenance', label: 'Maintenance', icon: _jsx(FaTools, {}), roles: ['owner'] },
        { id: 'owner-reviews', label: 'Reviews', icon: _jsx(FaStar, {}), roles: ['owner'] },
        { id: 'messaging', label: 'Messaging', icon: _jsx(FaEnvelope, {}), roles: ['owner'] },
        { id: 'analytics', label: 'Analytics', icon: _jsx(FaChartLine, {}), roles: ['owner'] },
        // Admin Items
        { id: 'user-management', label: 'User Management', icon: _jsx(FaUsers, {}), roles: ['admin'] },
        { id: 'car-management', label: 'Car Listings', icon: _jsx(FaCar, {}), roles: ['admin'] },
        { id: 'bookings-overview', label: 'Bookings', icon: _jsx(FaCalendarAlt, {}), roles: ['admin'] },
        { id: 'revenue', label: 'Revenue', icon: _jsx(FaMoneyBillWave, {}), roles: ['admin'] },
        { id: 'reports', label: 'Reports', icon: _jsx(FaChartLine, {}), roles: ['admin'] },
        { id: 'settings', label: 'Settings', icon: _jsx(FaCog, {}), roles: ['admin'] },
    ];
    const filteredItems = sidebarItems.filter(item => item.roles.includes(role));
    const handleLogout = () => {
        logout();
    };
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "md:hidden fixed top-4 left-4 z-50", children: _jsx("button", { onClick: toggleMobileMenu, className: "p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors", children: isMobileMenuOpen ? _jsx(FaTimes, { size: 20 }) : _jsx(FaBars, { size: 20 }) }) }), isMobileMenuOpen && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden", onClick: () => setIsMobileMenuOpen(false) })), _jsxs("div", { className: `fixed top-0 left-0 h-full bg-gray-800 text-white w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isMobileMenuOpen || windowWidth >= 768 ? 'translate-x-0' : '-translate-x-full'}`, children: [_jsxs("div", { className: "p-5 border-b border-gray-700", children: [_jsxs("h2", { className: "text-xl font-bold", children: [role.charAt(0).toUpperCase() + role.slice(1), " Dashboard"] }), _jsxs("p", { className: "text-sm text-gray-400", children: ["Welcome, ", user?.name] })] }), _jsx("nav", { className: "mt-5", children: _jsxs("ul", { className: "space-y-2 px-4", children: [filteredItems.map((item) => (_jsx("li", { children: _jsxs("button", { onClick: () => {
                                            onSectionChange(item.id);
                                            if (windowWidth < 768) {
                                                setIsMobileMenuOpen(false);
                                            }
                                        }, className: `flex items-center w-full p-3 rounded-md transition-colors ${activeSection === item.id
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700'}`, children: [_jsx("span", { className: "mr-3", children: item.icon }), item.label] }) }, item.id))), _jsx("li", { className: "mt-8", children: _jsxs("button", { onClick: handleLogout, className: "flex items-center w-full p-3 rounded-md text-gray-300 hover:bg-red-600 hover:text-white transition-colors", children: [_jsx(FaSignOutAlt, { className: "mr-3" }), "Logout"] }) })] }) })] })] }));
};
export default Sidebar;
