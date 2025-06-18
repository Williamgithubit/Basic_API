import express from 'express';
import * as customerController from "../controllers/customerController.js";

const customerRouter = express.Router();

// Create a new customer
customerRouter.post("/", customerController.createCustomer);

// Get all customers
customerRouter.get("/", customerController.getCustomers);

// Get a single customer
customerRouter.get("/:id", customerController.getCustomer);

// Update a customer
customerRouter.put("/:id", customerController.updateCustomer);

// Delete a customer
customerRouter.delete("/:id", customerController.deleteCustomer);

export default customerRouter;