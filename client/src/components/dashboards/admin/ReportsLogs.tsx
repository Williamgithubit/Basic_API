import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Tabs,
  Tab,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Download as DownloadIcon,
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
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
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

interface SystemLog {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  source: string;
}

interface ErrorReport {
  id: number;
  timestamp: string;
  errorType: string;
  message: string;
  stackTrace: string;
  userId?: number;
}

interface UserActivity {
  id: number;
  timestamp: string;
  userId: number;
  username: string;
  action: string;
  details: string;
}

const ReportsLogs: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [errorReports, setErrorReports] = useState<ErrorReport[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [logLevel, setLogLevel] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    fetchData();
  }, [tabValue, logLevel, dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      
      switch (tabValue) {
        case 0: // System Logs
          response = await axios.get('/api/admin/logs/system', {
            params: { level: logLevel, dateRange }
          });
          setSystemLogs(response.data);
          break;
        case 1: // Error Reports
          response = await axios.get('/api/admin/logs/errors', {
            params: { dateRange }
          });
          setErrorReports(response.data);
          break;
        case 2: // User Activity
          response = await axios.get('/api/admin/logs/user-activity', {
            params: { dateRange }
          });
          setUserActivities(response.data);
          break;
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleLogLevelChange = (event: any) => {
    setLogLevel(event.target.value);
    setPage(0);
  };

  const handleDateRangeChange = (event: any) => {
    setDateRange(event.target.value);
    setPage(0);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleDownload = async () => {
    try {
      let endpoint = '';
      let filename = '';
      
      switch (tabValue) {
        case 0:
          endpoint = '/api/admin/logs/system/export';
          filename = 'system-logs.csv';
          break;
        case 1:
          endpoint = '/api/admin/logs/errors/export';
          filename = 'error-reports.csv';
          break;
        case 2:
          endpoint = '/api/admin/logs/user-activity/export';
          filename = 'user-activity.csv';
          break;
      }
      
      const response = await axios.get(endpoint, {
        params: { level: logLevel, dateRange },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading logs:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Reports & Logs
        </Typography>
        <Box>
          <Button 
            startIcon={<RefreshIcon />} 
            onClick={handleRefresh}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Export
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="logs tabs">
            <Tab label="System Logs" />
            <Tab label="Error Reports" />
            <Tab label="User Activity" />
          </Tabs>
        </Box>

        <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="date-range-label">Time Period</InputLabel>
            <Select
              labelId="date-range-label"
              value={dateRange}
              label="Time Period"
              onChange={handleDateRangeChange}
            >
              <MenuItem value="1d">Last 24 hours</MenuItem>
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
            </Select>
          </FormControl>

          {tabValue === 0 && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="log-level-label">Log Level</InputLabel>
              <Select
                labelId="log-level-label"
                value={logLevel}
                label="Log Level"
                onChange={handleLogLevelChange}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="warn">Warning</MenuItem>
                <MenuItem value="error">Error</MenuItem>
                <MenuItem value="debug">Debug</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>

        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {systemLogs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <Box 
                          component="span" 
                          sx={{ 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: 1, 
                            backgroundColor: 
                              log.level === 'error' ? 'error.light' : 
                              log.level === 'warn' ? 'warning.light' : 
                              log.level === 'info' ? 'info.light' : 'grey.200',
                            color: 
                              log.level === 'error' ? 'error.dark' : 
                              log.level === 'warn' ? 'warning.dark' : 
                              log.level === 'info' ? 'info.dark' : 'grey.800',
                          }}
                        >
                          {log.level.toUpperCase()}
                        </Box>
                      </TableCell>
                      <TableCell>{log.source}</TableCell>
                      <TableCell>{log.message}</TableCell>
                    </TableRow>
                  ))}
                {systemLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No logs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Error Type</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {errorReports
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((error) => (
                    <TableRow key={error.id}>
                      <TableCell>{new Date(error.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{error.errorType}</TableCell>
                      <TableCell>{error.userId || 'N/A'}</TableCell>
                      <TableCell>{error.message}</TableCell>
                    </TableRow>
                  ))}
                {errorReports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No error reports found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userActivities
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{activity.username} (ID: {activity.userId})</TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>{activity.details}</TableCell>
                    </TableRow>
                  ))}
                {userActivities.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No user activities found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={
            tabValue === 0 ? systemLogs.length : 
            tabValue === 1 ? errorReports.length : 
            userActivities.length
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default ReportsLogs;
