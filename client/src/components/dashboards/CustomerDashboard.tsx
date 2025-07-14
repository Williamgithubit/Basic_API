import React, { useState } from 'react';
import useReduxAuth from '../../store/hooks/useReduxAuth';

import {
  Box, 
  Typography, 
  Container, 
  Paper, 
  List, 
  ListItemButton,
  ListItemIcon, 
  ListItemText,
  Button,
  Divider,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Stack
} from '@mui/material';
import {
  ListAlt,
  AccessTime,
  Edit,
  CreditCard,
  Star,
  Notifications,
  Person,
  Visibility,
  Cancel
} from '@mui/icons-material';

// Define the sidebar navigation items
const sidebarItems = [
  { id: 'bookings', label: 'My Bookings', icon: <ListAlt /> },
  { id: 'status', label: 'Booking Status', icon: <AccessTime /> },
  { id: 'modify', label: 'Cancel/Modify', icon: <Edit /> },
  { id: 'payments', label: 'Payment History', icon: <CreditCard /> },
  { id: 'reviews', label: 'Reviews & Ratings', icon: <Star /> },
  { id: 'notifications', label: 'Notifications', icon: <Notifications /> },
  { id: 'profile', label: 'Profile & Preferences', icon: <Person /> }
];

const CustomerDashboard: React.FC = () => {
  // Use Redux auth hook instead of context
  const { user } = useReduxAuth();
  const [activeSection, setActiveSection] = useState('bookings');

  // Placeholder content for each section
  const renderContent = () => {
    switch (activeSection) {
      case 'bookings':
        return (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>My Bookings</Typography>
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" color="primary" size="small">All</Button>
                <Button variant="outlined" color="inherit" size="small">Pending</Button>
                <Button variant="outlined" color="inherit" size="small">Active</Button>
                <Button variant="outlined" color="inherit" size="small">Completed</Button>
                <Button variant="outlined" color="inherit" size="small">Cancelled</Button>
              </Stack>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell>Car</TableCell>
                    <TableCell>Dates</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Toyota Camry</TableCell>
                    <TableCell>Jul 10 - Jul 17, 2025</TableCell>
                    <TableCell>
                      <Chip 
                        label="Confirmed" 
                        color="success" 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>$350.00</TableCell>
                    <TableCell>
                      <Button 
                        startIcon={<Visibility />} 
                        color="primary" 
                        size="small" 
                        sx={{ mr: 1 }}
                      >
                        View
                      </Button>
                      <Button 
                        startIcon={<Cancel />} 
                        color="error" 
                        size="small"
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Honda Civic</TableCell>
                    <TableCell>Aug 5 - Aug 12, 2025</TableCell>
                    <TableCell>
                      <Chip 
                        label="Pending" 
                        color="warning" 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>$280.00</TableCell>
                    <TableCell>
                      <Button 
                        startIcon={<Visibility />} 
                        color="primary" 
                        size="small" 
                        sx={{ mr: 1 }}
                      >
                        View
                      </Button>
                      <Button 
                        startIcon={<Cancel />} 
                        color="error" 
                        size="small"
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        );
      case 'status':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Booking Status</h2>
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                <div className="ml-4">
                  <h3 className="font-semibold">Booking Confirmed</h3>
                  <p className="text-sm text-gray-600">July 8, 2025 - 10:30 AM</p>
                </div>
              </div>
              <div className="w-0.5 h-8 bg-gray-300 ml-4"></div>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">⚙️</div>
                <div className="ml-4">
                  <h3 className="font-semibold">Pickup Scheduled</h3>
                  <p className="text-sm text-gray-600">July 10, 2025 - 9:00 AM</p>
                </div>
              </div>
              <div className="w-0.5 h-8 bg-gray-300 ml-4"></div>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">🚗</div>
                <div className="ml-4">
                  <h3 className="font-semibold">Active Rental</h3>
                  <p className="text-sm text-gray-600">July 10 - July 17, 2025</p>
                </div>
              </div>
              <div className="w-0.5 h-8 bg-gray-300 ml-4"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">✓</div>
                <div className="ml-4">
                  <h3 className="font-semibold">Return</h3>
                  <p className="text-sm text-gray-600">July 17, 2025 - 9:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'modify':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Cancel / Modify Booking</h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Toyota Camry</h3>
              <p className="text-gray-600 mb-4">Booking #12345 • Jul 10 - Jul 17, 2025</p>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Modify Dates</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
                    <input type="date" className="w-full border rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                    <input type="date" className="w-full border rounded-md px-3 py-2" />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Modify Location</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                    <select className="w-full border rounded-md px-3 py-2">
                      <option>Downtown Office</option>
                      <option>Airport Terminal</option>
                      <option>North Branch</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Location</label>
                    <select className="w-full border rounded-md px-3 py-2">
                      <option>Downtown Office</option>
                      <option>Airport Terminal</option>
                      <option>North Branch</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Cancel Booking</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Cancellation</label>
                  <select className="w-full border rounded-md px-3 py-2 mb-2">
                    <option>Change of plans</option>
                    <option>Found better option</option>
                    <option>Emergency</option>
                    <option>Other</option>
                  </select>
                  <textarea className="w-full border rounded-md px-3 py-2" rows={3} placeholder="Additional details..."></textarea>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Save Changes</button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md">Cancel Booking</button>
              </div>
            </div>
          </div>
        );
      case 'payments':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Payment History & Invoices</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Booking</th>
                    <th className="py-2 px-4 text-left">Amount</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">Jul 8, 2025</td>
                    <td className="py-2 px-4">Toyota Camry (#12345)</td>
                    <td className="py-2 px-4">$350.00</td>
                    <td className="py-2 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Paid</span></td>
                    <td className="py-2 px-4">
                      <button className="text-blue-600 hover:underline">Download</button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Jun 15, 2025</td>
                    <td className="py-2 px-4">Ford Focus (#12289)</td>
                    <td className="py-2 px-4">$220.00</td>
                    <td className="py-2 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Paid</span></td>
                    <td className="py-2 px-4">
                      <button className="text-blue-600 hover:underline">Download</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Reviews & Ratings</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Booking</label>
                <select className="w-full border rounded-md px-3 py-2">
                  <option>Toyota Camry (Jul 10 - Jul 17, 2025)</option>
                  <option>Ford Focus (Jun 10 - Jun 17, 2025)</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="text-2xl text-yellow-400">★</button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                <textarea className="w-full border rounded-md px-3 py-2" rows={3} placeholder="Share your experience..."></textarea>
              </div>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Submit Review</button>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Your Past Reviews</h3>
              
              <div className="mb-6 p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Ford Focus</h4>
                    <div className="flex text-yellow-400 my-1">★★★★★</div>
                    <p className="text-sm text-gray-600">Jun 10 - Jun 17, 2025</p>
                  </div>
                  <span className="text-sm text-gray-500">Posted on Jun 18, 2025</span>
                </div>
                <p className="mt-2">Great car, very clean and fuel efficient. The pickup process was smooth and the staff was friendly.</p>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Notifications & Reminders</h2>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Notifications</h3>
                <button className="text-sm text-blue-600">Mark all as read</button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Booking Confirmation</h4>
                    <span className="text-xs text-gray-500">Today</span>
                  </div>
                  <p className="text-sm mt-1">Your booking for Toyota Camry has been confirmed. Pickup on Jul 10, 2025.</p>
                </div>
                
                <div className="p-4 bg-gray-50 border-l-4 border-gray-300 rounded-r-lg">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Special Offer</h4>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <p className="text-sm mt-1">Get 15% off on your next booking! Use code SUMMER15.</p>
                </div>
                
                <div className="p-4 bg-gray-50 border-l-4 border-gray-300 rounded-r-lg">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Payment Received</h4>
                    <span className="text-xs text-gray-500">1 week ago</span>
                  </div>
                  <p className="text-sm mt-1">Payment of $350.00 for booking #12345 has been processed successfully.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Booking Confirmations</h4>
                    <p className="text-sm text-gray-600">Receive notifications when your booking is confirmed</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="booking-toggle" className="sr-only" defaultChecked />
                    <div className="w-10 h-5 bg-gray-300 rounded-full"></div>
                    <div className="absolute w-5 h-5 bg-white rounded-full shadow -left-1 -top-0 transition"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Reminders</h4>
                    <p className="text-sm text-gray-600">Receive reminders before pickup and return dates</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="reminder-toggle" className="sr-only" defaultChecked />
                    <div className="w-10 h-5 bg-gray-300 rounded-full"></div>
                    <div className="absolute w-5 h-5 bg-white rounded-full shadow -left-1 -top-0 transition"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Special Offers</h4>
                    <p className="text-sm text-gray-600">Receive notifications about discounts and promotions</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="offers-toggle" className="sr-only" defaultChecked />
                    <div className="w-10 h-5 bg-gray-300 rounded-full"></div>
                    <div className="absolute w-5 h-5 bg-white rounded-full shadow -left-1 -top-0 transition"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Profile & Preferences</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" className="w-full border rounded-md px-3 py-2" defaultValue={user?.name || ''} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full border rounded-md px-3 py-2" defaultValue={user?.email || ''} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" className="w-full border rounded-md px-3 py-2" defaultValue={user?.phone || ''} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" className="w-full border rounded-md px-3 py-2" />
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Preferences</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Car Type</label>
                <select className="w-full border rounded-md px-3 py-2">
                  <option>Economy</option>
                  <option>Compact</option>
                  <option>Mid-size</option>
                  <option>SUV</option>
                  <option>Luxury</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Payment Method</label>
                <select className="w-full border rounded-md px-3 py-2">
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>Mobile Money</option>
                  <option>PayPal</option>
                </select>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input type="password" className="w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input type="password" className="w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input type="password" className="w-full border rounded-md px-3 py-2" />
                </div>
              </div>
            </div>
            
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Save Changes</button>
          </div>
        );
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4, mt: 8 }}>
      <Container>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {/* Sidebar */}
          <Box sx={{ flexBasis: { xs: '100%', md: '25%' } }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6">Customer Dashboard</Typography>
                <Typography variant="body2" color="text.secondary">
                  Welcome, {user?.name}
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <List>
                {sidebarItems.map((item) => (
                  <ListItemButton 
                    key={item.id} 
                    onClick={() => setActiveSection(item.id)}
                    selected={activeSection === item.id}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: activeSection === item.id ? 'primary.light' : 'transparent',
                      color: activeSection === item.id ? 'primary.main' : 'text.primary',
                    }}
                  >
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Box>
          
          {/* Main Content */}
          <Box sx={{ flexBasis: { xs: '100%', md: '70%' }, flexGrow: 1 }}>
            {renderContent()}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CustomerDashboard;
