import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    console.log('Signup attempt:', { name, email, phone }); // Debug log

    // Check if user already exists
    const existingCustomer = await db.Customer.findOne({ where: { email } });
    if (existingCustomer) {
      console.log('Email already exists:', email); // Debug log
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create customer (password will be hashed by model hooks)
    const customer = await db.Customer.create({
      name,
      email,
      phone,
      password // Password will be hashed by beforeCreate hook
    });

    console.log('Customer created successfully:', { id: customer.id, email: customer.email }); // Debug log

    // Generate token for immediate authentication
    const token = jwt.sign(
      { 
        id: customer.id
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Error creating account' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log('Login attempt for email:', email);

    const customer = await db.Customer.findOne({ 
      where: { email }
    });

    if (!customer) {
      console.log('No customer found with email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await customer.validatePassword(password);
    if (!isValidPassword) {
      console.log('Invalid password for email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ id: customer.id }, JWT_SECRET, { expiresIn: '24h' });

    console.log('Login successful for email:', email); // Debug log

    res.json({
      token,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    console.log('Headers:', req.headers); // Debug log
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader); // Debug log

    if (!authHeader) {
      console.log('No auth header found'); // Debug log
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token); // Debug log

    if (!token) {
      console.log('No token in auth header'); // Debug log
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log

    const customer = await db.Customer.findByPk(decoded.id);
    console.log('Found customer:', customer ? 'yes' : 'no'); // Debug log
    
    if (!customer) {
      console.log('No customer found for token'); // Debug log
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Set both user and customer for backward compatibility
    req.user = customer;
    req.customer = customer;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
