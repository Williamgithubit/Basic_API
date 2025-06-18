import express from 'express';
import * as rentalController from "../controllers/rentalController.js";

const rentalRouter = express.Router();

// Rent a car
rentalRouter.post("/", rentalController.createRental);

// View all rentals
rentalRouter.get("/", rentalController.getRentals);

// View a specific rental
rentalRouter.get("/:id", rentalController.getRental);

// Cancel a rental
rentalRouter.delete("/:id", rentalController.deleteRental);

export default rentalRouter;
