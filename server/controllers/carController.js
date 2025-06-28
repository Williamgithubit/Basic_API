import db from "../models/index.js";

// Add new car
export const createCar = async (req, res) => {
    const { name, model, year, rentalPricePerDay, imageUrl  } = req.body;
    try {
        // console.log("BODY RECEIVED:", req.body); // Log here
        const newCar = await db.Car.create({
            name,
            model,
            year,
            rentalPricePerDay,
            imageUrl,
            isAvailable: true
        });
        return res.status(201).json(newCar);
    } catch (error) {
        console.error("Error creating car:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// List all cars
export const getCars = async (req, res) => {
    try {
        const cars = await db.Car.findAll({
            attributes: ['id', 'name', 'model', 'year', 'rentalPricePerDay','imageUrl', 'isAvailable']
        });
        return res.status(200).json(cars);
    } catch (error) {
        console.error("Error fetching cars:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get single car details
export const getCar = async (req, res) => {
    const { id } = req.params;

    try {
        const car = await db.Car.findByPk(id);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        return res.status(200).json(car);
    } catch (error) {
        console.error("Error fetching car:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Update car info
export const updateCar = async (req, res) => {
    const { id } = req.params;
    const { name, model, year, rentalPricePerDay, imageUrl, isAvailable } = req.body;

    try {
        const car = await db.Car.findByPk(id);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        await car.update({
            name,
            model,
            year,
            rentalPricePerDay,
            imageUrl,
            isAvailable
        });
        return res.status(200).json(car);
    } catch (error) {
        console.error("Error updating car:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Remove a car
export const deleteCar = async (req, res) => {
    const { id } = req.params;

    try {
        const car = await db.Car.findByPk(id);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        await car.destroy();
        return res.status(204).send();
    } catch (error) {
        console.error("Error deleting car:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
