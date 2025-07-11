import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Container, Tab, Tabs, Typography, Paper, AppBar, Toolbar, IconButton, Badge, Menu, MenuItem, Divider } from '@mui/material';
import { People as PeopleIcon, DirectionsCar as CarIcon, BookOnline as BookingIcon, BarChart as AnalyticsIcon, Assignment as ReportIcon, Campaign as MarketingIcon, Settings as SettingsIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import api from '../../services/api';
import UserManagement from './admin/UserManagement';
import CarListingManagement from './admin/CarListingManagement';
import BookingsView from './admin/BookingsView';
import RevenueAnalytics from './admin/RevenueAnalytics';
import ReportsLogs from './admin/ReportsLogs';
import Marketing from './admin/Marketing';
import PlatformSettings from './admin/PlatformSettings';
import { useAuth } from '../../context/AuthContext';
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (_jsx("div", { role: "tabpanel", hidden: value !== index, id: `admin-tabpanel-${index}`, "aria-labelledby": `admin-tab-${index}`, ...other, children: value === index && (_jsx(Box, { sx: { p: 3 }, children: children })) }));
}
function a11yProps(index) {
    return {
        id: `admin-tab-${index}`,
        'aria-controls': `admin-tabpanel-${index}`,
    };
}
const AdminDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();
    // Debug: Log user object to see what's happening
    console.log('AdminDashboard - User object:', user);
    console.log('AdminDashboard - User role:', user?.role);
    useEffect(() => {
        // Fetch notifications
        const fetchNotifications = async () => {
            try {
                const response = await api.admin.getNotifications();
                setNotifications(response);
            }
            catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        fetchNotifications();
        // Set up polling for new notifications (every 5 minutes)
        const intervalId = setInterval(fetchNotifications, 5 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleNotificationMenuOpen = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setNotificationAnchorEl(null);
    };
    // Check if user has admin role
    if (!user || user.role !== 'admin') {
        return (_jsxs(Box, { sx: { p: 4, textAlign: 'center' }, children: [_jsx(Typography, { variant: "h5", color: "error", children: "Access Denied" }), _jsx(Typography, { variant: "body1", sx: { mt: 2 }, children: "You do not have permission to access the Admin Dashboard." })] }));
    }
    return (_jsxs(Box, { sx: { flexGrow: 1, mt: 8 }, children: [_jsx(AppBar, { position: "static", children: _jsxs(Toolbar, { children: [_jsx(Typography, { variant: "h6", component: "div", sx: { flexGrow: 1 }, children: "Admin Dashboard" }), _jsx(IconButton, { size: "large", color: "inherit", onClick: handleNotificationMenuOpen, children: _jsx(Badge, { badgeContent: notifications.length, color: "error", children: _jsx(NotificationsIcon, {}) }) }), _jsx(IconButton, { size: "large", edge: "end", onClick: handleProfileMenuOpen, color: "inherit", children: _jsx(AccountCircleIcon, {}) })] }) }), _jsxs(Menu, { anchorEl: anchorEl, open: Boolean(anchorEl), onClose: handleMenuClose, children: [_jsx(MenuItem, { children: "Profile" }), _jsx(MenuItem, { children: "Settings" }), _jsx(Divider, {}), _jsx(MenuItem, { children: "Logout" })] }), _jsx(Menu, { anchorEl: notificationAnchorEl, open: Boolean(notificationAnchorEl), onClose: handleMenuClose, children: notifications.length > 0 ? (notifications.map((notification, index) => (_jsx(MenuItem, { onClick: handleMenuClose, children: notification.message }, index)))) : (_jsx(MenuItem, { children: "No new notifications" })) }), _jsx(Container, { maxWidth: false, sx: { mt: 4 }, children: _jsxs(Paper, { sx: { width: '100%' }, children: [_jsxs(Tabs, { value: tabValue, onChange: handleTabChange, "aria-label": "admin dashboard tabs", variant: "scrollable", scrollButtons: "auto", children: [_jsx(Tab, { icon: _jsx(PeopleIcon, {}), iconPosition: "start", label: "User Management", ...a11yProps(0) }), _jsx(Tab, { icon: _jsx(CarIcon, {}), iconPosition: "start", label: "Car Listings", ...a11yProps(1) }), _jsx(Tab, { icon: _jsx(BookingIcon, {}), iconPosition: "start", label: "Bookings", ...a11yProps(2) }), _jsx(Tab, { icon: _jsx(AnalyticsIcon, {}), iconPosition: "start", label: "Revenue & Analytics", ...a11yProps(3) }), _jsx(Tab, { icon: _jsx(ReportIcon, {}), iconPosition: "start", label: "Reports & Logs", ...a11yProps(4) }), _jsx(Tab, { icon: _jsx(MarketingIcon, {}), iconPosition: "start", label: "Marketing", ...a11yProps(5) }), _jsx(Tab, { icon: _jsx(SettingsIcon, {}), iconPosition: "start", label: "Platform Settings", ...a11yProps(6) })] }), _jsx(TabPanel, { value: tabValue, index: 0, children: _jsx(UserManagement, {}) }), _jsx(TabPanel, { value: tabValue, index: 1, children: _jsx(CarListingManagement, {}) }), _jsx(TabPanel, { value: tabValue, index: 2, children: _jsx(BookingsView, {}) }), _jsx(TabPanel, { value: tabValue, index: 3, children: _jsx(RevenueAnalytics, {}) }), _jsx(TabPanel, { value: tabValue, index: 4, children: _jsx(ReportsLogs, {}) }), _jsx(TabPanel, { value: tabValue, index: 5, children: _jsx(Marketing, {}) }), _jsx(TabPanel, { value: tabValue, index: 6, children: _jsx(PlatformSettings, {}) })] }) })] }));
};
export default AdminDashboard;
