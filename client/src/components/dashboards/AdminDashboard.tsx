import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Tab, 
  Tabs, 
  Typography, 
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  People as PeopleIcon,
  DirectionsCar as CarIcon,
  BookOnline as BookingIcon,
  BarChart as AnalyticsIcon,
  Assignment as ReportIcon,
  Campaign as MarketingIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import api from '../../services/api';
import UserManagement from './admin/UserManagement';
import CarListingManagement from './admin/CarListingManagement';
import BookingsView from './admin/BookingsView';
import RevenueAnalytics from './admin/RevenueAnalytics';
import ReportsLogs from './admin/ReportsLogs';
import Marketing from './admin/Marketing';
import PlatformSettings from './admin/PlatformSettings';
import { useAuth } from '../../context/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
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
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchNotifications();
    
    // Set up polling for new notifications (every 5 minutes)
    const intervalId = setInterval(fetchNotifications, 5 * 60 * 1000);   
    return () => clearInterval(intervalId);
  }, []);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
  };
  // Check if user has admin role
  if (!user || user.role !== 'admin') {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          You do not have permission to access the Admin Dashboard.
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ flexGrow: 1, mt: 8 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton
            size="large"
            color="inherit"
            onClick={handleNotificationMenuOpen}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <Divider />
        <MenuItem>Logout</MenuItem>
      </Menu>
      
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleMenuClose}
      >
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <MenuItem key={index} onClick={handleMenuClose}>
              {notification.message}
            </MenuItem>
          ))
        ) : (
          <MenuItem>No new notifications</MenuItem>
        )}
      </Menu>
      
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="admin dashboard tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<PeopleIcon />} iconPosition="start" label="User Management" {...a11yProps(0)} />
            <Tab icon={<CarIcon />} iconPosition="start" label="Car Listings" {...a11yProps(1)} />
            <Tab icon={<BookingIcon />} iconPosition="start" label="Bookings" {...a11yProps(2)} />
            <Tab icon={<AnalyticsIcon />} iconPosition="start" label="Revenue & Analytics" {...a11yProps(3)} />
            <Tab icon={<ReportIcon />} iconPosition="start" label="Reports & Logs" {...a11yProps(4)} />
            <Tab icon={<MarketingIcon />} iconPosition="start" label="Marketing" {...a11yProps(5)} />
            <Tab icon={<SettingsIcon />} iconPosition="start" label="Platform Settings" {...a11yProps(6)} />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <UserManagement />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <CarListingManagement />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <BookingsView />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <RevenueAnalytics />
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <ReportsLogs />
          </TabPanel>
          <TabPanel value={tabValue} index={5}>
            <Marketing />
          </TabPanel>
          <TabPanel value={tabValue} index={6}>
            <PlatformSettings />
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;