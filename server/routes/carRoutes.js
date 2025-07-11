import express from 'express';
import { getCars, getCar, toggleLike, addReview, createCar, updateCar, deleteCar } from '../controllers/carController.js';
import auth from '../middleware/auth.js';

const carRouter = express.Router();

// Public routes - anyone can view cars
carRouter.get('/', getCars);
carRouter.get('/:id', getCar);

// Customer routes - only authenticated customers can like and review
carRouter.post('/:id/like', auth(['customer', 'owner']), toggleLike);
carRouter.post('/:id/review', auth(['customer', 'owner']), addReview);

// Owner routes - only car owners can create and manage their cars
carRouter.post('/', auth(['owner']), createCar);
carRouter.put('/:id', auth(['owner']), updateCar);
carRouter.delete('/:id', auth(['owner']), deleteCar);

export default carRouter;
