
import express from 'express';

import cors from 'cors';
import { connectSQL, connectMongo } from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reportRoutes from './routes/reportRoutes.js';



const app = express();
// Load environment variables

// Connect to databases
connectSQL();
connectMongo();

// Middleware
// add 'https://amazing-meringue-dc6ecd.netlify.app' , 'http://localhost:3000' to cors
app.use(cors(
  {
    origin: ['https://scintillating-churros-599e4e.netlify.app' , 'http://localhost:3000'],
    credentials: true
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Export app for testing
export default app;
