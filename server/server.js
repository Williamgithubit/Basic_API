import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './models/index.js';
import customerRouter from './routes/customerRoutes.js';
import carRouter from './routes/carRoutes.js';
import rentalRouter from './routes/rentalRoutes.js';
import authRouter from './routes/auth.js';
import { verifyToken } from './controllers/authController.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// Public routes
app.use('/api/auth', authRouter);
app.use('/api/cars', carRouter); // Car routes handle their own auth

// Protected routes
app.use('/api/customers', verifyToken, customerRouter);
app.use('/api/rentals', (req, res, next) => {
    // Skip auth for GET requests to /api/rentals/active
    if (req.method === 'GET' && req.path === '/active') {
        next();
    } else {
        verifyToken(req, res, next);
    }
}, rentalRouter);

app.get('/', (req, res) => {
    res.send('Welcome to Car Rental API');
});


app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await db.sequelize.sync({force: true}); // Removed force: true to prevent database reset
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
});