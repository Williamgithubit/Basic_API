import React, { useEffect, useState } from "react";
import CarList from "../components/CarList";
import type { Car } from "../components/CarList";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Header from "./Header";
import toast from "react-hot-toast"; // ✅ import toast

const BrowseCars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get<Car[]>("/api/cars");
        setCars(res.data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleRentCar = async (carId: number) => {
    if (!user || !user.id) {
      toast.error("Please login to rent a car"); // ✅ show toast
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
