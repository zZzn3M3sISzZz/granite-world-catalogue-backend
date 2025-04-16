import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';
import customerQueryRoutes from './routes/customerQueryRoutes';
import galleryRoutes from './routes/galleryRoutes';

dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  maxAge: 86400,
}));

// Handle preflight requests
app.options('*', cors());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes with timeout handling
const timeoutMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setTimeout(5000, () => {
    res.status(504).json({ error: 'Request timeout' });
  });
  next();
};

app.use('/api/products', timeoutMiddleware, productRoutes);
app.use('/api/customer-queries', timeoutMiddleware, customerQueryRoutes);
app.use('/api/gallery', timeoutMiddleware, galleryRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Granite World Catalogue API' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// MongoDB connection with timeout
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/granite-world';

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // 5 seconds timeout for server selection
  socketTimeoutMS: 45000, // 45 seconds timeout for operations
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 