import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './models/index.js';
import customerRouter from "./routes/customerRoutes.js";
import carRouter from "./routes/carRoutes.js";
import rentalRouter from "./routes/rentalRoutes.js";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

//Routes
app.get('/', (req, res) => {
    res.send('Welcome to Basis API!, Routes is on test');
});

// API Routes
app.use("/api/customers", customerRouter);
app.use("/api/cars", carRouter);
app.use("/api/rentals", rentalRouter);


app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await db.sequelize.authenticate();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
});