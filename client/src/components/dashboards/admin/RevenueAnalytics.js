import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, FormControl, InputLabel, MenuItem, Paper, Select, Typography, useTheme } from '@mui/material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import axios from 'axios';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
const RevenueAnalytics = () => {
    const theme = useTheme();
    const [timeRange, setTimeRange] = useState('month');
    const [revenueData, setRevenueData] = useState([]);
    const [topCars, setTopCars] = useState([]);
    const [topOwners, setTopOwners] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [loading, setLoading] = useState(true);
    // Chart colors
    const CHART_COLORS = [
        '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
        '#82CA9D', '#F06292', '#BA68C8', '#4DB6AC', '#FFD54F'
    ];
    useEffect(() => {
        fetchAnalyticsData();
    }, [timeRange]);
    const fetchAnalyticsData = async () => {
        setLoading(true);
        try {
            // Fetch revenue data
            const revenueResponse = await axios.get(`/api/admin/analytics/revenue?timeRange=${timeRange}`);
            setRevenueData(revenueResponse.data);
            // Fetch top performing cars
            const topCarsResponse = await axios.get(`/api/admin/analytics/top-cars?timeRange=${timeRange}`);
            setTopCars(topCarsResponse.data);
            // Fetch top performing car owners
            const topOwnersResponse = await axios.get(`/api/admin/analytics/top-owners?timeRange=${timeRange}`);
            setTopOwners(topOwnersResponse.data);
            // Fetch payment method stats
            const paymentMethodsResponse = await axios.get(`/api/admin/analytics/payment-methods?timeRange=${timeRange}`);
            setPaymentMethods(paymentMethodsResponse.data);
            // Fetch booking locations
            const locationResponse = await axios.get(`/api/admin/analytics/booking-locations?timeRange=${timeRange}`);
            setLocationData(locationResponse.data);
            setLoading(false);
        }
        catch (error) {
            console.error('Error fetching analytics data:', error);
            setLoading(false);
            // Set dummy data for demonstration
            setDummyData();
        }
    };
    const setDummyData = () => {
        // Revenue data
        const dummyRevenue = [
            { date: '2025-06-10', revenue: 2100, bookings: 7 },
            { date: '2025-06-11', revenue: 1800, bookings: 5 },
            { date: '2025-06-12', revenue: 2400, bookings: 8 },
            { date: '2025-06-13', revenue: 1900, bookings: 6 },
            { date: '2025-06-14', revenue: 3200, bookings: 10 },
            { date: '2025-06-15', revenue: 4100, bookings: 12 },
            { date: '2025-06-16', revenue: 3800, bookings: 11 },
            { date: '2025-06-17', revenue: 2800, bookings: 9 },
            { date: '2025-06-18', revenue: 3100, bookings: 9 },
            { date: '2025-06-19', revenue: 3600, bookings: 11 },
            { date: '2025-07-01', revenue: 2900, bookings: 8 },
            { date: '2025-07-02', revenue: 3400, bookings: 10 },
            { date: '2025-07-03', revenue: 3800, bookings: 11 },
            { date: '2025-07-04', revenue: 4200, bookings: 13 },
            { date: '2025-07-05', revenue: 3900, bookings: 12 },
            { date: '2025-07-06', revenue: 3100, bookings: 9 },
            { date: '2025-07-07', revenue: 3500, bookings: 10 },
            { date: '2025-07-08', revenue: 3700, bookings: 11 },
            { date: '2025-07-09', revenue: 3900, bookings: 12 },
            { date: '2025-07-10', revenue: 4100, bookings: 13 },
        ];
        setRevenueData(dummyRevenue);
        // Top cars
        const dummyCars = [
            { name: 'Toyota Camry 2024', revenue: 8900, bookings: 28 },
            { name: 'Honda Accord 2023', revenue: 7600, bookings: 24 },
            { name: 'Tesla Model 3', revenue: 12400, bookings: 18 },
            { name: 'BMW X5 2024', revenue: 15800, bookings: 16 },
            { name: 'Ford Mustang 2024', revenue: 9200, bookings: 14 }
        ];
        setTopCars(dummyCars);
        // Top owners
        const dummyOwners = [
            { name: 'John Smith', revenue: 23500, bookings: 46 },
            { name: 'Sarah Johnson', revenue: 18700, bookings: 38 },
            { name: 'Michael Brown', revenue: 15400, bookings: 32 },
            { name: 'Emily Davis', revenue: 13200, bookings: 28 },
            { name: 'David Wilson', revenue: 11800, bookings: 24 }
        ];
        setTopOwners(dummyOwners);
        // Payment methods
        const dummyPayments = [
            { method: 'Credit Card', percentage: 45, value: 28900 },
            { method: 'Mobile Money', percentage: 30, value: 19200 },
            { method: 'PayPal', percentage: 15, value: 9600 },
            { method: 'Bank Transfer', percentage: 10, value: 6400 }
        ];
        setPaymentMethods(dummyPayments);
        // Location data (using Ghana coordinates as examples)
        const dummyLocations = [
            { latitude: 5.6037, longitude: -0.1870, count: 42, revenue: 26800 }, // Accra
            { latitude: 6.6885, longitude: -1.6244, count: 28, revenue: 18200 }, // Kumasi
            { latitude: 5.9032, longitude: -0.9520, count: 14, revenue: 8600 }, // Koforidua
            { latitude: 4.8845, longitude: -1.7555, count: 18, revenue: 11400 }, // Cape Coast
            { latitude: 9.4075, longitude: -0.8533, count: 9, revenue: 5800 } // Tamale
        ];
        setLocationData(dummyLocations);
    };
    const formatCurrency = (value) => {
        return `$${value.toLocaleString()}`;
    };
    const getTotalRevenue = () => {
        return revenueData.reduce((sum, item) => sum + item.revenue, 0);
    };
    const getTotalBookings = () => {
        return revenueData.reduce((sum, item) => sum + item.bookings, 0);
    };
    const getAverageDailyRevenue = () => {
        return revenueData.length > 0 ? getTotalRevenue() / revenueData.length : 0;
    };
    const getMonthlyGrowthRate = () => {
        if (revenueData.length < 2)
            return 0;
        // Calculate first and last week revenue
        const firstWeekRevenue = revenueData.slice(0, 7).reduce((sum, item) => sum + item.revenue, 0);
        const lastWeekRevenue = revenueData.slice(-7).reduce((sum, item) => sum + item.revenue, 0);
        return firstWeekRevenue > 0 ? ((lastWeekRevenue - firstWeekRevenue) / firstWeekRevenue) * 100 : 0;
    };
    return (_jsxs(Box, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 }, children: [_jsx(Typography, { variant: "h5", component: "h2", children: "Revenue & Analytics" }), _jsxs(FormControl, { sx: { width: 200 }, children: [_jsx(InputLabel, { children: "Time Range" }), _jsxs(Select, { value: timeRange, label: "Time Range", onChange: (e) => setTimeRange(e.target.value), children: [_jsx(MenuItem, { value: "week", children: "Last 7 Days" }), _jsx(MenuItem, { value: "month", children: "Last 30 Days" }), _jsx(MenuItem, { value: "quarter", children: "Last 90 Days" }), _jsx(MenuItem, { value: "year", children: "Last 365 Days" })] })] })] }), loading ? (_jsx(Box, { sx: { textAlign: 'center', p: 4 }, children: _jsx(Typography, { children: "Loading analytics data..." }) })) : (_jsxs(_Fragment, { children: [_jsxs(Box, { sx: { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3, mb: 4 }, children: [_jsx(Box, { sx: { gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { color: "textSecondary", gutterBottom: true, children: "Total Revenue" }), _jsx(Typography, { variant: "h4", component: "div", children: formatCurrency(getTotalRevenue()) })] }) }) }), _jsx(Box, { sx: { gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { color: "textSecondary", gutterBottom: true, children: "Total Bookings" }), _jsx(Typography, { variant: "h4", component: "div", children: getTotalBookings() })] }) }) }), _jsx(Box, { sx: { gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { color: "textSecondary", gutterBottom: true, children: "Avg. Daily Revenue" }), _jsx(Typography, { variant: "h4", component: "div", children: formatCurrency(getAverageDailyRevenue()) })] }) }) }), _jsx(Box, { sx: { gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { color: "textSecondary", gutterBottom: true, children: "Growth Rate" }), _jsxs(Typography, { variant: "h4", component: "div", color: getMonthlyGrowthRate() >= 0 ? 'success.main' : 'error.main', children: [getMonthlyGrowthRate().toFixed(1), "%"] })] }) }) })] }), _jsxs(Paper, { sx: { p: 3, mb: 4 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Revenue Trends" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: revenueData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date", tick: { fontSize: 12 }, tickFormatter: (value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }), _jsx(YAxis, { yAxisId: "left", tickFormatter: (value) => `$${value}` }), _jsx(YAxis, { yAxisId: "right", orientation: "right" }), _jsx(Tooltip, { formatter: (value, name) => [
                                                name === 'revenue' ? `$${value}` : value,
                                                name === 'revenue' ? 'Revenue' : 'Bookings'
                                            ] }), _jsx(Legend, {}), _jsx(Line, { yAxisId: "left", type: "monotone", dataKey: "revenue", name: "Revenue", stroke: "#8884d8", activeDot: { r: 8 } }), _jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "bookings", name: "Bookings", stroke: "#82ca9d" })] }) })] }), _jsxs(Box, { sx: { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }, children: [_jsx(Box, { sx: { gridColumn: { xs: 'span 12', md: 'span 6' } }, children: _jsxs(Paper, { sx: { p: 3, mb: 4, height: '100%' }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Top Performing Cars" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: topCars, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name", tick: { fontSize: 10 } }), _jsx(YAxis, { tickFormatter: (value) => `$${value}` }), _jsx(Tooltip, { formatter: (value) => [`$${value}`, 'Revenue'] }), _jsx(Legend, {}), _jsx(Bar, { dataKey: "revenue", name: "Revenue", fill: "#8884d8", children: topCars.map((_, index) => (_jsx(Cell, { fill: CHART_COLORS[index % CHART_COLORS.length] }, `cell-${index}`))) })] }) })] }) }), _jsx(Box, { sx: { gridColumn: { xs: 'span 12', md: 'span 6' } }, children: _jsxs(Paper, { sx: { p: 3, mb: 4, height: '100%' }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Top Car Owners" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: topOwners, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name", tick: { fontSize: 10 } }), _jsx(YAxis, { tickFormatter: (value) => `$${value}` }), _jsx(Tooltip, { formatter: (value) => [`$${value}`, 'Revenue'] }), _jsx(Legend, {}), _jsx(Bar, { dataKey: "revenue", name: "Revenue", fill: "#82ca9d", children: topOwners.map((_, index) => (_jsx(Cell, { fill: CHART_COLORS[index % CHART_COLORS.length] }, `cell-${index}`))) })] }) })] }) }), _jsx(Box, { sx: { gridColumn: { xs: 'span 12', md: 'span 6' } }, children: _jsxs(Paper, { sx: { p: 3, mb: 4, height: '100%' }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Payment Method Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: paymentMethods, cx: "50%", cy: "50%", labelLine: false, label: ({ name, percent }) => `${name}: ${(percent ? (percent * 100).toFixed(0) : 0)}%`, outerRadius: 80, fill: "#8884d8", dataKey: "percentage", nameKey: "method", children: paymentMethods.map((entry, index) => (_jsx(Cell, { fill: CHART_COLORS[index % CHART_COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, { formatter: (value, name, props) => [`${value}%`, props.payload.method] }), _jsx(Legend, {})] }) })] }) }), _jsx(Box, { sx: { gridColumn: { xs: 'span 12', md: 'span 6' } }, children: _jsxs(Paper, { sx: { p: 3, mb: 4, height: '100%' }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Booking Heatmap by Location" }), _jsx(Box, { sx: { height: 300, width: '100%' }, children: _jsxs(MapContainer, { center: [5.6037, -0.1870], zoom: 6, style: { height: '100%', width: '100%' }, children: [_jsx(TileLayer, { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }), locationData.map((location, index) => (_jsx(Circle, { center: [location.latitude, location.longitude], radius: location.count * 500, pathOptions: {
                                                            fillColor: '#ff7800',
                                                            fillOpacity: 0.6,
                                                            weight: 1,
                                                            color: '#666',
                                                        }, children: _jsx(Popup, { children: _jsxs(Typography, { variant: "body2", children: ["Bookings: ", location.count, _jsx("br", {}), "Revenue: $", location.revenue.toLocaleString()] }) }) }, index)))] }) })] }) })] })] }))] }));
};
export default RevenueAnalytics;
