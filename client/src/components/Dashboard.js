import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import CarList from "./CarList";
import RentalList from "./RentalList";
import Navbar from "./Navbar";
const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("cars");
    const [cars, setCars] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const { user } = useAuth();
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [carsData, rentalsData] = await Promise.all([
                api.cars.getAll(),
                api.rentals.getAll(),
            ]);
            setCars(carsData);
            setRentals(rentalsData);
        }
        catch (error) {
            setMessage({
                text: "Failed to fetch data",
                type: "error",
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleRentCar = async (carId) => {
        if (!user) {
            setMessage({
                text: 'Please log in to rent a car',
                type: 'error'
            });
            return;
        }
        const now = new Date();
        const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
        const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days later
        try {
            const rental = await api.rentals.create({
                carId,
                customerId: user.id,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            });
            // Update the rentals list
            setRentals(prev => [...prev, rental]);
            // Update the car's availability
            setCars(prev => prev.map(car => car.id === carId ? { ...car, isAvailable: false } : car));
            setMessage({
                text: 'Car rented successfully',
                type: 'success'
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to rent car';
            setMessage({
                text: errorMessage,
                type: 'error'
            });
            throw error; // Re-throw the error to be handled by CarList
        }
    };
    const handleCancelRental = async (rentalId) => {
        try {
            await api.rentals.delete(rentalId);
            setRentals((prev) => prev.filter((r) => r.id !== rentalId));
            const carsData = await api.cars.getAll();
            setCars(carsData);
            setMessage({
                text: "Rental cancelled successfully",
                type: "success",
            });
        }
        catch (error) {
            setMessage({
                text: error instanceof Error ? error.message : "Failed to cancel rental",
                type: "error",
            });
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx(Navbar, { activeTab: activeTab, onTabChange: setActiveTab }), _jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [user?.name && (_jsxs("div", { className: "text-xl font-semibold", children: ["Welcome, ", user.name] })), _jsxs("div", { className: "hidden md:flex space-x-4", children: [_jsx("button", { onClick: () => setActiveTab("cars"), className: `px-4 py-2 rounded-md ${activeTab === "cars"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-700"}`, children: "Available Cars" }), _jsx("button", { onClick: () => setActiveTab("rentals"), className: `px-4 py-2 rounded-md ${activeTab === "rentals"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-700"}`, children: "My Rentals" })] })] }), message && (_jsx("div", { className: `mb-4 p-4 rounded-lg ${message.type === "success"
                            ? "bg-green-50 text-green-800"
                            : "bg-red-50 text-red-800"}`, children: _jsxs("div", { className: "flex items-center", children: [message.type === "success" ? (_jsx("svg", { className: "w-5 h-5 mr-2", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) })) : (_jsx("svg", { className: "w-5 h-5 mr-2", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) })), message.text] }) })), activeTab === "cars" ? (_jsx(CarList, { cars: cars, onRentCar: handleRentCar, isLoading: isLoading })) : (_jsx(RentalList, { rentals: rentals, onRentalDeleted: handleCancelRental, setMessage: setMessage, isLoading: isLoading }))] })] }));
};
export default Dashboard;
