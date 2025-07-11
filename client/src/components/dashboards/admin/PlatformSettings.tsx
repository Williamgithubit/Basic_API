import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
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

interface PlatformConfig {
  appName: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  defaultCurrency: string;
  supportEmail: string;
  minRentalDays: number;
  maxRentalDays: number;
  platformFeePercentage: number;
  allowedPaymentMethods: string[];
  termsLastUpdated: string;
  privacyLastUpdated: string;
}

interface ApiKey {
  id: number;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  permissions: string[];
}

const PlatformSettings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [config, setConfig] = useState<PlatformConfig>({
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
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
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
      } else if (tabValue === 2) {
        const response = await axios.get('/api/admin/settings/api-keys');
        setApiKeys(response.data);
      }
    } catch (error) {
      console.error('Error fetching settings data:', error);
      showSnackbar('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleConfigChange = (field: keyof PlatformConfig, value: any) => {
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
    } catch (error) {
      console.error('Error saving settings:', error);
      showSnackbar('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (type: string) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
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

  const renderGeneralSettings = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        General Settings
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Platform Configuration
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <TextField
                    label="Application Name"
                    fullWidth
                    value={config.appName}
                    onChange={(e) => handleConfigChange('appName', e.target.value)}
                  />
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <TextField
                    label="Support Email"
                    fullWidth
                    value={config.supportEmail}
                    onChange={(e) => handleConfigChange('supportEmail', e.target.value)}
                  />
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Default Currency</InputLabel>
                    <Select
                      value={config.defaultCurrency}
                      label="Default Currency"
                      onChange={(e) => handleConfigChange('defaultCurrency', e.target.value)}
                    >
                      <MenuItem value="USD">USD ($)</MenuItem>
                      <MenuItem value="EUR">EUR (€)</MenuItem>
                      <MenuItem value="GBP">GBP (£)</MenuItem>
                      <MenuItem value="JPY">JPY (¥)</MenuItem>
                      <MenuItem value="CAD">CAD ($)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
                  <TextField
                    label="Platform Fee (%)"
                    type="number"
                    fullWidth
                    value={config.platformFeePercentage}
                    onChange={(e) => handleConfigChange('platformFeePercentage', parseFloat(e.target.value))}
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Rental Settings
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
                <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
                  <TextField
                    label="Minimum Rental Days"
                    type="number"
                    fullWidth
                    value={config.minRentalDays}
                    onChange={(e) => handleConfigChange('minRentalDays', parseInt(e.target.value))}
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
                  <TextField
                    label="Maximum Rental Days"
                    type="number"
                    fullWidth
                    value={config.maxRentalDays}
                    onChange={(e) => handleConfigChange('maxRentalDays', parseInt(e.target.value))}
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <Typography variant="body2" gutterBottom>
                    Allowed Payment Methods
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.allowedPaymentMethods.includes('credit_card')}
                        onChange={(e) => {
                          const methods = e.target.checked
                            ? [...config.allowedPaymentMethods, 'credit_card']
                            : config.allowedPaymentMethods.filter(m => m !== 'credit_card');
                          handleConfigChange('allowedPaymentMethods', methods);
                        }}
                      />
                    }
                    label="Credit Card"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.allowedPaymentMethods.includes('paypal')}
                        onChange={(e) => {
                          const methods = e.target.checked
                            ? [...config.allowedPaymentMethods, 'paypal']
                            : config.allowedPaymentMethods.filter(m => m !== 'paypal');
                          handleConfigChange('allowedPaymentMethods', methods);
                        }}
                      />
                    }
                    label="PayPal"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.allowedPaymentMethods.includes('bank_transfer')}
                        onChange={(e) => {
                          const methods = e.target.checked
                            ? [...config.allowedPaymentMethods, 'bank_transfer']
                            : config.allowedPaymentMethods.filter(m => m !== 'bank_transfer');
                          handleConfigChange('allowedPaymentMethods', methods);
                        }}
                      />
                    }
                    label="Bank Transfer"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ gridColumn: 'span 12' }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Platform Status
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
                <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.maintenanceMode}
                        onChange={(e) => handleConfigChange('maintenanceMode', e.target.checked)}
                      />
                    }
                    label="Maintenance Mode"
                  />
                  <Typography variant="caption" display="block" color="text.secondary">
                    When enabled, only administrators can access the platform
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.registrationEnabled}
                        onChange={(e) => handleConfigChange('registrationEnabled', e.target.checked)}
                      />
                    }
                    label="User Registration"
                  />
                  <Typography variant="caption" display="block" color="text.secondary">
                    Allow new users to register on the platform
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveConfig}
          disabled={loading}
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );

  const renderLegalSettings = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Legal & Compliance
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Terms of Service
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" gutterBottom>
                Last Updated: {new Date(config.termsLastUpdated).toLocaleDateString()}
              </Typography>
              
              <TextField
                label="Terms of Service Content"
                multiline
                rows={10}
                fullWidth
                sx={{ mt: 2 }}
                defaultValue="Terms of service content goes here..."
              />
              
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" startIcon={<SaveIcon />}>
                  Update Terms
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Privacy Policy
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" gutterBottom>
                Last Updated: {new Date(config.privacyLastUpdated).toLocaleDateString()}
              </Typography>
              
              <TextField
                label="Privacy Policy Content"
                multiline
                rows={10}
                fullWidth
                sx={{ mt: 2 }}
                defaultValue="Privacy policy content goes here..."
              />
              
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" startIcon={<SaveIcon />}>
                  Update Privacy Policy
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ gridColumn: 'span 12' }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Cookie Settings
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Essential Cookies (Always Enabled)"
                    disabled
                  />
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Analytics Cookies"
                  />
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Marketing Cookies"
                  />
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <TextField
                    label="Cookie Banner Text"
                    multiline
                    rows={3}
                    fullWidth
                    defaultValue="We use cookies to enhance your experience on our website. By continuing to use our site, you consent to our use of cookies."
                  />
                </Box>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" startIcon={<SaveIcon />}>
                  Save Cookie Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );

  const renderApiSettings = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        API & Integrations
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button 
          startIcon={<RefreshIcon />}
          onClick={fetchData}
        >
          Refresh
        </Button>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('newApiKey')}
        >
          Generate New API Key
        </Button>
      </Box>
      
      <Card>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            API Keys
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List>
            {apiKeys.map((apiKey) => (
              <ListItem key={apiKey.id} divider>
                <ListItemText
                  primary={apiKey.name}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {apiKey.key.substring(0, 8)}...
                      </Typography>
                      {' — '}
                      Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                      {apiKey.lastUsed && `, Last used: ${new Date(apiKey.lastUsed).toLocaleDateString()}`}
                      <br />
                      Permissions: {apiKey.permissions.join(', ')}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleOpenDialog('editApiKey')}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" color="error">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            {apiKeys.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="No API keys found"
                  secondary="Generate a new API key to allow external applications to access your data"
                />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>
      
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Third-Party Integrations
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
            <Box sx={{ gridColumn: 'span 12' }}>
              <FormControlLabel
                control={<Switch />}
                label="Google Maps API"
              />
              <TextField
                label="API Key"
                size="small"
                sx={{ ml: 2 }}
                placeholder="Enter Google Maps API Key"
              />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <FormControlLabel
                control={<Switch />}
                label="Stripe Payment Gateway"
              />
              <TextField
                label="Secret Key"
                size="small"
                sx={{ ml: 2 }}
                placeholder="Enter Stripe Secret Key"
              />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <FormControlLabel
                control={<Switch />}
                label="SendGrid Email Service"
              />
              <TextField
                label="API Key"
                size="small"
                sx={{ ml: 2 }}
                placeholder="Enter SendGrid API Key"
              />
            </Box>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" startIcon={<SaveIcon />}>
              Save Integration Settings
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        Platform Settings
      </Typography>
      
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs">
            <Tab label="General" />
            <Tab label="Legal & Compliance" />
            <Tab label="API & Integrations" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          {renderGeneralSettings()}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {renderLegalSettings()}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {renderApiSettings()}
        </TabPanel>
      </Paper>
      
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'newApiKey' && 'Generate New API Key'}
          {dialogType === 'editApiKey' && 'Edit API Key'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
              <Box sx={{ gridColumn: 'span 12' }}>
                <TextField
                  label="Key Name"
                  fullWidth
                  placeholder="e.g., Mobile App Integration"
                />
              </Box>
              <Box sx={{ gridColumn: 'span 12' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Permissions
                </Typography>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Read Cars"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Read Bookings"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Write Bookings"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="User Management"
                />
              </Box>
              {dialogType === 'newApiKey' && (
                <Box sx={{ gridColumn: 'span 12' }}>
                  <Alert severity="warning">
                    The API key will only be shown once after generation. Please store it securely.
                  </Alert>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            {dialogType === 'newApiKey' ? 'Generate' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlatformSettings;
