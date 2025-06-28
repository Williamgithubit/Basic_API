import db from "../models/index.js";
import { Op } from 'sequelize';

// Using db.Rental directly for better clarity

// Rent a car
export const getStats = async (req, res) => {
  try {
    const totalRentals = await db.Rental.count();
    const activeRentals = await db.Rental.count({
      where: {
        endDate: { [Op.gte]: new Date() }
      }
    });

    const totalRevenue = await db.Rental.sum('totalCost');

    const popularCars = await db.Rental.findAll({
      attributes: [
        'carId',
        [db.sequelize.fn('COUNT', 'carId'), 'rentCount']
      ],
      include: [{
        model: db.Car,
        as: 'Car',
        attributes: ['id', 'name', 'model', 'imageUrl', 'rentalPricePerDay']
      }],
      group: ['carId', 'Car.id', 'Car.name', 'Car.model'],
      order: [[db.sequelize.fn('COUNT', 'carId'), 'DESC']],
      limit: 5
    });

    res.json({
      totalRentals,
      activeRentals,
      totalRevenue: totalRevenue || 0,
      popularCars: popularCars.map(rental => ({
        carId: rental.carId,
        name: rental.Car.name,
        model: rental.Car.model,
        rentCount: parseInt(rental.get('rentCount'))
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getActive = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userId = req.user.id;

    const rentals = await db.Rental.findAll({
      where: {
        customerId: userId,
        endDate: { [Op.gte]: new Date() }
      },
      include: [
        { 
          model: db.Car,
          as: 'Car',
          attributes: ['id', 'name', 'model', 'rentalPricePerDay']
        },
        {
          model: db.Customer,
          as: 'Customer',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['endDate', 'ASC']]
    });

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRentals = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // If date range is provided, filter by dates
    if (startDate && endDate) {
      const rentals = await db.Rental.findAll({
        where: {
          [Op.or]: [
            {
              startDate: {
                [Op.between]: [startDate, endDate]
              }
            },
            {
              endDate: {
                [Op.between]: [startDate, endDate]
              }
            }
          ]
        },
        include: [
          { 
            model: db.Car,
            as: 'Car',
            attributes: ['id', 'name', 'model', 'rentalPricePerDay']
          },
          {
            model: db.Customer,
            as: 'Customer',
            attributes: ['id', 'name', 'email']
          }
        ],
        order: [['startDate', 'DESC']]
      });
      return res.json(rentals);
    }

    // Otherwise, return all rentals
    const rentals = await db.Rental.findAll({
      include: [
        { 
          model: db.Car,
          as: 'Car',
          attributes: ['id', 'name', 'model', 'rentalPricePerDay']
        },
        {
          model: db.Customer,
          as: 'Customer',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['startDate', 'DESC']]
    });
    res.json(rentals);
  } catch (error) {
    console.error('Error getting rentals:', error);
    res.status(500).json({ error: error.message });
  }
};



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



// View a specific rental
export const getRental = async (req, res) => {
    const { id } = req.params;

    try {
        const rental = await db.Rental.findByPk(id, {
            include: [
                { 
                    model: db.Car,
                    as: 'Car',
                    attributes: ['id', 'name', 'model', 'rentalPricePerDay']
                },
                {
                    model: db.Customer,
                    as: 'Customer',
                    attributes: ['id', 'name', 'email']
                }
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

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const rental = await db.Rental.findOne({
            where: {
                id: id,
                customerId: req.user.id
            }
        });

        if (!rental) {
            return res.status(404).json({ message: "Rental not found or you don't have permission to cancel it" });
        }

        // Check if rental is already completed
        if (new Date(rental.endDate) < new Date()) {
            return res.status(400).json({ 
                message: "Cannot cancel a completed rental" 
            });
        }

        // Get the car and update its availability
        const car = await db.Car.findByPk(rental.carId);
        if (car) {
            await car.update({ isAvailable: true });
        }

        await rental.destroy();
        return res.status(200).json({ message: "Rental cancelled successfully" });
    } catch (error) {
        console.error("Error canceling rental:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
