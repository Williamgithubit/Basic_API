import express from 'express';
import { createRental, getRental, getStats, getActive, deleteRental, getRentals } from '../controllers/rentalController.js';

const rentalRouter = express.Router();

// Create a new rental
rentalRouter.post("/", createRental);

// Get rental statistics
rentalRouter.get("/stats", getStats);

// Get active rentals
rentalRouter.get("/active", getActive);

// Get specific rental
rentalRouter.get("/:id", getRental);

// Cancel a rental
rentalRouter.delete("/:id", deleteRental);

// Get all rentals (with optional date range)
rentalRouter.get("/", getRentals);

export default rentalRouter;
