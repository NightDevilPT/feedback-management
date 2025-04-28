// src/server.ts
import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/db';
import userRouter from './controllers/user.route';
import feedbackRouter from './controllers/feedback.route';
import dashboardRoute from './controllers/dashboard.route';
import { errorLogger, requestLogger } from './utils/logger.util';


// Load environment variables
dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '5000');

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend-domain.com",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
// Add this to your middleware section (before routes)
app.use(cookieParser());
app.use(morgan('dev'));
app.use(requestLogger); // Log all requests to console

// Database Connection
connectDB().then(() => {
  console.log('Database connection established');
}).catch((error) => {
  console.error('Database connection failed:', error);
  process.exit(1);
});

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    database: dbStatus
  });
});

app.use('/api/user', userRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/dashboard', dashboardRoute);

app.use(errorLogger); // Log errors to console

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});