import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Car } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CarListProps {
  cars: Car[];
  onRentCar: (carId: number) => Promise<void>;
  isLoading?: boolean;
}

const CarList: React.FC<CarListProps> = ({ cars, onRentCar, isLoading = false }) => {
  const [loadingCarId, setLoadingCarId] = useState<number | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleRentClick = async (carId: number) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to rent a car. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    setLoadingCarId(carId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await onRentCar(carId);
      toast.success("Car rented successfully!");
    } catch (error) {
      console.error("Error renting car:", error);
      toast.error("Failed to rent car. Please try again.");
    } finally {
      setLoadingCarId(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="flex items-center space-x-3">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-lg text-gray-600">Loading cars...</span>
          </div>
        </div>
      ) : cars.length === 0 ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="text-lg text-red-600 bg-red-50 px-4 py-3 rounded-lg shadow flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            No cars available
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
            >
              {car.imageUrl && (
                <img
                  src={car.imageUrl}
                  alt={`${car.name} ${car.model}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/300x200?text=Car+Image";
                  }}
                />
              )}
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1">
                      {car.name} {car.model}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      {car.make} • {car.year}
                    </p>
                  </div>
                  <span
                    className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      car.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    } whitespace-nowrap`}
                  >
                    {car.isAvailable ? "Available" : "Not Available"}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    {formatPrice(car.rentalPricePerDay)}
                    <span className="text-sm md:text-base text-gray-500 font-normal ml-1">/day</span>
                  </p>

                  <button
                    onClick={() => handleRentClick(car.id)}
                    disabled={!car.isAvailable || loadingCarId === car.id}
                    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                      !car.isAvailable
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : loadingCarId === car.id
                        ? "bg-blue-400 text-white cursor-wait"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {loadingCarId === car.id
                      ? "Processing..."
                      : car.isAvailable
                      ? "Rent Now"
                      : "Not Available"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarList;
