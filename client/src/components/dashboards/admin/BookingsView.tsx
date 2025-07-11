import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Tooltip
} from '@mui/material';
import {
  Visibility as ViewIcon,
  GetApp as ExportIcon,
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import axios from 'axios';
import Grid from '../../../components/utils/GridWrapper';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface Booking {
  id: number;
  carId: number;
  carMake: string;
  carModel: string;
  customerId: number;
  customerName: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

const BookingsView: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const [openExportDialog, setOpenExportDialog] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
  const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);
  const [exportFormat, setExportFormat] = useState<string>('csv');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, startDateFilter, endDateFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/bookings');
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];
    
    // Search term filter (car or customer)
    if (searchTerm) {
      filtered = filtered.filter(
        booking => 
          booking.carMake.toLowerCase().includes(searchTerm.toLowerCase()) || 
          booking.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    
    // Date range filter
    if (startDateFilter) {
      filtered = filtered.filter(booking => 
        new Date(booking.startDate) >= startDateFilter
      );
    }
    
    if (endDateFilter) {
      filtered = filtered.filter(booking => 
        new Date(booking.endDate) <= endDateFilter
      );
    }
    
    setFilteredBookings(filtered);
  };

  const handleOpenDetailsDialog = (booking: Booking) => {
    setCurrentBooking(booking);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
  };

  const handleOpenExportDialog = () => {
    setOpenExportDialog(true);
  };

  const handleCloseExportDialog = () => {
    setOpenExportDialog(false);
  };

  const handleExport = async () => {
    try {
      // Define query parameters
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      if (startDateFilter) params.append('startDate', startDateFilter.toISOString());
      if (endDateFilter) params.append('endDate', endDateFilter.toISOString());
      params.append('format', exportFormat);
      
      // Request export
      const response = await axios.get(`/api/admin/bookings/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Set file name based on format
      const dateStr = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `bookings-${dateStr}.${exportFormat}`);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      handleCloseExportDialog();
    } catch (error) {
      console.error('Error exporting bookings:', error);
    }
  };

  const handlePrintBookings = () => {
    window.print();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Bookings Management
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<ExportIcon />}
            onClick={handleOpenExportDialog}
            sx={{ mr: 1 }}
          >
            Export Data
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />}
            onClick={handlePrintBookings}
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search (Car/Customer)"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="From Date"
                value={startDateFilter}
                onChange={(newValue) => setStartDateFilter(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="To Date"
                value={endDateFilter}
                onChange={(newValue) => setEndDateFilter(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid container sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<FilterIcon />}
              onClick={() => {
                setStartDateFilter(null);
                setEndDateFilter(null);
                setStatusFilter('all');
                setSearchTerm('');
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Bookings Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Car</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Total Cost</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">Loading...</TableCell>
              </TableRow>
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">No bookings found</TableCell>
              </TableRow>
            ) : (
              filteredBookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{`${booking.carMake} ${booking.carModel}`}</TableCell>
                  <TableCell>{booking.customerName}</TableCell>
                  <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(booking.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>${booking.totalCost.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)} 
                      color={getStatusColor(booking.status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton 
                        color="primary"
                        onClick={() => handleOpenDetailsDialog(booking)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredBookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Booking Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={handleCloseDetailsDialog} maxWidth="md" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {currentBooking && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Booking Information</Typography>
                <Typography>ID: {currentBooking.id}</Typography>
                <Typography>Status: {currentBooking.status}</Typography>
                <Typography>Created: {new Date(currentBooking.createdAt).toLocaleString()}</Typography>
                <Typography>Start Date: {new Date(currentBooking.startDate).toLocaleDateString()}</Typography>
                <Typography>End Date: {new Date(currentBooking.endDate).toLocaleDateString()}</Typography>
                <Typography>Total Cost: ${currentBooking.totalCost.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">Car Information</Typography>
                <Typography>ID: {currentBooking.carId}</Typography>
                <Typography>Make: {currentBooking.carMake}</Typography>
                <Typography>Model: {currentBooking.carModel}</Typography>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>Customer Information</Typography>
                <Typography>ID: {currentBooking.customerId}</Typography>
                <Typography>Name: {currentBooking.customerName}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={openExportDialog} onClose={handleCloseExportDialog}>
        <DialogTitle>Export Bookings Data</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Choose a format to export the filtered bookings data:
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Export Format</InputLabel>
            <Select
              value={exportFormat}
              label="Export Format"
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="xlsx">Excel (XLSX)</MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExportDialog}>Cancel</Button>
          <Button onClick={handleExport} variant="contained" color="primary">
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingsView;
