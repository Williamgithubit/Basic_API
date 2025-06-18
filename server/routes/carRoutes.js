import express from 'express';
import * as carController from "../controllers/carController.js";

const carRouter = express.Router();

// Add new car
carRouter.post("/", carController.createCar);

// List all cars
carRouter.get("/", carController.getCars);

// Get single car details
carRouter.get("/:id", carController.getCar);

// Update car info
carRouter.put("/:id", carController.updateCar);

// Remove a car
carRouter.delete("/:id", carController.deleteCar);

export default carRouter;
