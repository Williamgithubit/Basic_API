import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState, Suspense } from "react";
import CarList from "./CarList";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "./Header";
import toast from "react-hot-toast";
import api from "../services/api";
import Modal from "react-modal";
import Confetti from "react-confetti";
// Custom hook to get window size
const useWindowSize = () => {
    const [windowSize, setWindowSize] = React.useState({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
    });
    React.useEffect(() => {
        if (typeof window === "undefined")
            return;
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
};
const BrowseCars = () => {
    const [cars, setCars] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [tab, setTab] = useState("available");
    const [isLoading, setIsLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    useEffect(() => {
        fetchData();
    }, [user, isAuthenticated]); // Add isAuthenticated to dependencies
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const carsData = await api.cars.getAll();
            setCars(carsData);
            if (isAuthenticated) {
                const rentalsData = await api.rentals.getAll();
                setRentals(rentalsData);
            }
            else {
                setRentals([]);
            }
        }
        catch (error) {
            toast.error("Failed to fetch car data");
            if (error instanceof Error)
                console.error(error.message);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleRentCar = async (carId) => {
        if (!user || user.id === 0) {
            setShowLoginModal(true);
            return;
        }
        const hasAlreadyRented = rentals.some((rental) => rental.carId === carId && rental.customerId === user.id);
        if (hasAlreadyRented) {
            toast.error("You have already rented this car.");
            return;
        }
        const now = new Date();
        const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        try {
            const rental = await api.rentals.create({
                carId,
                customerId: user.id,
                startDate: startDate.toISOString().split("T")[0],
                endDate: endDate.toISOString().split("T")[0],
            });
            setRentals((prev) => [...prev, rental]);
            setCars((prev) => prev.map((car) => car.id === carId ? { ...car, isAvailable: false } : car));
            toast.success("Car rented successfully");
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
        catch (error) {
            toast.error("Failed to rent car");
            if (error instanceof Error)
                console.error(error.message);
            throw error;
        }
    };
    const availableCars = cars.filter((car) => car.isAvailable);
    const rentedCars = isAuthenticated
        ? cars.filter((car) => !car.isAvailable)
        : [];
    const userRentals = user ? rentals.filter((rental) => rental.customerId === user.id) : [];
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsxs("section", { className: "py-16 px-4 md:px-10 lg:px-20 bg-gray-50 min-h-screen mt-12", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-800 mb-8 text-center", children: "Browse Cars for Rent" }), _jsxs("div", { className: "flex justify-center gap-4 mb-6", children: [_jsx("button", { onClick: () => setTab("available"), className: `px-4 py-2 rounded ${tab === "available"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-800"}`, children: "Available Cars" }), isAuthenticated && (_jsx("button", { onClick: () => setTab("rented"), className: `px-4 py-2 rounded ${tab === "rented"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-800"}`, children: "Rented Cars" }))] }), _jsx(CarList, { cars: tab === "available" ? availableCars : rentedCars, onRentCar: handleRentCar, isLoading: isLoading }), user && userRentals.length > 0 && (_jsxs("div", { className: "mt-12", children: [_jsx("h3", { className: "text-2xl font-semibold text-gray-800 mb-4", children: "Your Rental History" }), _jsx("ul", { className: "space-y-3", children: userRentals.map((rental) => {
                                    const rentedCar = cars.find((car) => car.id === rental.carId);
                                    return (_jsxs("li", { className: "p-4 bg-white shadow rounded", children: [_jsxs("p", { children: [_jsx("strong", { children: "Car:" }), " ", rentedCar?.name || "N/A"] }), _jsxs("p", { children: [_jsx("strong", { children: "From:" }), " ", rental.startDate, " \u00A0", _jsx("strong", { children: "To:" }), " ", rental.endDate] })] }, rental.id));
                                }) })] }))] }), showConfetti && (_jsx(Confetti, { width: width, height: height, recycle: false, numberOfPieces: 500 })), _jsx(Suspense, { fallback: null, children: showLoginModal && (_jsx(Modal, { isOpen: showLoginModal, onRequestClose: () => setShowLoginModal(false), contentLabel: "Login Required", className: "modal", overlayClassName: "modal-overlay", children: _jsxs("div", { className: "bg-white p-6 rounded-lg max-w-md w-full mx-auto mt-20", children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Login Required" }), _jsx("p", { className: "mb-6", children: "You need to be logged in to rent a car." }), _jsxs("div", { className: "flex justify-end space-x-4", children: [_jsx("button", { onClick: () => setShowLoginModal(false), className: "px-4 py-2 bg-gray-200 rounded hover:bg-gray-300", children: "Cancel" }), _jsx("button", { onClick: () => navigate("/login"), className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "Go to Login" })] })] }) })) })] }));
};
Modal.setAppElement("#root");
export default BrowseCars;
