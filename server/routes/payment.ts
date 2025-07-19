import express from 'express';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const TEST_MODE = process.env.NODE_ENV === 'development'; // Enable test mode in development

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order endpoint
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency, courseId } = req.body;

    if (!amount || !currency || !courseId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (TEST_MODE) {
      // Return a dummy order ID for test mode
      const dummyOrder = {
        id: `order_${Date.now()}`,
        amount: amount,
        currency: currency,
        receipt: `receipt_${courseId}_${Date.now()}`,
        status: 'created',
        notes: { courseId }
      };
      return res.json(dummyOrder);
    }

    const options = {
      amount: amount,
      currency: currency,
      receipt: `receipt_${courseId}_${Date.now()}`,
      notes: {
        courseId: courseId
      }
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment endpoint
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, courseId, userId } = req.body;

    if (TEST_MODE) {
      // Return success for test mode
      return res.json({
        success: true,
        paymentId: `test_payment_${Date.now()}`,
        orderId: razorpay_order_id,
        courseId,
        userId
      });
    }

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const crypto = require('crypto');
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

export default router; 