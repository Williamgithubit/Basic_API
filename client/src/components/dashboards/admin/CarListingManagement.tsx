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
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Flag as FlagIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import axios from 'axios';
import Grid from '../../../components/utils/GridWrapper';

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  ownerId: number;
  ownerName: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  createdAt: string;
}

const CarListingManagement: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentCar, setCurrentCar] = useState<Car | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [flagReason, setFlagReason] = useState<string>('');
  const [openFlagDialog, setOpenFlagDialog] = useState<boolean>(false);

  // Form state for editing car
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: 0,
    price: 0
  });

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    filterCars();
  }, [cars, searchTerm, statusFilter]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/cars');
      setCars(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setLoading(false);
    }
  };

  const filterCars = () => {
    let filtered = [...cars];
    
    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        car => 
          car.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
          car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(car => car.status === statusFilter);
    }
    
    setFilteredCars(filtered);
  };

  const handleOpenDialog = (car: Car) => {
    setCurrentCar(car);
    setFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (car: Car) => {
    setCurrentCar(car);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenFlagDialog = (car: Car) => {
    setCurrentCar(car);
    setFlagReason('');
    setOpenFlagDialog(true);
  };

  const handleCloseFlagDialog = () => {
    setOpenFlagDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string; value: string | number };
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    if (!currentCar) return;
    
    try {
      // Update car details
      await axios.put(`/api/admin/cars/${currentCar.id}`, formData);
      fetchCars();
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating car:', error);
    }
  };

  const handleDeleteCar = async () => {
    if (!currentCar) return;
    
    try {
      await axios.delete(`/api/admin/cars/${currentCar.id}`);
      fetchCars();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  const handleFlagCar = async () => {
    if (!currentCar) return;
    
    try {
      await axios.put(`/api/admin/cars/${currentCar.id}/flag`, { reason: flagReason });
      fetchCars();
      handleCloseFlagDialog();
    } catch (error) {
      console.error('Error flagging car:', error);
    }
  };

  const handleApproveCar = async (car: Car) => {
    try {
      await axios.put(`/api/admin/cars/${car.id}/status`, { status: 'approved' });
      fetchCars();
    } catch (error) {
      console.error('Error approving car:', error);
    }
  };

  const handleRejectCar = async (car: Car) => {
    try {
      await axios.put(`/api/admin/cars/${car.id}/status`, { status: 'rejected' });
      fetchCars();
    } catch (error) {
      console.error('Error rejecting car:', error);
    }
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
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'flagged':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Car Listing Management
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Cars (Make, Model, Owner)"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" />
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="flagged">Flagged</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Cars Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Make</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Price/Day</TableCell>
              <TableCell>Owner</TableCell>
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
            ) : filteredCars.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">No car listings found</TableCell>
              </TableRow>
            ) : (
              filteredCars
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((car) => (
                <TableRow key={car.id}>
                  <TableCell>{car.id}</TableCell>
                  <TableCell>{car.make}</TableCell>
                  <TableCell>{car.model}</TableCell>
                  <TableCell>{car.year}</TableCell>
                  <TableCell>${car.price}/day</TableCell>
                  <TableCell>{car.ownerName}</TableCell>
                  <TableCell>
                    <Chip 
                      label={car.status.charAt(0).toUpperCase() + car.status.slice(1)} 
                      color={getStatusColor(car.status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(car.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row">
                      {car.status === 'pending' && (
                        <>
                          <IconButton 
                            color="success"
                            onClick={() => handleApproveCar(car)}
                            title="Approve listing"
                          >
                            <ApproveIcon />
                          </IconButton>
                          <IconButton 
                            color="error"
                            onClick={() => handleRejectCar(car)}
                            title="Reject listing"
                          >
                            <RejectIcon />
                          </IconButton>
                        </>
                      )}
                      <IconButton 
                        color="primary"
                        onClick={() => handleOpenDialog(car)}
                        title="Edit details"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="secondary"
                        onClick={() => handleOpenFlagDialog(car)}
                        title="Flag listing"
                      >
                        <FlagIcon />
                      </IconButton>
                      <IconButton 
                        color="error"
                        onClick={() => handleOpenDeleteDialog(car)}
                        title="Delete listing"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCars.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Edit Car Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Car Listing</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Make"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price per Day"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: <span>$</span>,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Flag Listing Dialog */}
      <Dialog open={openFlagDialog} onClose={handleCloseFlagDialog}>
        <DialogTitle>Flag Car Listing</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Please provide a reason for flagging this listing:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            margin="normal"
            placeholder="e.g., Misleading information, duplicate listing, policy violation, etc."
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFlagDialog}>Cancel</Button>
          <Button 
            onClick={handleFlagCar} 
            variant="contained" 
            color="secondary"
            disabled={!flagReason.trim()}
          >
            Flag Listing
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the {currentCar?.make} {currentCar?.model} listing? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteCar} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarListingManagement;
