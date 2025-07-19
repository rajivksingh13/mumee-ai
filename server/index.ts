import express from 'express';
import cors from 'cors';
import twilio from 'twilio';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment';
import emailRoutes from './routes/email';

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://mumeeai.com' 
    : 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Middleware
app.use(express.json());

// Initialize Twilio client with environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

// Validate required environment variables
if (!accountSid || !authToken || !verifyServiceSid) {
  throw new Error('Missing required Twilio environment variables');
}

const client = twilio(accountSid, authToken);

// Store OTP attempts to prevent brute force
const otpAttempts = new Map<string, { count: number; lastAttempt: number }>();

// Maximum number of attempts allowed
const MAX_ATTEMPTS = 3;
// Time window for attempts in milliseconds (15 minutes)
const ATTEMPT_WINDOW = 15 * 60 * 1000;

// Send OTP endpoint
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Format phone number to E.164 format if not already
    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    // Send verification code via Twilio Verify
    await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: formattedNumber, channel: 'sms' });
    
    console.log('OTP sent successfully to:', formattedNumber);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP endpoint
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;

    if (!phoneNumber || !code) {
      return res.status(400).json({ message: 'Phone number and code are required' });
    }

    // Format phone number to E.164 format if not already
    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    // Check attempt limits
    const attempts = otpAttempts.get(formattedNumber) || { count: 0, lastAttempt: 0 };
    const now = Date.now();
    
    // Reset attempts if outside the time window
    if (now - attempts.lastAttempt > ATTEMPT_WINDOW) {
      attempts.count = 0;
    }
    
    // Check if too many attempts
    if (attempts.count >= MAX_ATTEMPTS) {
      return res.status(429).json({ message: 'Too many attempts. Please try again later.' });
    }
    
    // Update attempts
    attempts.count++;
    attempts.lastAttempt = now;
    otpAttempts.set(formattedNumber, attempts);
    
    // Verify the code
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to: formattedNumber, code });
    
    // Reset attempts on successful verification
    if (verification.status === 'approved') {
      otpAttempts.delete(formattedNumber);
      return res.json({ isValid: true });
    }
    
    return res.json({ isValid: false });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

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