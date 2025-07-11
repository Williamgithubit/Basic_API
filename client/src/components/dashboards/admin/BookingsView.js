import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, Tooltip } from '@mui/material';
import { Visibility as ViewIcon, GetApp as ExportIcon, Search as SearchIcon, FilterAlt as FilterIcon, Print as PrintIcon } from '@mui/icons-material';
import axios from 'axios';
import Grid from '../../../components/utils/GridWrapper';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
const BookingsView = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [openExportDialog, setOpenExportDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentBooking, setCurrentBooking] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [startDateFilter, setStartDateFilter] = useState(null);
    const [endDateFilter, setEndDateFilter] = useState(null);
    const [exportFormat, setExportFormat] = useState('csv');
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
        }
        catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    };
    const filterBookings = () => {
        let filtered = [...bookings];
        // Search term filter (car or customer)
        if (searchTerm) {
            filtered = filtered.filter(booking => booking.carMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        }
        // Date range filter
        if (startDateFilter) {
            filtered = filtered.filter(booking => new Date(booking.startDate) >= startDateFilter);
        }
        if (endDateFilter) {
            filtered = filtered.filter(booking => new Date(booking.endDate) <= endDateFilter);
        }
        setFilteredBookings(filtered);
    };
    const handleOpenDetailsDialog = (booking) => {
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
            if (statusFilter !== 'all')
                params.append('status', statusFilter);
            if (searchTerm)
                params.append('search', searchTerm);
            if (startDateFilter)
                params.append('startDate', startDateFilter.toISOString());
            if (endDateFilter)
                params.append('endDate', endDateFilter.toISOString());
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
        }
        catch (error) {
            console.error('Error exporting bookings:', error);
        }
    };
    const handlePrintBookings = () => {
        window.print();
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
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 }, children: [_jsx(Typography, { variant: "h5", component: "h2", children: "Bookings Management" }), _jsxs(Box, { children: [_jsx(Button, { variant: "outlined", startIcon: _jsx(ExportIcon, {}), onClick: handleOpenExportDialog, sx: { mr: 1 }, children: "Export Data" }), _jsx(Button, { variant: "outlined", startIcon: _jsx(PrintIcon, {}), onClick: handlePrintBookings, children: "Print" })] })] }), _jsxs(Paper, { sx: { p: 2, mb: 3 }, children: [_jsxs(Grid, { container: true, spacing: 2, alignItems: "center", children: [_jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(TextField, { fullWidth: true, label: "Search (Car/Customer)", variant: "outlined", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), InputProps: {
                                        startAdornment: _jsx(SearchIcon, { color: "action" })
                                    } }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Status" }), _jsxs(Select, { value: statusFilter, label: "Status", onChange: (e) => setStatusFilter(e.target.value), children: [_jsx(MenuItem, { value: "all", children: "All Statuses" }), _jsx(MenuItem, { value: "pending", children: "Pending" }), _jsx(MenuItem, { value: "active", children: "Active" }), _jsx(MenuItem, { value: "completed", children: "Completed" }), _jsx(MenuItem, { value: "cancelled", children: "Cancelled" })] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(LocalizationProvider, { dateAdapter: AdapterDateFns, children: _jsx(DatePicker, { label: "From Date", value: startDateFilter, onChange: (newValue) => setStartDateFilter(newValue), slotProps: { textField: { fullWidth: true } } }) }) }), _jsx(Grid, { item: true, xs: 12, md: 3, children: _jsx(LocalizationProvider, { dateAdapter: AdapterDateFns, children: _jsx(DatePicker, { label: "To Date", value: endDateFilter, onChange: (newValue) => setEndDateFilter(newValue), slotProps: { textField: { fullWidth: true } } }) }) })] }), _jsx(Grid, { container: true, sx: { mt: 2 }, children: _jsx(Grid, { item: true, xs: 12, children: _jsx(Button, { variant: "contained", color: "primary", startIcon: _jsx(FilterIcon, {}), onClick: () => {
                                    setStartDateFilter(null);
                                    setEndDateFilter(null);
                                    setStatusFilter('all');
                                    setSearchTerm('');
                                }, children: "Clear Filters" }) }) })] }), _jsxs(TableContainer, { component: Paper, children: [_jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "ID" }), _jsx(TableCell, { children: "Car" }), _jsx(TableCell, { children: "Customer" }), _jsx(TableCell, { children: "Start Date" }), _jsx(TableCell, { children: "End Date" }), _jsx(TableCell, { children: "Total Cost" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { children: "Created" }), _jsx(TableCell, { children: "Actions" })] }) }), _jsx(TableBody, { children: loading ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 9, align: "center", children: "Loading..." }) })) : filteredBookings.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 9, align: "center", children: "No bookings found" }) })) : (filteredBookings
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((booking) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: booking.id }), _jsx(TableCell, { children: `${booking.carMake} ${booking.carModel}` }), _jsx(TableCell, { children: booking.customerName }), _jsx(TableCell, { children: new Date(booking.startDate).toLocaleDateString() }), _jsx(TableCell, { children: new Date(booking.endDate).toLocaleDateString() }), _jsxs(TableCell, { children: ["$", booking.totalCost.toFixed(2)] }), _jsx(TableCell, { children: _jsx(Chip, { label: booking.status.charAt(0).toUpperCase() + booking.status.slice(1), color: getStatusColor(booking.status) }) }), _jsx(TableCell, { children: new Date(booking.createdAt).toLocaleDateString() }), _jsx(TableCell, { children: _jsx(Tooltip, { title: "View Details", children: _jsx(IconButton, { color: "primary", onClick: () => handleOpenDetailsDialog(booking), children: _jsx(ViewIcon, {}) }) }) })] }, booking.id)))) })] }), _jsx(TablePagination, { rowsPerPageOptions: [5, 10, 25, 50], component: "div", count: filteredBookings.length, rowsPerPage: rowsPerPage, page: page, onPageChange: handleChangePage, onRowsPerPageChange: handleChangeRowsPerPage })] }), _jsxs(Dialog, { open: openDetailsDialog, onClose: handleCloseDetailsDialog, maxWidth: "md", fullWidth: true, children: [_jsx(DialogTitle, { children: "Booking Details" }), _jsx(DialogContent, { children: currentBooking && (_jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 12, sm: 6, children: [_jsx(Typography, { variant: "subtitle1", fontWeight: "bold", children: "Booking Information" }), _jsxs(Typography, { children: ["ID: ", currentBooking.id] }), _jsxs(Typography, { children: ["Status: ", currentBooking.status] }), _jsxs(Typography, { children: ["Created: ", new Date(currentBooking.createdAt).toLocaleString()] }), _jsxs(Typography, { children: ["Start Date: ", new Date(currentBooking.startDate).toLocaleDateString()] }), _jsxs(Typography, { children: ["End Date: ", new Date(currentBooking.endDate).toLocaleDateString()] }), _jsxs(Typography, { children: ["Total Cost: $", currentBooking.totalCost.toFixed(2)] })] }), _jsxs(Grid, { item: true, xs: 12, sm: 6, children: [_jsx(Typography, { variant: "subtitle1", fontWeight: "bold", children: "Car Information" }), _jsxs(Typography, { children: ["ID: ", currentBooking.carId] }), _jsxs(Typography, { children: ["Make: ", currentBooking.carMake] }), _jsxs(Typography, { children: ["Model: ", currentBooking.carModel] }), _jsx(Typography, { variant: "subtitle1", fontWeight: "bold", sx: { mt: 2 }, children: "Customer Information" }), _jsxs(Typography, { children: ["ID: ", currentBooking.customerId] }), _jsxs(Typography, { children: ["Name: ", currentBooking.customerName] })] })] })) }), _jsx(DialogActions, { children: _jsx(Button, { onClick: handleCloseDetailsDialog, children: "Close" }) })] }), _jsxs(Dialog, { open: openExportDialog, onClose: handleCloseExportDialog, children: [_jsx(DialogTitle, { children: "Export Bookings Data" }), _jsxs(DialogContent, { children: [_jsx(Typography, { gutterBottom: true, children: "Choose a format to export the filtered bookings data:" }), _jsxs(FormControl, { fullWidth: true, sx: { mt: 2 }, children: [_jsx(InputLabel, { children: "Export Format" }), _jsxs(Select, { value: exportFormat, label: "Export Format", onChange: (e) => setExportFormat(e.target.value), children: [_jsx(MenuItem, { value: "csv", children: "CSV" }), _jsx(MenuItem, { value: "xlsx", children: "Excel (XLSX)" }), _jsx(MenuItem, { value: "pdf", children: "PDF" }), _jsx(MenuItem, { value: "json", children: "JSON" })] })] })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleCloseExportDialog, children: "Cancel" }), _jsx(Button, { onClick: handleExport, variant: "contained", color: "primary", children: "Export" })] })] })] }));
};
export default BookingsView;
