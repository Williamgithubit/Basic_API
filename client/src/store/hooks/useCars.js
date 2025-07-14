import { useState } from 'react';
import { useGetCarsQuery, useGetCarByIdQuery, useGetAvailableCarsQuery, useToggleLikeMutation, useAddCarMutation, useUpdateCarMutation, useDeleteCarMutation } from '../Car/carApi';
import { showErrorToast, showSuccessToast } from '../utils/apiUtils';
export const useCars = () => {
    const [selectedCarId, setSelectedCarId] = useState(null);
    // RTK Query hooks
    const { data: cars, isLoading: isLoadingCars, error: carsError, refetch: refetchCars } = useGetCarsQuery();
    const { data: selectedCar, isLoading: isLoadingSelectedCar } = useGetCarByIdQuery(selectedCarId || 0, {
        skip: selectedCarId === null
    });
    const [addCar, addCarResult] = useAddCarMutation();
    const [updateCar, updateCarResult] = useUpdateCarMutation();
    const [deleteCar, deleteCarResult] = useDeleteCarMutation();
    const [toggleLike, toggleLikeResult] = useToggleLikeMutation();
    // Custom functions
    const selectCar = (id) => {
        setSelectedCarId(id);
    };
    const clearSelectedCar = () => {
        setSelectedCarId(null);
    };
    const createCar = async (carData) => {
        try {
            const result = await addCar(carData).unwrap();
            showSuccessToast('Car added successfully');
            return result;
        }
        catch (error) {
            showErrorToast(addCarResult.error);
            throw error;
        }
    };
    const editCar = async (id, carData) => {
        try {
            const result = await updateCar({ id, ...carData }).unwrap();
            showSuccessToast('Car updated successfully');
            return result;
        }
        catch (error) {
            showErrorToast(updateCarResult.error);
            throw error;
        }
    };
    const removeCar = async (id) => {
        try {
            await deleteCar(id).unwrap();
            showSuccessToast('Car deleted successfully');
            if (selectedCarId === id) {
                clearSelectedCar();
            }
        }
        catch (error) {
            showErrorToast(deleteCarResult.error);
            throw error;
        }
    };
    const toggleLikeCar = async (id) => {
        try {
            const result = await toggleLike(id).unwrap();
            return result;
        }
        catch (error) {
            showErrorToast(toggleLikeResult.error);
            throw error;
        }
    };
    const getAvailableCars = (startDate, endDate) => {
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
