import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Car } from "../store/Car/carApi";
import { useAppDispatch } from "../store/hooks";
import useCars from "../store/hooks/useCars";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 
// CarCardProps extends the Car interface and ensures required fields are present
type CarCardProps = Car & {
  // Ensure required fields have the correct types
  isLiked: boolean;
  isAvailable: boolean;
  imageUrl: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  seats: number;
  fuelType: 'Petrol' | 'Electric' | 'Hybrid';
  location: string;
  features: string[];
  rating: number;
  reviews: number;
  rentalPricePerDay: number;
  description: string;
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price || 0);
};

interface CarListProps {
  cars: CarCardProps[];
  onRentCar: (carId: number) => Promise<void>;
  isLoading?: boolean;
  // Note: In a full migration, we would remove the cars prop and fetch directly from Redux
  // This partial migration keeps the component API compatible with existing usage
}

// Using Redux hooks instead of direct API import

const CarList: React.FC<CarListProps> = ({ cars = [], onRentCar, isLoading: propIsLoading = false }) => {
  const [loadingCarId, setLoadingCarId] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [likedCars, setLikedCars] = useState<Record<number, boolean>>({});
  const { isAuthenticated } = useAuth();
  
  // Use the Redux hooks
  const { toggleLikeCar, isLoading: reduxIsLoading } = useCars();
  
  // Combine loading states
  const isLoading = propIsLoading || reduxIsLoading;

  const handleImageError = (carId: number) => {
    setImageErrors(prev => ({
      ...prev,
      [carId]: true
    }));
  };
  
  const toggleLike = async (carId: number, e: React.MouseEvent) => {
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
      
      // Call the Redux action to toggle like
      const response = await toggleLikeCar(carId);
      
      // Update with actual server state
      setLikedCars(prev => ({
        ...prev,
        [carId]: response.isLiked
      }));
    } catch (error) {
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
    }, {} as Record<number, boolean>);
    setLikedCars(initialLikes);
  }, [cars]);

  const handleRentClick = async (carId: number) => {
    if (!isAuthenticated) {
      toast.info('Please log in to rent a car');
      return;
    }

    setLoadingCarId(carId);
    try {
      await onRentCar(carId);
      toast.success('Car rented successfully');
    } catch (error) {
      console.error('Error renting car:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to rent car";
      toast.error(errorMessage);
    } finally {
      setLoadingCarId(null);
    }
  };

  const getCarImageUrl = (car: CarCardProps) => {
    if (imageErrors[car.id]) {
      const searchTerm = `${car.brand || 'car'} ${car.model || ''}`.trim();
      return `https://source.unsplash.com/random/300x200/?${encodeURIComponent(searchTerm)}`;
    }
    return car.imageUrl;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!Array.isArray(cars) || cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-4 text-center">
        <svg
          className="h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4.5L4 7m16 0l-8 4.5M4 7v9.5l8 4.5m0-14l8 4.5M4 16.5l8 4.5 8-4.5m-16-9l8-4.5"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-700">No cars available</h3>
        <p className="text-gray-500 mt-1">Check back later for new arrivals</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar 
        closeOnClick
        pauseOnHover
      />

      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
        role="list"
        aria-label="List of available cars"
      >
        {cars.map((car) => (
          <article
            key={car.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full hover:-translate-y-1"
            aria-labelledby={`car-${car.id}-title`}
            role="listitem"
          >
            <div className="relative h-48 bg-gray-100">
                <div className="relative overflow-hidden rounded-lg group">
                  <img
                    src={getCarImageUrl(car)}
                    alt={`${car.name} ${car.model}`}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => handleImageError(car.id)}
                    loading="lazy"
                  />
                  <button
                    onClick={(e) => toggleLike(car.id, e)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all"
                    aria-label={likedCars[car.id] || car.isLiked ? 'Unlike car' : 'Like car'}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 ${likedCars[car.id] || car.isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {!car.isAvailable && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Rented
                    </div>
                  )}
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {car.brand} {car.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{car.year} • {car.model}</p>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-gray-700 font-medium">
                    {car.rating.toFixed(1)} <span className="text-gray-400 text-sm">({car.reviews})</span>
                  </span>
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                  {car.seats} Seats
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                  {car.fuelType}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                  {car.location}
                </span>
              </div>
              
              {car.features && car.features.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {car.features.slice(0, 3).map((feature, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded"
                    >
                      {feature}
                    </span>
                  ))}
                  {car.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                      +{car.features.length - 3} more
                    </span>
                  )}
                </div>
              )}
              
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(car.rentalPricePerDay)}<span className="text-sm font-normal text-gray-500">/day</span>
                </span>
                <button
                  onClick={() => handleRentClick(car.id)}
                  disabled={!car.isAvailable || loadingCarId === car.id}
                  aria-label={
                    loadingCarId === car.id 
                      ? `Processing rental for ${car.name} ${car.model}`
                      : car.isAvailable 
                        ? `Rent ${car.name} ${car.model} for ${formatPrice(car.rentalPricePerDay)} per day`
                        : `${car.name} ${car.model} is not available for rent`
                  }
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    !car.isAvailable
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : loadingCarId === car.id
                      ? "bg-blue-400 text-white cursor-wait"
                      : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md"
                  }`}
                >
                  {loadingCarId === car.id ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : car.isAvailable ? (
                    'Rent Now'
                  ) : (
                    'Not Available'
                  )}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CarList;
