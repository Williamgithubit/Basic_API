import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import api from '../../../services/api';
import Grid from '../../../components/utils/GridWrapper';
import axios from 'axios';
const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentUser, setCurrentUser] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'customer',
        status: 'active',
        password: ''
    });
    useEffect(() => {
        fetchUsers();
    }, []);
    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, roleFilter, statusFilter]);
    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Import the API service at the top of the file
            const response = await api.admin.getUsers();
            // Map API response to match our User interface
            const mappedUsers = response.map((user) => ({
                ...user,
                status: user.status || 'active' // Provide default status if not present in API response
            }));
            setUsers(mappedUsers);
            setLoading(false);
        }
        catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };
    const filterUsers = () => {
        let filtered = [...users];
        // Search term filter
        if (searchTerm) {
            filtered = filtered.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        // Role filter
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }
        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(user => user.status === statusFilter);
        }
        setFilteredUsers(filtered);
    };
    const handleOpenDialog = (user = null) => {
        if (user) {
            setCurrentUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                password: '' // We don't get the password from the server
            });
        }
        else {
            setCurrentUser(null);
            setFormData({
                name: '',
                email: '',
                role: 'customer',
                status: 'active',
                password: ''
            });
        }
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleOpenDeleteDialog = (user) => {
        setCurrentUser(user);
        setOpenDeleteDialog(true);
    };
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };
    // Use a more generic type for event handling that works with MUI Select
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSubmit = async () => {
        try {
            if (currentUser) {
                // Update existing user
                await axios.put(`/api/admin/users/${currentUser.id}`, {
                    ...formData,
                    // Only include password if it's been changed
                    ...(formData.password ? { password: formData.password } : {})
                });
            }
            else {
                // Create new user
                await axios.post('/api/admin/users', formData);
            }
            fetchUsers();
            handleCloseDialog();
        }
        catch (error) {
            console.error('Error saving user:', error);
        }
    };
    const handleDeleteUser = async () => {
        if (!currentUser)
            return;
        try {
            await axios.delete(`/api/admin/users/${currentUser.id}`);
            fetchUsers();
            handleCloseDeleteDialog();
        }
        catch (error) {
            console.error('Error deleting user:', error);
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
            case 'active':
                return 'success';
            case 'suspended':
                return 'warning';
            case 'banned':
                return 'error';
            default:
                return 'default';
        }
    };
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 }, children: [_jsx(Typography, { variant: "h5", component: "h2", children: "User Management" }), _jsx(Button, { variant: "contained", color: "primary", startIcon: _jsx(AddIcon, {}), onClick: () => handleOpenDialog(), children: "Add New User" })] }), _jsx(Paper, { sx: { p: 2, mb: 3 }, children: _jsxs(Box, { sx: { display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, alignItems: 'center' }, children: [_jsx(Box, { children: _jsx(TextField, { fullWidth: true, label: "Search Users", variant: "outlined", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), InputProps: {
                                    startAdornment: _jsx(SearchIcon, { color: "action" })
                                } }) }), _jsx(Box, { children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Role" }), _jsxs(Select, { value: roleFilter, label: "Role", onChange: (e) => setRoleFilter(e.target.value), children: [_jsx(MenuItem, { value: "all", children: "All Roles" }), _jsx(MenuItem, { value: "customer", children: "Customer" }), _jsx(MenuItem, { value: "owner", children: "Owner" }), _jsx(MenuItem, { value: "admin", children: "Admin" })] })] }) }), _jsx(Box, { children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Status" }), _jsxs(Select, { value: statusFilter, label: "Status", onChange: (e) => setStatusFilter(e.target.value), children: [_jsx(MenuItem, { value: "all", children: "All Statuses" }), _jsx(MenuItem, { value: "active", children: "Active" }), _jsx(MenuItem, { value: "suspended", children: "Suspended" }), _jsx(MenuItem, { value: "banned", children: "Banned" })] })] }) })] }) }), _jsxs(TableContainer, { component: Paper, children: [_jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "ID" }), _jsx(TableCell, { children: "Name" }), _jsx(TableCell, { children: "Email" }), _jsx(TableCell, { children: "Role" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { children: "Created At" }), _jsx(TableCell, { children: "Actions" })] }) }), _jsx(TableBody, { children: loading ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 7, align: "center", children: "Loading..." }) })) : filteredUsers.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 7, align: "center", children: "No users found" }) })) : (filteredUsers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((user) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: user.id }), _jsx(TableCell, { children: user.name }), _jsx(TableCell, { children: user.email }), _jsx(TableCell, { children: _jsx(Chip, { label: user.role.charAt(0).toUpperCase() + user.role.slice(1), color: user.role === 'admin' ? 'primary' : 'default' }) }), _jsx(TableCell, { children: _jsx(Chip, { label: user.status.charAt(0).toUpperCase() + user.status.slice(1), color: getStatusColor(user.status) }) }), _jsx(TableCell, { children: new Date(user.createdAt).toLocaleDateString() }), _jsxs(TableCell, { children: [_jsx(IconButton, { color: "primary", onClick: () => handleOpenDialog(user), children: _jsx(EditIcon, {}) }), _jsx(IconButton, { color: "error", onClick: () => handleOpenDeleteDialog(user), children: _jsx(DeleteIcon, {}) })] })] }, user.id)))) })] }), _jsx(TablePagination, { rowsPerPageOptions: [5, 10, 25], component: "div", count: filteredUsers.length, rowsPerPage: rowsPerPage, page: page, onPageChange: handleChangePage, onRowsPerPageChange: handleChangeRowsPerPage })] }), _jsxs(Dialog, { open: openDialog, onClose: handleCloseDialog, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: currentUser ? 'Edit User' : 'Add New User' }), _jsx(DialogContent, { children: _jsx(Box, { component: "form", sx: { mt: 1 }, children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Name", name: "name", value: formData.name, onChange: handleInputChange, margin: "normal", required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: "Email", name: "email", type: "email", value: formData.email, onChange: handleInputChange, margin: "normal", required: true }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsxs(FormControl, { fullWidth: true, margin: "normal", children: [_jsx(InputLabel, { children: "Role" }), _jsxs(Select, { name: "role", value: formData.role, label: "Role", onChange: handleInputChange, children: [_jsx(MenuItem, { value: "customer", children: "Customer" }), _jsx(MenuItem, { value: "owner", children: "Owner" }), _jsx(MenuItem, { value: "admin", children: "Admin" })] })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsxs(FormControl, { fullWidth: true, margin: "normal", children: [_jsx(InputLabel, { children: "Status" }), _jsxs(Select, { name: "status", value: formData.status, label: "Status", onChange: handleInputChange, children: [_jsx(MenuItem, { value: "active", children: "Active" }), _jsx(MenuItem, { value: "suspended", children: "Suspended" }), _jsx(MenuItem, { value: "banned", children: "Banned" })] })] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { fullWidth: true, label: currentUser ? "Password (leave blank to keep current)" : "Password", name: "password", type: "password", value: formData.password, onChange: handleInputChange, margin: "normal", required: !currentUser }) })] }) }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleCloseDialog, children: "Cancel" }), _jsx(Button, { onClick: handleSubmit, variant: "contained", color: "primary", children: "Save" })] })] }), _jsxs(Dialog, { open: openDeleteDialog, onClose: handleCloseDeleteDialog, children: [_jsx(DialogTitle, { children: "Confirm Deletion" }), _jsx(DialogContent, { children: _jsxs(Typography, { children: ["Are you sure you want to delete the user \"", currentUser?.name, "\"? This action cannot be undone."] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleCloseDeleteDialog, children: "Cancel" }), _jsx(Button, { onClick: handleDeleteUser, variant: "contained", color: "error", children: "Delete" })] })] })] }));
};
export default UserManagement;
