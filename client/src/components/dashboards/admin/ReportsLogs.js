import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Tabs, Tab, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Download as DownloadIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (_jsx("div", { role: "tabpanel", hidden: value !== index, id: `reports-tabpanel-${index}`, "aria-labelledby": `reports-tab-${index}`, ...other, children: value === index && (_jsx(Box, { sx: { p: 3 }, children: children })) }));
}
const ReportsLogs = () => {
    const [tabValue, setTabValue] = useState(0);
    const [systemLogs, setSystemLogs] = useState([]);
    const [errorReports, setErrorReports] = useState([]);
    const [userActivities, setUserActivities] = useState([]);
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
        }
        catch (error) {
            console.error('Error fetching logs:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setPage(0);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleLogLevelChange = (event) => {
        setLogLevel(event.target.value);
        setPage(0);
    };
    const handleDateRangeChange = (event) => {
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
        }
        catch (error) {
            console.error('Error downloading logs:', error);
        }
    };
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 }, children: [_jsx(Typography, { variant: "h5", component: "h2", children: "Reports & Logs" }), _jsxs(Box, { children: [_jsx(Button, { startIcon: _jsx(RefreshIcon, {}), onClick: handleRefresh, sx: { mr: 1 }, children: "Refresh" }), _jsx(Button, { variant: "contained", startIcon: _jsx(DownloadIcon, {}), onClick: handleDownload, children: "Export" })] })] }), _jsxs(Paper, { sx: { width: '100%', mb: 2 }, children: [_jsx(Box, { sx: { borderBottom: 1, borderColor: 'divider' }, children: _jsxs(Tabs, { value: tabValue, onChange: handleTabChange, "aria-label": "logs tabs", children: [_jsx(Tab, { label: "System Logs" }), _jsx(Tab, { label: "Error Reports" }), _jsx(Tab, { label: "User Activity" })] }) }), _jsxs(Box, { sx: { p: 2, display: 'flex', gap: 2 }, children: [_jsxs(FormControl, { size: "small", sx: { minWidth: 120 }, children: [_jsx(InputLabel, { id: "date-range-label", children: "Time Period" }), _jsxs(Select, { labelId: "date-range-label", value: dateRange, label: "Time Period", onChange: handleDateRangeChange, children: [_jsx(MenuItem, { value: "1d", children: "Last 24 hours" }), _jsx(MenuItem, { value: "7d", children: "Last 7 days" }), _jsx(MenuItem, { value: "30d", children: "Last 30 days" }), _jsx(MenuItem, { value: "90d", children: "Last 90 days" })] })] }), tabValue === 0 && (_jsxs(FormControl, { size: "small", sx: { minWidth: 120 }, children: [_jsx(InputLabel, { id: "log-level-label", children: "Log Level" }), _jsxs(Select, { labelId: "log-level-label", value: logLevel, label: "Log Level", onChange: handleLogLevelChange, children: [_jsx(MenuItem, { value: "all", children: "All Levels" }), _jsx(MenuItem, { value: "info", children: "Info" }), _jsx(MenuItem, { value: "warn", children: "Warning" }), _jsx(MenuItem, { value: "error", children: "Error" }), _jsx(MenuItem, { value: "debug", children: "Debug" })] })] }))] }), _jsx(TabPanel, { value: tabValue, index: 0, children: _jsx(TableContainer, { children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Timestamp" }), _jsx(TableCell, { children: "Level" }), _jsx(TableCell, { children: "Source" }), _jsx(TableCell, { children: "Message" })] }) }), _jsxs(TableBody, { children: [systemLogs
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((log) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: new Date(log.timestamp).toLocaleString() }), _jsx(TableCell, { children: _jsx(Box, { component: "span", sx: {
                                                                px: 1,
                                                                py: 0.5,
                                                                borderRadius: 1,
                                                                backgroundColor: log.level === 'error' ? 'error.light' :
                                                                    log.level === 'warn' ? 'warning.light' :
                                                                        log.level === 'info' ? 'info.light' : 'grey.200',
                                                                color: log.level === 'error' ? 'error.dark' :
                                                                    log.level === 'warn' ? 'warning.dark' :
                                                                        log.level === 'info' ? 'info.dark' : 'grey.800',
                                                            }, children: log.level.toUpperCase() }) }), _jsx(TableCell, { children: log.source }), _jsx(TableCell, { children: log.message })] }, log.id))), systemLogs.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 4, align: "center", children: "No logs found" }) }))] })] }) }) }), _jsx(TabPanel, { value: tabValue, index: 1, children: _jsx(TableContainer, { children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Timestamp" }), _jsx(TableCell, { children: "Error Type" }), _jsx(TableCell, { children: "User ID" }), _jsx(TableCell, { children: "Message" })] }) }), _jsxs(TableBody, { children: [errorReports
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((error) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: new Date(error.timestamp).toLocaleString() }), _jsx(TableCell, { children: error.errorType }), _jsx(TableCell, { children: error.userId || 'N/A' }), _jsx(TableCell, { children: error.message })] }, error.id))), errorReports.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 4, align: "center", children: "No error reports found" }) }))] })] }) }) }), _jsx(TabPanel, { value: tabValue, index: 2, children: _jsx(TableContainer, { children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Timestamp" }), _jsx(TableCell, { children: "User" }), _jsx(TableCell, { children: "Action" }), _jsx(TableCell, { children: "Details" })] }) }), _jsxs(TableBody, { children: [userActivities
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((activity) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: new Date(activity.timestamp).toLocaleString() }), _jsxs(TableCell, { children: [activity.username, " (ID: ", activity.userId, ")"] }), _jsx(TableCell, { children: activity.action }), _jsx(TableCell, { children: activity.details })] }, activity.id))), userActivities.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 4, align: "center", children: "No user activities found" }) }))] })] }) }) }), _jsx(TablePagination, { rowsPerPageOptions: [5, 10, 25], component: "div", count: tabValue === 0 ? systemLogs.length :
                            tabValue === 1 ? errorReports.length :
                                userActivities.length, rowsPerPage: rowsPerPage, page: page, onPageChange: handleChangePage, onRowsPerPageChange: handleChangeRowsPerPage })] })] }));
};
export default ReportsLogs;
