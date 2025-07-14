import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import CarList from "./CarList";
import RentalList from "./RentalList";
import Navbar from "./Navbar";
import useCars from "../store/hooks/useCars";
import useRentals from "../store/hooks/useRentals";
import { toast } from "react-toastify";
const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("cars");
    const [cars, setCars] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const { user } = useAuth();
    // Use Redux hooks for cars and rentals
    const { cars: carData, isLoading: isLoadingCars, error: carsError } = useCars();
    const { rentals: rentalData, isLoading: isLoadingRentals, error: rentalsError, addRental } = useRentals();
    useEffect(() => {
        // Set cars and rentals from Redux state
        if (carData) {
            // Map Car data to match CarCardProps expected by CarList
            const mappedCars = carData.map(car => ({
                ...car,
                isLiked: false, // This will be updated by the CarList component
                isAvailable: car.isAvailable,
                imageUrl: car.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image', // Provide default image URL
                name: car.name, // Map make to name
                brand: car.brand,
                model: car.model,
                year: car.year,
                seats: 5, // Default value
                fuelType: 'Petrol', // Default value
                location: 'Local', // Default value
                features: [], // Default value
                rating: 4.5, // Default value
                reviews: 10, // Default value
                rentalPricePerDay: car.dailyRate,
                description: `${car.name} ${car.model} ${car.year}`, // Generate description
            }));
            setCars(mappedCars);
        }
        if (rentalData) {
            setRentals(rentalData);
        }
        // Show error toasts if needed
        if (carsError) {
            toast.error("Failed to fetch car data");
            setMessage({
                text: "Failed to fetch car data",
                type: "error",
            });
        }
        if (rentalsError) {
            toast.error("Failed to fetch rental data");
            setMessage({
                text: "Failed to fetch rental data",
                type: "error",
            });
        }
    }, [carData, rentalData, carsError, rentalsError]);
    // Update loading state based on Redux loading states
    useEffect(() => {
        setIsLoading(isLoadingCars || isLoadingRentals);
    }, [isLoadingCars, isLoadingRentals]);
    const handleRentCar = async (carId) => {
        if (!user) {
            toast.error('Please log in to rent a car');
            setMessage({
                text: 'Please log in to rent a car',
                type: 'error'
            });
            return;
        }
        // Check if user has already rented this car
        const hasAlreadyRented = rentalData?.some((rental) => rental.carId === carId && rental.customerId === user.id);
        if (hasAlreadyRented) {
            toast.error("You have already rented this car.");
            return;
        }
        const now = new Date();
        const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
        const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days later
        try {
            // Use the addRental function from useRentals hook
            const { addRental } = useRentals();
            await addRental({
                carId,
                customerId: user.id,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            });
            // No need to manually update state as Redux will handle it
            toast.success('Car rented successfully');
            setMessage({
                text: 'Car rented successfully',
                type: 'success'
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to rent car';
            toast.error(errorMessage);
            setMessage({
                text: errorMessage,
                type: 'error'
            });
            throw error; // Re-throw the error to be handled by CarList
        }
    };
    const handleCancelRental = async (rentalId) => {
        try {
            // Use the cancelRentalById function from useRentals hook
            const { cancelRentalById } = useRentals();
            await cancelRentalById(rentalId);
            // No need to manually update state as Redux will handle it
            toast.success("Rental cancelled successfully");
            setMessage({
                text: "Rental cancelled successfully",
                type: "success",
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to cancel rental";
            toast.error(errorMessage);
            setMessage({
                text: errorMessage,
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
