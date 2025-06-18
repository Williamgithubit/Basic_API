import db from "../models/index.js";

// Create a new customer
export const createCustomer = async (req, res) => {
    const { name, email, phone } = req.body;
    
    try {
        const existingCustomer = await db.Customer.findOne({ where: { email } });
        if (existingCustomer) {
            return res.status(400).json({ message: "Customer already exists" });
        }
        const newCustomer = await db.Customer.create({ name, email, phone });
        return res.status(201).json(newCustomer);
        console.log("Customer created successfully:", newCustomer);
    } catch (error) {
        console.error("Error creating customer:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get all customers
export const getCustomers = async (req, res) => {
    try {
        const customers = await db.Customer.findAll();
        return res.status(200).json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get a single customer by ID
export const getCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await db.Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        return res.status(200).json(customer);
    } catch (error) {
        console.error("Error fetching customer:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Update a customer
export const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    try {
        const customer = await db.Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Check if email is being changed and if it's already in use
        if (email && email !== customer.email) {
            const existingCustomer = await db.Customer.findOne({ where: { email } });
            if (existingCustomer) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        await customer.update({ name, email, phone });
        return res.status(200).json(customer);
    } catch (error) {
        console.error("Error updating customer:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a customer
export const deleteCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await db.Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        await customer.destroy();
        return res.status(204).send();
    } catch (error) {
        console.error("Error deleting customer:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};