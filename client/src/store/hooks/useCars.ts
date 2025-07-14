import { useState } from 'react';
import { 
  useGetCarsQuery, 
  useGetCarByIdQuery, 
  useGetAvailableCarsQuery,
  useToggleLikeMutation,
  useAddCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
  Car
} from '../Car/carApi';
import { showErrorToast, showSuccessToast } from '../utils/apiUtils';

export interface CarFormData {
  name: string;
  model: string;
  brand: string;
  year: number;
  color: string;
  licensePlate: string;
  dailyRate: number;
  isAvailable: boolean;
  imageUrl?: string;
}

export const useCars = () => {
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  
  // RTK Query hooks
  const { 
    data: cars, 
    isLoading: isLoadingCars, 
    error: carsError,
    refetch: refetchCars
  } = useGetCarsQuery();
  
  const { 
    data: selectedCar, 
    isLoading: isLoadingSelectedCar 
  } = useGetCarByIdQuery(selectedCarId || 0, { 
    skip: selectedCarId === null 
  });
  
  const [addCar, addCarResult] = useAddCarMutation();
  const [updateCar, updateCarResult] = useUpdateCarMutation();
  const [deleteCar, deleteCarResult] = useDeleteCarMutation();
  const [toggleLike, toggleLikeResult] = useToggleLikeMutation();

  // Custom functions
  const selectCar = (id: number) => {
    setSelectedCarId(id);
  };

  const clearSelectedCar = () => {
    setSelectedCarId(null);
  };

  const createCar = async (carData: CarFormData) => {
    try {
      const result = await addCar(carData).unwrap();
      showSuccessToast('Car added successfully');
      return result;
    } catch (error) {
      showErrorToast(addCarResult.error);
      throw error;
    }
  };

  const editCar = async (id: number, carData: Partial<CarFormData>) => {
    try {
      const result = await updateCar({ id, ...carData }).unwrap();
      showSuccessToast('Car updated successfully');
      return result;
    } catch (error) {
      showErrorToast(updateCarResult.error);
      throw error;
    }
  };

  const removeCar = async (id: number) => {
    try {
      await deleteCar(id).unwrap();
      showSuccessToast('Car deleted successfully');
      if (selectedCarId === id) {
        clearSelectedCar();
      }
    } catch (error) {
      showErrorToast(deleteCarResult.error);
      throw error;
    }
  };

  const toggleLikeCar = async (id: number) => {
    try {
      const result = await toggleLike(id).unwrap();
      return result;
    } catch (error) {
      showErrorToast(toggleLikeResult.error);
      throw error;
    }
  };

  const getAvailableCars = (startDate: string, endDate: string) => {
    return useGetAvailableCarsQuery({ startDate, endDate });
  };

  return {
    cars,
    selectedCar,
    isLoading: isLoadingCars || isLoadingSelectedCar || 
               addCarResult.isLoading || updateCarResult.isLoading || 
               deleteCarResult.isLoading || toggleLikeResult.isLoading,
    error: carsError || addCarResult.error || updateCarResult.error || 
           deleteCarResult.error || toggleLikeResult.error,
    selectCar,
    clearSelectedCar,
    createCar,
    editCar,
    removeCar,
    toggleLikeCar,
    getAvailableCars,
    refetchCars
  };
};

export default useCars;
