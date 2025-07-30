import express from 'express';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const TEST_MODE = process.env.NODE_ENV === 'development'; // Enable test mode in development

console.log('🔧 Payment routes initialized');
console.log('🔧 Test mode:', TEST_MODE);
console.log('🔧 Razorpay key configured:', !!process.env.RAZORPAY_KEY_ID);

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order endpoint
router.post('/create-order', async (req, res) => {
  try {
    console.log('📦 Creating order with body:', req.body);
    const { amount, currency, courseId } = req.body;

    if (!amount || !currency || !courseId) {
      console.error('❌ Missing required fields:', { amount, currency, courseId });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (TEST_MODE) {
      // Return a dummy order ID for test mode
      const timestamp = Date.now().toString().slice(-8); // Last 8 digits
      const receipt = `rcpt_${courseId}_${timestamp}`;
      const dummyOrder = {
        id: `order_${Date.now()}`,
        amount: amount,
        currency: currency,
        receipt: receipt,
        status: 'created',
        notes: { courseId }
      };
      console.log('🧪 Test mode: returning dummy order:', dummyOrder);
      return res.json(dummyOrder);
    }

    // Generate a shorter receipt ID that fits Razorpay's 40 character limit
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits
    const receipt = `rcpt_${courseId}_${timestamp}`;
    
    const options = {
      amount: amount,
      currency: currency,
      receipt: receipt,
      notes: {
        courseId: courseId
      }
    };

    console.log('💳 Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('✅ Order created successfully:', order);
    res.json(order);
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment endpoint
router.post('/verify', async (req, res) => {
  try {
    console.log('🔍 Verifying payment with body:', req.body);
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, courseId, userId } = req.body;

    if (TEST_MODE) {
      // Return success for test mode
      const testResult = {
        success: true,
        paymentId: `test_payment_${Date.now()}`,
        orderId: razorpay_order_id,
        courseId,
        userId
      };
      console.log('🧪 Test mode: returning test result:', testResult);
      return res.json(testResult);
    }

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      console.error('❌ Missing required fields for verification');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const crypto = require('crypto');
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;
    console.log('🔐 Signature verification:', { isAuthentic, expectedSignature, receivedSignature: razorpay_signature });

    if (isAuthentic) {
      const result = { 
        success: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        courseId,
        userId
      };
      console.log('✅ Payment verified successfully:', result);
      res.json(result);
    } else {
      console.error('❌ Invalid signature');
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

export default router; 