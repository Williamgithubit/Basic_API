import React, { useEffect, useState, Suspense } from "react";
import CarList from "./CarList";
import { Car } from "../store/Car/carApi";
import { Rental } from "../store/Rental/rentalApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "./Header";
import toast from "react-hot-toast";
import Modal from "react-modal";
import Confetti from "react-confetti";
import { useAppDispatch } from "../store/hooks";
import useCars from "../store/hooks/useCars";
import useRentals from "../store/hooks/useRentals";

// Custom hook to get window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = React.useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

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

type Tab = "available" | "rented";

const BrowseCars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [tab, setTab] = useState<Tab>("available");
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

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
        name: car.name, // Map make to name
        brand: car.brand,
        model: car.model,
        year: car.year,
        seats: 5, // Default value
        fuelType: 'Petrol' as 'Petrol' | 'Electric' | 'Hybrid', // Default value
        location: 'Local', // Default value
        features: [], // Default value
        rating: 4.5, // Default value
        reviews: 10, // Default value
        rentalPricePerDay: car.dailyRate,
        description: `${car.name} ${car.model} ${car.year}`, // Generate description
      }));
      setCars(mappedCars);
    }
    
    if (isAuthenticated && rentalData) {
      setRentals(rentalData);
    } else {
      setRentals([]);
    }
    
    // Show error toasts if needed
    if (carsError) {
      toast.error("Failed to fetch car data");
      console.error(carsError);
    }
    
    if (rentalsError) {
      toast.error("Failed to fetch rental data");
      console.error(rentalsError);
    }
  }, [carData, rentalData, isAuthenticated, carsError, rentalsError]);
  
  // Update loading state based on Redux loading states
  useEffect(() => {
    setIsLoading(isLoadingCars || isLoadingRentals);
  }, [isLoadingCars, isLoadingRentals]);

  const handleRentCar = async (carId: number) => {
    if (!user || user.id === 0) {
      setShowLoginModal(true);
      return;
    }
    
    // Check if user has already rented this car
    const hasAlreadyRented = rentalData?.some(
      (rental: Rental) => rental.carId === carId && rental.customerId === user.id
    );

    if (hasAlreadyRented) {
      toast.error("You have already rented this car.");
      return;
    }

    const now = new Date();
    const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    try {
      // Use the addRental function from useRentals hook
      const rental = await addRental({
        carId,
        customerId: user.id,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      toast.success("Car rented successfully!");
    } catch (error) {
      toast.error("Failed to rent car");
      console.error(error);
    }
  };

  // Map Car objects to CarCardProps objects
  const mapCarToCardProps = (car: Car) => {
    return {
      ...car,
      isLiked: false, // Default value, update if you have this info
      isAvailable: car.isAvailable,
      imageUrl: car.imageUrl || 'https://via.placeholder.com/300x200?text=Car+Image', // Ensure imageUrl is always a string
      name: car.model, // Using model as name
      brand: car.name, // Using make as brand
      seats: 4, // Default value
      fuelType: 'Petrol' as 'Petrol' | 'Electric' | 'Hybrid', // Default value
      location: 'Local', // Default value
      features: [], // Default value
      rating: 4.5, // Default value
      reviews: 10, // Default value
      rentalPricePerDay: car.dailyRate, // Using dailyRate
      description: `${car.year} ${car.name} ${car.model}` // Generated description
    };
  };

  // Filter cars based on availability status
  const availableCars = cars.filter((car) => car.isAvailable).map(mapCarToCardProps);
  const rentedCars = isAuthenticated
    ? cars.filter((car) => !car.isAvailable).map(mapCarToCardProps)
    : [];
  const userRentals = user ? rentals.filter(
    (rental) => rental.customerId === user.id
  ) : [];

  return (
    <>
      <Header />
      <section className="py-16 px-4 md:px-10 lg:px-20 bg-gray-50 min-h-screen mt-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Browse Cars for Rent
        </h2>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setTab("available")}
            className={`px-4 py-2 rounded ${
              tab === "available"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Available Cars
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setTab("rented")}
              className={`px-4 py-2 rounded ${
                tab === "rented"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Rented Cars
            </button>
          )}
        </div>

        <CarList
          cars={tab === "available" ? availableCars : rentedCars}
          onRentCar={handleRentCar}
          isLoading={isLoading}
        />

        {user && userRentals.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Your Rental History
            </h3>
            <ul className="space-y-3">
              {userRentals.map((rental) => {
                const rentedCar = cars.find((car) => car.id === rental.carId);
                return (
                  <li key={rental.id} className="p-4 bg-white shadow rounded">
                    <p>
                      <strong>Car:</strong> {rentedCar?.name || "N/A"}
                    </p>
                    <p>
                      <strong>From:</strong> {rental.startDate} &nbsp;
                      <strong>To:</strong> {rental.endDate}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <Suspense fallback={null}>
        {showLoginModal && (
          <Modal
            isOpen={showLoginModal}
            onRequestClose={() => setShowLoginModal(false)}
            contentLabel="Login Required"
            className="modal"
            overlayClassName="modal-overlay"
          >
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-auto mt-20">
              <h3 className="text-xl font-semibold mb-4">Login Required</h3>
              <p className="mb-6">You need to be logged in to rent a car.</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </Modal>
        )}
      </Suspense>
    </>
  );
};

Modal.setAppElement("#root");
export default BrowseCars;
