import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, Stack } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, CheckCircle as ApproveIcon, Cancel as RejectIcon, Flag as FlagIcon, Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import Grid from '../../../components/utils/GridWrapper';
const CarListingManagement = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentCar, setCurrentCar] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [flagReason, setFlagReason] = useState('');
    const [openFlagDialog, setOpenFlagDialog] = useState(false);
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
        }
        catch (error) {
            console.error('Error fetching cars:', error);
            setLoading(false);
        }
    };
    const filterCars = () => {
        let filtered = [...cars];
        // Search term filter
        if (searchTerm) {
            filtered = filtered.filter(car => car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.ownerName.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(car => car.status === statusFilter);
        }
        setFilteredCars(filtered);
    };
    const handleOpenDialog = (car) => {
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
    const handleOpenDeleteDialog = (car) => {
        setCurrentCar(car);
        setOpenDeleteDialog(true);
    };
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };
    const handleOpenFlagDialog = (car) => {
        setCurrentCar(car);
        setFlagReason('');
        setOpenFlagDialog(true);
    };
    const handleCloseFlagDialog = () => {
        setOpenFlagDialog(false);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSubmit = async () => {
        if (!currentCar)
            return;
        try {
            // Update car details
            await axios.put(`/api/admin/cars/${currentCar.id}`, formData);
            fetchCars();
            handleCloseDialog();
        }
        catch (error) {
            console.error('Error updating car:', error);
        }
    };
    const handleDeleteCar = async () => {
        if (!currentCar)
            return;
        try {
            await axios.delete(`/api/admin/cars/${currentCar.id}`);
            fetchCars();
            handleCloseDeleteDialog();
        }
        catch (error) {
            console.error('Error deleting car:', error);
        }
    };
    const handleFlagCar = async () => {
        if (!currentCar)
            return;
        try {
            await axios.put(`/api/admin/cars/${currentCar.id}/flag`, { reason: flagReason });
            fetchCars();
            handleCloseFlagDialog();
        }
        catch (error) {
            console.error('Error flagging car:', error);
        }
    };
    const handleApproveCar = async (car) => {
        try {
            await axios.put(`/api/admin/cars/${car.id}/status`, { status: 'approved' });
            fetchCars();
        }
        catch (error) {
            console.error('Error approving car:', error);
        }
    };
    const handleRejectCar = async (car) => {
        try {
            await axios.put(`/api/admin/cars/${car.id}/status`, { status: 'rejected' });
            fetchCars();
        }
        catch (error) {
            console.error('Error rejecting car:', error);
        }
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const getStatusColor = (status) => {
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
    return (_jsxs(Box, { children: [_jsx(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 }, children: _jsx(Typography, { variant: "h5", component: "h2", children: "Car Listing Management" }) }), _jsx(Paper, { sx: { p: 2, mb: 3 }, children: _jsxs(Grid, { container: true, spacing: 2, alignItems: "center", children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "Search Cars (Make, Model, Owner)", variant: "outlined", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), InputProps: {
                                    startAdornment: _jsx(SearchIcon, { color: "action" })
                                } }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Status" }), _jsxs(Select, { value: statusFilter, label: "Status", onChange: (e) => setStatusFilter(e.target.value), children: [_jsx(MenuItem, { value: "all", children: "All Statuses" }), _jsx(MenuItem, { value: "pending", children: "Pending" }), _jsx(MenuItem, { value: "approved", children: "Approved" }), _jsx(MenuItem, { value: "rejected", children: "Rejected" }), _jsx(MenuItem, { value: "flagged", children: "Flagged" })] })] }) })] }) }), _jsxs(TableContainer, { component: Paper, children: [_jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "ID" }), _jsx(TableCell, { children: "Make" }), _jsx(TableCell, { children: "Model" }), _jsx(TableCell, { children: "Year" }), _jsx(TableCell, { children: "Price/Day" }), _jsx(TableCell, { children: "Owner" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { children: "Created" }), _jsx(TableCell, { children: "Actions" })] }) }), _jsx(TableBody, { children: loading ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 9, align: "center", children: "Loading..." }) })) : filteredCars.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 9, align: "center", children: "No car listings found" }) })) : (filteredCars
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((car) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: car.id }), _jsx(TableCell, { children: car.make }), _jsx(TableCell, { children: car.model }), _jsx(TableCell, { children: car.year }), _jsxs(TableCell, { children: ["$", car.price, "/day"] }), _jsx(TableCell, { children: car.ownerName }), _jsx(TableCell, { children: _jsx(Chip, { label: car.status.charAt(0).toUpperCase() + car.status.slice(1), color: getStatusColor(car.status) }) }), _jsx(TableCell, { children: new Date(car.createdAt).toLocaleDateString() }), _jsx(TableCell, { children: _jsxs(Stack, { direction: "row", children: [car.status === 'pending' && (_jsxs(_Fragment, { children: [_jsx(IconButton, { color: "success", onClick: () => handleApproveCar(car), title: "Approve listing", children: _jsx(ApproveIcon, {}) }), _jsx(IconButton, { color: "error", onClick: () => handleRejectCar(car), title: "Reject listing", children: _jsx(RejectIcon, {}) })] })), _jsx(IconButton, { color: "primary", onClick: () => handleOpenDialog(car), title: "Edit details", children: _jsx(EditIcon, {}) }), _jsx(IconButton, { color: "secondary", onClick: () => handleOpenFlagDialog(car), title: "Flag listing", children: _jsx(FlagIcon, {}) }), _jsx(IconButton, { color: "error", onClick: () => handleOpenDeleteDialog(car), title: "Delete listing", children: _jsx(DeleteIcon, {}) })] }) })] }, car.id)))) })] }), _jsx(TablePagination, { rowsPerPageOptions: [5, 10, 25], component: "div", count: filteredCars.length, rowsPerPage: rowsPerPage, page: page, onPageChange: handleChangePage, onRowsPerPageChange: handleChangeRowsPerPage })] }), _jsxs(Dialog, { open: openDialog, onClose: handleCloseDialog, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: "Edit Car Listing" }), _jsx(DialogContent, { children: _jsx(Box, { component: "form", sx: { mt: 1 }, children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Make", name: "make", value: formData.make, onChange: handleInputChange, margin: "normal", required: true }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Model", name: "model", value: formData.model, onChange: handleInputChange, margin: "normal", required: true }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Year", name: "year", type: "number", value: formData.year, onChange: handleInputChange, margin: "normal", required: true }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { fullWidth: true, label: "Price per Day", name: "price", type: "number", value: formData.price, onChange: handleInputChange, margin: "normal", required: true, InputProps: {
                                                startAdornment: _jsx("span", { children: "$" }),
                                            } }) })] }) }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleCloseDialog, children: "Cancel" }), _jsx(Button, { onClick: handleSubmit, variant: "contained", color: "primary", children: "Save Changes" })] })] }), _jsxs(Dialog, { open: openFlagDialog, onClose: handleCloseFlagDialog, children: [_jsx(DialogTitle, { children: "Flag Car Listing" }), _jsxs(DialogContent, { children: [_jsx(Typography, { gutterBottom: true, children: "Please provide a reason for flagging this listing:" }), _jsx(TextField, { fullWidth: true, multiline: true, rows: 4, value: flagReason, onChange: (e) => setFlagReason(e.target.value), margin: "normal", placeholder: "e.g., Misleading information, duplicate listing, policy violation, etc.", required: true })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleCloseFlagDialog, children: "Cancel" }), _jsx(Button, { onClick: handleFlagCar, variant: "contained", color: "secondary", disabled: !flagReason.trim(), children: "Flag Listing" })] })] }), _jsxs(Dialog, { open: openDeleteDialog, onClose: handleCloseDeleteDialog, children: [_jsx(DialogTitle, { children: "Confirm Deletion" }), _jsx(DialogContent, { children: _jsxs(Typography, { children: ["Are you sure you want to delete the ", currentCar?.make, " ", currentCar?.model, " listing? This action cannot be undone."] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleCloseDeleteDialog, children: "Cancel" }), _jsx(Button, { onClick: handleDeleteCar, variant: "contained", color: "error", children: "Delete" })] })] })] }));
};
export default CarListingManagement;
