import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Card, CardContent, Divider, Switch, FormControlLabel, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Tabs, Tab } from '@mui/material';
import { Save as SaveIcon, Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (_jsx("div", { role: "tabpanel", hidden: value !== index, id: `settings-tabpanel-${index}`, "aria-labelledby": `settings-tab-${index}`, ...other, children: value === index && (_jsx(Box, { sx: { p: 3 }, children: children })) }));
}
const PlatformSettings = () => {
    const [tabValue, setTabValue] = useState(0);
    const [config, setConfig] = useState({
        appName: 'Car Rental Service',
        maintenanceMode: false,
        registrationEnabled: true,
        defaultCurrency: 'USD',
        supportEmail: 'support@carrentalservice.com',
        minRentalDays: 1,
        maxRentalDays: 30,
        platformFeePercentage: 10,
        allowedPaymentMethods: ['credit_card', 'paypal'],
        termsLastUpdated: '2025-01-15',
        privacyLastUpdated: '2025-01-15'
    });
    const [apiKeys, setApiKeys] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetchData();
    }, [tabValue]);
    const fetchData = async () => {
        setLoading(true);
        try {
            if (tabValue === 0) {
                const response = await axios.get('/api/admin/settings/config');
                setConfig(response.data);
            }
            else if (tabValue === 2) {
                const response = await axios.get('/api/admin/settings/api-keys');
                setApiKeys(response.data);
            }
        }
        catch (error) {
            console.error('Error fetching settings data:', error);
            showSnackbar('Failed to load settings', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const handleConfigChange = (field, value) => {
        setConfig({
            ...config,
            [field]: value
        });
    };
    const handleSaveConfig = async () => {
        try {
            setLoading(true);
            await axios.put('/api/admin/settings/config', config);
            showSnackbar('Settings saved successfully', 'success');
        }
        catch (error) {
            console.error('Error saving settings:', error);
            showSnackbar('Failed to save settings', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    const handleOpenDialog = (type) => {
        setDialogType(type);
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const showSnackbar = (message, severity) => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };
    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };
    const renderGeneralSettings = () => (_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "General Settings" }), _jsxs(Box, { sx: { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }, children: [_jsx(Box, { sx: { gridColumn: { xs: 'span 12', md: 'span 6' } }, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Platform Configuration" }), _jsx(Divider, { sx: { mb: 2 } }), _jsxs(Box, { sx: { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }, children: [_jsx(Box, { sx: { gridColumn: 'span 12' }, children: _jsx(TextField, { label: "Application Name", fullWidth: true, value: config.appName, onChange: (e) => handleConfigChange('appName', e.target.value) }) }), _jsx(Box, { sx: { gridColumn: 'span 12' }, children: _jsx(TextField, { label: "Support Email", fullWidth: true, value: config.supportEmail, onChange: (e) => handleConfigChange('supportEmail', e.target.value) }) }), _jsx(Box, { sx: { gridColumn: { xs: 'span 12', sm: 'span 6' } }, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Default Currency" }), _jsxs(Select, { value: config.defaultCurrency, label: "Default Currency", onChange: (e) => handleConfigChange('defaultCurrency', e.target.value), children: [_jsx(MenuItem, { value: "USD", children: "USD ($)" }), _jsx(MenuItem, { value: "EUR", children: "EUR (\u20AC)" }), _jsx(MenuItem, { value: "GBP", children: "GBP (\u00A3)" }), _jsx(MenuItem, { value: "JPY", children: "JPY (\u00A5)" }), _jsx(MenuItem, { value: "CAD", children: "CAD ($)" })] })] }) }), _jsx(Box, { sx: { gridColumn: { xs: 'span 12', sm: 'span 6' } }, children: _jsx(TextField, { label: "Platform Fee (%)", type: "number", fullWidth: true, value: config.platformFeePercentage, onChange: (e) => handleConfigChange('platformFeePercentage', parseFloat(e.target.value)), InputProps: { inputProps: { min: 0, max: 100 } } }) })] })] }) }) }), _jsx(Box, { sx: { gridColumn: { xs: 'span 12', md: 'span 6' } }, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Rental Settings" }), _jsx(Divider, { sx: { mb: 2 } }), _jsxs(Box, { sx: { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }, children: [_jsx(Box, { sx: { gridColumn: { xs: 'span 12', sm: 'span 6' } }, children: _jsx(TextField, { label: "Minimum Rental Days", type: "number", fullWidth: true, value: config.minRentalDays, onChange: (e) => handleConfigChange('minRentalDays', parseInt(e.target.value)), InputProps: { inputProps: { min: 1 } } }) }), _jsx(Box, { sx: { gridColumn: { xs: 'span 12', sm: 'span 6' } }, children: _jsx(TextField, { label: "Maximum Rental Days", type: "number", fullWidth: true, value: config.maxRentalDays, onChange: (e) => handleConfigChange('maxRentalDays', parseInt(e.target.value)), InputProps: { inputProps: { min: 1 } } }) }), _jsxs(Box, { sx: { gridColumn: 'span 12' }, children: [_jsx(Typography, { variant: "body2", gutterBottom: true, children: "Allowed Payment Methods" }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: config.allowedPaymentMethods.includes('credit_card'), onChange: (e) => {
                                                                const methods = e.target.checked
                                                                    ? [...config.allowedPaymentMethods, 'credit_card']
                                                                    : config.allowedPaymentMethods.filter(m => m !== 'credit_card');
                                                                handleConfigChange('allowedPaymentMethods', methods);
                                                            } }), label: "Credit Card" }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: config.allowedPaymentMethods.includes('paypal'), onChange: (e) => {
                                                                const methods = e.target.checked
                                                                    ? [...config.allowedPaymentMethods, 'paypal']
                                                                    : config.allowedPaymentMethods.filter(m => m !== 'paypal');
                                                                handleConfigChange('allowedPaymentMethods', methods);
                                                            } }), label: "PayPal" }), _jsx(FormControlLabel, { control: _jsx(Switch, { checked: config.allowedPaymentMethods.includes('bank_transfer'), onChange: (e) => {
                                                                const methods = e.target.checked
                                                                    ? [...config.allowedPaymentMethods, 'bank_transfer']
                                                                    : config.allowedPaymentMethods.filter(m => m !== 'bank_transfer');
                                                                handleConfigChange('allowedPaymentMethods', methods);
                                                            } }), label: "Bank Transfer" })] })] })] }) }) }), _jsx(Box, { sx: { gridColumn: 'span 12' }, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Platform Status" }), _jsx(Divider, { sx: { mb: 2 } }), _jsxs(Box, { sx: { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }, children: [_jsxs(Box, { sx: { gridColumn: { xs: 'span 12', sm: 'span 6' } }, children: [_jsx(FormControlLabel, { control: _jsx(Switch, { checked: config.maintenanceMode, onChange: (e) => handleConfigChange('maintenanceMode', e.target.checked) }), label: "Maintenance Mode" }), _jsx(Typography, { variant: "caption", display: "block", color: "text.secondary", children: "When enabled, only administrators can access the platform" })] }), _jsxs(Box, { sx: { gridColumn: { xs: 'span 12', sm: 'span 6' } }, children: [_jsx(FormControlLabel, { control: _jsx(Switch, { checked: config.registrationEnabled, onChange: (e) => handleConfigChange('registrationEnabled', e.target.checked) }), label: "User Registration" }), _jsx(Typography, { variant: "caption", display: "block", color: "text.secondary", children: "Allow new users to register on the platform" })] })] })] }) }) })] }), _jsx(Box, { sx: { mt: 3, display: 'flex', justifyContent: 'flex-end' }, children: _jsx(Button, { variant: "contained", startIcon: _jsx(SaveIcon, {}), onClick: handleSaveConfig, disabled: loading, children: "Save Settings" }) })] }));
    const renderLegalSettings = () => (_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "Legal & Compliance" }), _jsxs(Box, { sx: { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }, children: [_jsx(Box, { sx: { gridColumn: { xs: 'span 12', md: 'span 6' } }, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Terms of Service" }), _jsx(Divider, { sx: { mb: 2 } }), _jsxs(Typography, { variant: "body2", gutterBottom: true, children: ["Last Updated: ", new Date(config.termsLastUpdated).toLocaleDateString()] }), _jsx(TextField, { label: "Terms of Service Content", multiline: true, rows: 10, fullWidth: true, sx: { mt: 2 }, defaultValue: "Terms of service content goes here..." }), _jsx(Box, { sx: { mt: 2 }, children: _jsx(Button, { variant: "outlined", startIcon: _jsx(SaveIcon, {}), children: "Update Terms" }) })] }) }) }), _jsx(Box, { sx: { gridColumn: { xs: 'span 12', md: 'span 6' } }, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Privacy Policy" }), _jsx(Divider, { sx: { mb: 2 } }), _jsxs(Typography, { variant: "body2", gutterBottom: true, children: ["Last Updated: ", new Date(config.privacyLastUpdated).toLocaleDateString()] }), _jsx(TextField, { label: "Privacy Policy Content", multiline: true, rows: 10, fullWidth: true, sx: { mt: 2 }, defaultValue: "Privacy policy content goes here..." }), _jsx(Box, { sx: { mt: 2 }, children: _jsx(Button, { variant: "outlined", startIcon: _jsx(SaveIcon, {}), children: "Update Privacy Policy" }) })] }) }) }), _jsx(Box, { sx: { gridColumn: 'span 12' }, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Cookie Settings" }), _jsx(Divider, { sx: { mb: 2 } }), _jsxs(Box, { sx: { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }, children: [_jsx(Box, { sx: { gridColumn: 'span 12' }, children: _jsx(FormControlLabel, { control: _jsx(Switch, { defaultChecked: true }), label: "Essential Cookies (Always Enabled)", disabled: true }) }), _jsx(Box, { sx: { gridColumn: 'span 12' }, children: _jsx(FormControlLabel, { control: _jsx(Switch, { defaultChecked: true }), label: "Analytics Cookies" }) }), _jsx(Box, { sx: { gridColumn: 'span 12' }, children: _jsx(FormControlLabel, { control: _jsx(Switch, { defaultChecked: true }), label: "Marketing Cookies" }) }), _jsx(Box, { sx: { gridColumn: 'span 12' }, children: _jsx(TextField, { label: "Cookie Banner Text", multiline: true, rows: 3, fullWidth: true, defaultValue: "We use cookies to enhance your experience on our website. By continuing to use our site, you consent to our use of cookies." }) })] }), _jsx(Box, { sx: { mt: 2 }, children: _jsx(Button, { variant: "outlined", startIcon: _jsx(SaveIcon, {}), children: "Save Cookie Settings" }) })] }) }) })] })] }));
    const renderApiSettings = () => (_jsxs(Box, { children: [_jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "API & Integrations" }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 }, children: [_jsx(Button, { startIcon: _jsx(RefreshIcon, {}), onClick: fetchData, children: "Refresh" }), _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: () => handleOpenDialog('newApiKey'), children: "Generate New API Key" })] }), _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "API Keys" }), _jsx(Divider, { sx: { mb: 2 } }), _jsxs(List, { children: [apiKeys.map((apiKey) => (_jsxs(ListItem, { divider: true, children: [_jsx(ListItemText, { primary: apiKey.name, secondary: _jsxs(_Fragment, { children: [_jsxs(Typography, { component: "span", variant: "body2", color: "text.primary", children: [apiKey.key.substring(0, 8), "..."] }), ' — ', "Created: ", new Date(apiKey.createdAt).toLocaleDateString(), apiKey.lastUsed && `, Last used: ${new Date(apiKey.lastUsed).toLocaleDateString()}`, _jsx("br", {}), "Permissions: ", apiKey.permissions.join(', ')] }) }), _jsxs(ListItemSecondaryAction, { children: [_jsx(IconButton, { edge: "end", "aria-label": "edit", onClick: () => handleOpenDialog('editApiKey'), children: _jsx(EditIcon, {}) }), _jsx(IconButton, { edge: "end", "aria-label": "delete", color: "error", children: _jsx(DeleteIcon, {}) })] })] }, apiKey.id))), apiKeys.length === 0 && (_jsx(ListItem, { children: _jsx(ListItemText, { primary: "No API keys found", secondary: "Generate a new API key to allow external applications to access your data" }) }))] })] }) }), _jsx(Card, { sx: { mt: 3 }, children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Third-Party Integrations" }), _jsx(Divider, { sx: { mb: 2 } }), _jsxs(Box, { sx: { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }, children: [_jsxs(Box, { sx: { gridColumn: 'span 12' }, children: [_jsx(FormControlLabel, { control: _jsx(Switch, {}), label: "Google Maps API" }), _jsx(TextField, { label: "API Key", size: "small", sx: { ml: 2 }, placeholder: "Enter Google Maps API Key" })] }), _jsxs(Box, { sx: { gridColumn: 'span 12' }, children: [_jsx(FormControlLabel, { control: _jsx(Switch, {}), label: "Stripe Payment Gateway" }), _jsx(TextField, { label: "Secret Key", size: "small", sx: { ml: 2 }, placeholder: "Enter Stripe Secret Key" })] }), _jsxs(Box, { sx: { gridColumn: 'span 12' }, children: [_jsx(FormControlLabel, { control: _jsx(Switch, {}), label: "SendGrid Email Service" }), _jsx(TextField, { label: "API Key", size: "small", sx: { ml: 2 }, placeholder: "Enter SendGrid API Key" })] })] }), _jsx(Box, { sx: { mt: 2 }, children: _jsx(Button, { variant: "outlined", startIcon: _jsx(SaveIcon, {}), children: "Save Integration Settings" }) })] }) })] }));
    return (_jsxs(Box, { children: [_jsx(Typography, { variant: "h5", component: "h2", sx: { mb: 3 }, children: "Platform Settings" }), _jsxs(Paper, { sx: { width: '100%' }, children: [_jsx(Box, { sx: { borderBottom: 1, borderColor: 'divider' }, children: _jsxs(Tabs, { value: tabValue, onChange: handleTabChange, "aria-label": "settings tabs", children: [_jsx(Tab, { label: "General" }), _jsx(Tab, { label: "Legal & Compliance" }), _jsx(Tab, { label: "API & Integrations" })] }) }), _jsx(TabPanel, { value: tabValue, index: 0, children: renderGeneralSettings() }), _jsx(TabPanel, { value: tabValue, index: 1, children: renderLegalSettings() }), _jsx(TabPanel, { value: tabValue, index: 2, children: renderApiSettings() })] }), _jsxs(Dialog, { open: openDialog, onClose: handleCloseDialog, maxWidth: "sm", fullWidth: true, children: [_jsxs(DialogTitle, { children: [dialogType === 'newApiKey' && 'Generate New API Key', dialogType === 'editApiKey' && 'Edit API Key'] }), _jsx(DialogContent, { children: _jsx(Box, { sx: { p: 2 }, children: _jsxs(Box, { sx: { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }, children: [_jsx(Box, { sx: { gridColumn: 'span 12' }, children: _jsx(TextField, { label: "Key Name", fullWidth: true, placeholder: "e.g., Mobile App Integration" }) }), _jsxs(Box, { sx: { gridColumn: 'span 12' }, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "Permissions" }), _jsx(FormControlLabel, { control: _jsx(Switch, { defaultChecked: true }), label: "Read Cars" }), _jsx(FormControlLabel, { control: _jsx(Switch, { defaultChecked: true }), label: "Read Bookings" }), _jsx(FormControlLabel, { control: _jsx(Switch, {}), label: "Write Bookings" }), _jsx(FormControlLabel, { control: _jsx(Switch, {}), label: "User Management" })] }), dialogType === 'newApiKey' && (_jsx(Box, { sx: { gridColumn: 'span 12' }, children: _jsx(Alert, { severity: "warning", children: "The API key will only be shown once after generation. Please store it securely." }) }))] }) }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleCloseDialog, children: "Cancel" }), _jsx(Button, { variant: "contained", onClick: handleCloseDialog, children: dialogType === 'newApiKey' ? 'Generate' : 'Save' })] })] }), _jsx(Snackbar, { open: snackbar.open, autoHideDuration: 6000, onClose: handleCloseSnackbar, children: _jsx(Alert, { onClose: handleCloseSnackbar, severity: snackbar.severity, sx: { width: '100%' }, children: snackbar.message }) })] }));
};
export default PlatformSettings;
