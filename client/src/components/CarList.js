import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price || 0);
};
import api from '../services/api';
const CarList = ({ cars = [], onRentCar, isLoading = false }) => {
    const [loadingCarId, setLoadingCarId] = useState(null);
    const [imageErrors, setImageErrors] = useState({});
    const [likedCars, setLikedCars] = useState({});
    const { isAuthenticated } = useAuth();
    const handleImageError = (carId) => {
        setImageErrors(prev => ({
            ...prev,
            [carId]: true
        }));
    };
    const toggleLike = async (carId, e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.info('Please log in to like cars');
            return;
        }
        try {
            // Optimistic UI update
            setLikedCars(prev => ({
                ...prev,
                [carId]: !(prev[carId] ?? false)
            }));
            // Call the API to toggle like
            const response = await api.cars.toggleLike(carId);
            // Update with actual server state
            setLikedCars(prev => ({
                ...prev,
                [carId]: response.isLiked
            }));
        }
        catch (error) {
            console.error('Error toggling like:', error);
            toast.error('Failed to update like status');
            // Revert the UI if the API call fails
            setLikedCars(prev => ({
                ...prev,
                [carId]: prev[carId] === undefined ? false : !prev[carId]
            }));
        }
    };
    useEffect(() => {
        const initialLikes = cars.reduce((acc, car) => {
            // Ensure isLiked is always a boolean
            acc[car.id] = car.isLiked ?? false;
            return acc;
        }, {});
        setLikedCars(initialLikes);
    }, [cars]);
    const handleRentClick = async (carId) => {
        if (!isAuthenticated) {
            toast.info('Please log in to rent a car');
            return;
        }
        setLoadingCarId(carId);
        try {
            await onRentCar(carId);
            toast.success('Car rented successfully');
        }
        catch (error) {
            console.error('Error renting car:', error);
            const errorMessage = error instanceof Error ? error.message : "Failed to rent car";
            toast.error(errorMessage);
        }
        finally {
            setLoadingCarId(null);
        }
    };
    const getCarImageUrl = (car) => {
        if (imageErrors[car.id]) {
            const searchTerm = `${car.brand || 'car'} ${car.model || ''}`.trim();
            return `https://source.unsplash.com/random/300x200/?${encodeURIComponent(searchTerm)}`;
        }
        return car.imageUrl;
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-[300px]", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" }) }));
    }
    if (!Array.isArray(cars) || cars.length === 0) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-[300px] p-4 text-center", children: [_jsx("svg", { className: "h-16 w-16 text-gray-400 mb-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M20 7l-8-4.5L4 7m16 0l-8 4.5M4 7v9.5l8 4.5m0-14l8 4.5M4 16.5l8 4.5 8-4.5m-16-9l8-4.5" }) }), _jsx("h3", { className: "text-lg font-medium text-gray-700", children: "No cars available" }), _jsx("p", { className: "text-gray-500 mt-1", children: "Check back later for new arrivals" })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(ToastContainer, { position: "top-right", autoClose: 3000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6", role: "list", "aria-label": "List of available cars", children: cars.map((car) => (_jsxs("article", { className: "bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full hover:-translate-y-1", "aria-labelledby": `car-${car.id}-title`, role: "listitem", children: [_jsx("div", { className: "relative h-48 bg-gray-100", children: _jsxs("div", { className: "relative overflow-hidden rounded-lg group", children: [_jsx("img", { src: getCarImageUrl(car), alt: `${car.name} ${car.model}`, className: "w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105", onError: () => handleImageError(car.id), loading: "lazy" }), _jsx("button", { onClick: (e) => toggleLike(car.id, e), className: "absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all", "aria-label": likedCars[car.id] || car.isLiked ? 'Unlike car' : 'Like car', children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: `h-6 w-6 ${likedCars[car.id] || car.isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`, viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z", clipRule: "evenodd" }) }) }), !car.isAvailable && (_jsx("div", { className: "absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded", children: "Rented" }))] }) }), _jsxs("div", { className: "p-4 flex flex-col flex-grow", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900", children: [car.brand, " ", car.name] }), _jsxs("p", { className: "text-gray-600 text-sm", children: [car.year, " \u2022 ", car.model] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("svg", { className: "w-5 h-5 text-yellow-400", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" }) }), _jsxs("span", { className: "ml-1 text-gray-700 font-medium", children: [car.rating.toFixed(1), " ", _jsxs("span", { className: "text-gray-400 text-sm", children: ["(", car.reviews, ")"] })] })] })] }), _jsxs("div", { className: "mt-3 flex flex-wrap gap-1", children: [_jsxs("span", { className: "px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded", children: [car.seats, " Seats"] }), _jsx("span", { className: "px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded", children: car.fuelType }), _jsx("span", { className: "px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded", children: car.location })] }), car.features && car.features.length > 0 && (_jsxs("div", { className: "mt-2 flex flex-wrap gap-1", children: [car.features.slice(0, 3).map((feature, idx) => (_jsx("span", { className: "px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded", children: feature }, idx))), car.features.length > 3 && (_jsxs("span", { className: "px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded", children: ["+", car.features.length - 3, " more"] }))] })), _jsxs("div", { className: "mt-3 flex items-center justify-between", children: [_jsxs("span", { className: "text-xl font-bold text-blue-600", children: [formatPrice(car.rentalPricePerDay), _jsx("span", { className: "text-sm font-normal text-gray-500", children: "/day" })] }), _jsx("button", { onClick: () => handleRentClick(car.id), disabled: !car.isAvailable || loadingCarId === car.id, "aria-label": loadingCarId === car.id
                                                ? `Processing rental for ${car.name} ${car.model}`
                                                : car.isAvailable
                                                    ? `Rent ${car.name} ${car.model} for ${formatPrice(car.rentalPricePerDay)} per day`
                                                    : `${car.name} ${car.model} is not available for rent`, className: `px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${!car.isAvailable
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : loadingCarId === car.id
                                                    ? "bg-blue-400 text-white cursor-wait"
                                                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md"}`, children: loadingCarId === car.id ? (_jsxs("span", { className: "flex items-center", children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Processing..."] })) : car.isAvailable ? ('Rent Now') : ('Not Available') })] })] })] }, car.id))) })] }));
};
export default CarList;
