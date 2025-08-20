# Dynamic Firebase Configuration Setup

## 🎯 Overview
The admin dashboard now loads Firebase configuration dynamically from environment variables instead of hardcoded values.

## 🔧 How It Works

### 1. **API Endpoint**
- Server provides `/api/config` endpoint that reads environment variables
- Supports both `VITE_` prefixed (for local development) and non-prefixed (for production) variables

### 2. **Dynamic Loading**
- Admin page fetches configuration from API on load
- Falls back to default values if API is unavailable
- Works for both localhost and production environments

## 📝 Environment Variables Setup

### For Local Development (.env file)

Create or update `.env` file in the `mumee-ai` directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_actual_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com

# Other variables
RAZORPAY_KEY_ID=your_razorpay_key
```

### For Production (Render Environment Variables)

In your Render dashboard, add these environment variables:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_actual_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com

# Other variables
RAZORPAY_KEY_ID=your_razorpay_key
```

## 🚀 How to Test

### 1. **Local Development**
```bash
# Start the development server
cd mumee-ai
npm run dev

# In another terminal, start the backend server
cd server
npm start
```

### 2. **Access Admin Dashboard**
- Go to: `http://localhost:5173/admin.html`
- Login with password: `titliAI2025!`
- Check browser console for configuration loading logs

### 3. **Verify Configuration**
- Open browser console (F12)
- Look for logs like:
  ```
  🔍 Loading Firebase configuration from environment...
  ✅ Firebase config loaded from API: {...}
  ✅ Firebase initialized with config: {...}
  ```

## 🔍 Troubleshooting

### If configuration fails to load:
1. **Check API endpoint**: Visit `http://localhost:3000/api/config` directly
2. **Verify environment variables**: Ensure `.env` file exists and has correct values
3. **Check server logs**: Look for any errors in the backend server
4. **Fallback behavior**: Admin page will use default configuration if API fails

### Common Issues:
- **CORS errors**: Ensure server is running and CORS is configured
- **Missing .env file**: Create `.env` file in the `mumee-ai` directory
- **Wrong variable names**: Use exact variable names as shown above

## 📊 Benefits

✅ **No hardcoded secrets** in the frontend code  
✅ **Environment-specific configuration**  
✅ **Easy deployment** to different environments  
✅ **Secure credential management**  
✅ **Fallback mechanism** for reliability  

## 🔄 Migration from Hardcoded Values

The admin page now:
1. **Fetches configuration** from `/api/config` endpoint
2. **Uses environment variables** from server
3. **Falls back gracefully** if API is unavailable
4. **Logs configuration loading** for debugging

This ensures your Firebase credentials are never exposed in the frontend code and can be easily managed through environment variables.
