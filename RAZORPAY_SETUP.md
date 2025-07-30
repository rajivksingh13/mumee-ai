# Razorpay Payment Integration Setup

## Overview
The Mumee AI platform now includes proper Razorpay payment integration for paid workshops (Foundation and Advanced levels). The payment flow has been fixed to go through the actual Razorpay payment gateway instead of bypassing it.

## Environment Variables Required

Create a `.env` file in the root directory with the following variables:

```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here

# API Configuration (optional - defaults to production URL)
VITE_API_BASE_URL=https://mumee-ai-backend.onrender.com
```

## Server-side Environment Variables

Make sure your server has the following environment variables configured:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

## How the Payment Flow Works

1. **User clicks "Enroll Now"** on a paid workshop (Foundation or Advanced)
2. **Payment Service** creates a Razorpay order via `/api/payment/create-order`
3. **Razorpay Modal** opens with payment options
4. **User completes payment** through Razorpay
5. **Payment Verification** happens via `/api/payment/verify`
6. **Enrollment** is created with actual payment data
7. **Email confirmation** is sent to the user

## Files Modified

### Frontend
- `src/services/paymentService.ts` - New payment service with Razorpay integration
- `src/components/FoundationWorkshop.tsx` - Updated to use proper payment flow
- `src/components/AdvanceWorkshop.tsx` - Updated to use proper payment flow

### Backend
- `server/routes/payment.ts` - Enhanced payment verification to return payment details

## Testing

### Development Mode
In development mode (`NODE_ENV=development`), the server returns dummy payment data for testing without actual Razorpay integration.

### Production Mode
In production, the full Razorpay payment flow is used with real payment processing.

## Troubleshooting

### Common Issues

1. **"Razorpay key is not configured"**
   - Make sure `VITE_RAZORPAY_KEY_ID` is set in your `.env` file

2. **"Failed to create order"**
   - Check that your server is running and accessible
   - Verify that `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set on the server

3. **"Payment verification failed"**
   - Check server logs for detailed error messages
   - Verify that the Razorpay keys are correct

### Debug Steps

1. Check browser console for frontend errors
2. Check server logs for backend errors
3. Verify environment variables are loaded correctly
4. Test the API endpoints directly using curl or Postman

## Security Notes

- Never expose `RAZORPAY_KEY_SECRET` in the frontend
- Always verify payment signatures on the server side
- Use HTTPS in production for secure payment processing 