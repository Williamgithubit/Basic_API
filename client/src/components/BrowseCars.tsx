import React, { useEffect, useState } from "react";
import CarList from "../components/CarList";
import type { Car } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "./Header";
import toast from "react-hot-toast";
import api from "../services/api";
import type { Rental } from "../services/api";
import Modal from "react-modal";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

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

      // Update the rentals list
      setRentals((prev) => [...prev, rental]);
      
      // Update the car's availability
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
      throw error; // Re-throw the error to be handled by CarList
    }
  };

  const availableCars = cars.filter((car) => car.isAvailable);
  const rentedCars = cars.filter((car) => !car.isAvailable);
  const userRentals = rentals.filter((rental) => rental.customerId === user?.id);

  return (
    <>
      <Header />
      <section className="py-16 px-4 md:px-10 lg:px-20 bg-gray-50 min-h-screen mt-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Browse Cars for Rent
        </h2>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setTab("available")}
            className={`px-4 py-2 rounded ${tab === "available" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Available Cars
          </button>
          <button
            onClick={() => setTab("rented")}
            className={`px-4 py-2 rounded ${tab === "rented" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Rented Cars
          </button>
        </div>

        <CarList
          cars={tab === "available" ? availableCars : rentedCars}
          onRentCar={handleRentCar}
          isLoading={isLoading}
        />

        {user && userRentals.length > 0 && (
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
        )}
      </section>

      {/* Confetti on success */}
      {showConfetti && <Confetti width={width} height={height} />}

      {/* Login Modal */}
      <Modal
        isOpen={showLoginModal}
        onRequestClose={() => setShowLoginModal(false)}
        contentLabel="Login Required"
        className="bg-white max-w-md mx-auto mt-40 p-6 rounded-lg shadow-lg border outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 z-50"
        ariaHideApp={false}
      >
        <h2 className="text-xl font-semibold mb-4">Login Required</h2>
        <p className="mb-6 text-gray-600">You must be logged in to rent a car.</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowLoginModal(false)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowLoginModal(false);
              navigate("/login");
            }}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Go to Login
          </button>
        </div>
      </Modal>
    </>
  );
};

export default BrowseCars;
