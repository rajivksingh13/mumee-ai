import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment';
import emailRoutes from './routes/email';

dotenv.config();

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://mumee-ai.web.app', 'https://mumee-ai.firebaseapp.com']
    : 'http://localhost:5173', // Your Vite dev server
  methods: ['GET', 'POST'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/payment', paymentRoutes);
app.use('/api/email', emailRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 