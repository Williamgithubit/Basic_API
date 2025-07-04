import React, { useEffect, useState, Suspense, lazy } from "react";
import type { Car } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "./Header";
import toast from "react-hot-toast";
import api from "../services/api";
import type { Rental } from "../services/api";
import { useWindowSize } from "@react-hook/window-size";

// Lazy load components
const CarList = lazy(() => import("./CarList"));
const Confetti = lazy(() => import("react-confetti"));
const Modal = lazy(() => import("react-modal"));

type Tab = "available" | "rented";

const BrowseCars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [tab, setTab] = useState<Tab>("available");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!user && tab === "rented") {
      toast("You must be logged in to view rented cars", {
        icon: "🔒",
        duration: 2500,
        style: { background: "#fef3c7", color: "#92400e" },
      });
      setTimeout(() => navigate("/login"), 2500);
      setTab("available");
    }
  }, [user, tab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const carsData = await api.cars.getAll();
      setCars(carsData);

      if (user) {
        const rentalsData = await api.rentals.getAll();
        setRentals(rentalsData);
      } else {
        setRentals([]);
      }
    } catch (error) {
      toast.error("Failed to fetch car data");
      if (error instanceof Error) console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRentCar = async (carId: number) => {
    if (!user || !user.id) {
      setShowLoginModal(true);
      return;
    }

    const hasAlreadyRented = rentals.some(
      (rental) => rental.carId === carId && rental.customerId === user.id
    );

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
      setCars((prev) =>
        prev.map((car) =>
          car.id === carId ? { ...car, isAvailable: false } : car
        )
      );

      toast.success("Car rented successfully");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      toast.error("Failed to rent car");
      if (error instanceof Error) console.error(error.message);
    }
  };

  const availableCars = cars.filter((car) => car.isAvailable);
  const rentedCars = cars.filter((car) => !car.isAvailable);
  const userRentals = rentals.filter((rental) => rental.customerId === user?.id);

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <>
      <Header />
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Browse Our Cars</h2>
        
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setTab("available")}
            className={`px-4 py-2 rounded ${tab === "available" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Available Cars
          </button>
          {user && (
            <button
              onClick={() => setTab("rented")}
              className={`px-4 py-2 rounded ${tab === "rented" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Rented Cars
            </button>
          )}
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <CarList
            cars={tab === "available" ? availableCars : user ? rentedCars : []}
            onRentCar={handleRentCar}
            isLoading={isLoading}
          />
        </Suspense>

        {user ? (
          userRentals.length > 0 ? (
            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your Rental History</h3>
              <ul className="space-y-3">
                {userRentals.map((rental) => {
                  const rentedCar = cars.find((car) => car.id === rental.carId);
                  return (
                    <li key={rental.id} className="p-4 bg-white shadow rounded">
                      <p><strong>Car:</strong> {rentedCar?.name || "N/A"}</p>
                      <p><strong>From:</strong> {rental.startDate} <strong>To:</strong> {rental.endDate}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="mt-12 text-gray-500 text-center">You have not rented any cars yet.</div>
          )
        ) : (
          <div className="mt-12 text-center text-gray-600">
            <p>You must be logged in to view your rental history.</p>
          </div>
        )}
      </section>

      {/* Confetti on success */}
      {showConfetti && <Confetti width={width} height={height} />}

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

export default BrowseCars;
