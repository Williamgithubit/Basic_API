import db from "../models/index.js";

// Rent a car
export const createRental = async (req, res) => {
    const { carId, customerId, startDate, endDate } = req.body;

    try {
        // Check if car exists and is available
        const car = await db.Car.findByPk(carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        if (!car.isAvailable) {
            return res.status(400).json({ message: "Car is not available for rent" });
        }
        // Check if customer exists
        const customer = await db.Customer.findByPk(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Calculate total cost
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        const days = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24));
        const totalCost = days * car.rentalPricePerDay;

        // Create rental with calculated total cost
        const rental = await db.Rental.create({
            carId,
            customerId,
            startDate,
            endDate,
            totalCost
        });
        // Update car availability
        await car.update({ isAvailable: false });
        return res.status(201).json(rental);
    } catch (error) {
        console.error("Error creating rental:", error);
        return res.status(500).json({ 
            message: "Internal server error",
            details: error.message 
        });
    }
};

// View all rentals
export const getRentals = async (req, res) => {
    try {
        const rentals = await db.Rental.findAll({
            include: [
                { model: db.Car, as: 'Car' },
                { model: db.Customer, as: 'Customer' }
            ]
        });
        return res.status(200).json(rentals);
    } catch (error) {
        console.error("Error fetching rentals:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// View a specific rental
export const getRental = async (req, res) => {
    const { id } = req.params;

    try {
        const rental = await db.Rental.findByPk(id, {
            include: [
                { model: db.Car, as: 'Car' },
                { model: db.Customer, as: 'Customer' }
            ]
        });
        if (!rental) {
            return res.status(404).json({ message: "Rental not found" });
        }
        return res.status(200).json(rental);
    } catch (error) {
        console.error("Error fetching rental:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Cancel a rental
export const deleteRental = async (req, res) => {
    const { id } = req.params;

    try {
        const rental = await db.Rental.findByPk(id);
        if (!rental) {
            return res.status(404).json({ message: "Rental not found" });
        }

        // Get the car and update its availability
        const car = await db.Car.findByPk(rental.carId);
        if (car) {
            await car.update({ isAvailable: true });
        }

        await rental.destroy();
        return res.status(204).send();
    } catch (error) {
        console.error("Error canceling rental:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
