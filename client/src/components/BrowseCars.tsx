import React, { useEffect, useState } from "react";
import CarList from "../components/CarList";
import type { Car } from "../components/CarList";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Header from "./Header";
import toast from "react-hot-toast";

const BrowseCars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("/api/cars");

        console.log("✅ Cars API Response:", res.data);

        // Handle different API response formats
        if (Array.isArray(res.data)) {
          setCars(res.data);
        } else if (Array.isArray(res.data.cars)) {
          setCars(res.data.cars);
        } else if (Array.isArray(res.data.data)) {
          setCars(res.data.data);
        } else {
          console.error("⚠️ Unexpected car data format:", res.data);
          toast.error("Unexpected response format from server.");
          setCars([]); // Fallback to prevent crash
        }
      } catch (error) {
        console.error("❌ Error fetching cars:", error);
        toast.error("Failed to load cars from server.");
        setCars([]); // Ensure it's still a valid array
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleRentCar = async (carId: number) => {
    if (!user || !user.id) {
      toast.error("Please login to rent a car");
      navigate("/login");
      return;
    }

    navigate(`/rent/${carId}`);
  };

  return (
    <>
      <Header />
      <section className="py-16 px-4 md:px-10 lg:px-20 bg-gray-50 min-h-screen mt-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Browse Cars for Rent
        </h2>
        <CarList cars={cars} onRentCar={handleRentCar} isLoading={loading} />
      </section>
    </>
  );
};

export default BrowseCars;
