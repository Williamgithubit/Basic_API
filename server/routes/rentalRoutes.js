import express from 'express';
import { createRental, getRental, getStats, getActive, deleteRental, getRentals } from '../controllers/rentalController.js';
import { verifyToken } from '../controllers/authController.js';
import db from '../models/index.js';

const rentalRouter = express.Router();

// Middleware to verify rental ownership
const verifyRentalOwnership = async (req, res, next) => {
  try {
    const rentalId = req.params.id;
    const userId = req.user.id;

    const rental = await db.Rental.findOne({
      where: { 
        id: rentalId,
        customerId: userId
      }
    });

    if (!rental) {
      return res.status(403).json({ 
        message: "You don't have permission to access this rental" 
      });
    }

    req.rental = rental;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error verifying rental ownership" });
  }
};

// Create a new rental (requires auth)
rentalRouter.post("/", verifyToken, createRental);

// Get rental statistics (admin only)
rentalRouter.get("/stats", verifyToken, getStats);

// Get active rentals for the logged-in user
rentalRouter.get("/active", verifyToken, getActive);

// Get specific rental (requires ownership)
rentalRouter.get("/:id", verifyToken, verifyRentalOwnership, getRental);

// Cancel a rental (requires ownership)
rentalRouter.delete("/:id", verifyToken, verifyRentalOwnership, deleteRental);

// Get all rentals (admin only)
rentalRouter.get("/", verifyToken, getRentals);

export default rentalRouter;
