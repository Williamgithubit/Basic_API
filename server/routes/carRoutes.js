import express from 'express';
import * as carController from "../controllers/carController.js";
import { verifyToken } from '../controllers/authController.js';

const carRouter = express.Router();

// Public routes - anyone can view cars
carRouter.get("/", carController.getCars);
carRouter.get("/:id", carController.getCar);

// Protected routes - only admin can modify cars
carRouter.post("/", carController.createCar);
carRouter.put("/:id", carController.updateCar);
carRouter.delete("/:id", verifyToken, carController.deleteCar);

export default carRouter;
