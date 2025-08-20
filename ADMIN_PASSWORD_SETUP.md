# Admin Password Environment Variable Setup

## 🚨 Issue
The admin password is not loading from environment variables, causing "Invalid password" errors.

## ✅ Solution
The AdminPage component now reads the password from environment variables with fallback.

## 🔧 Setup Instructions

### For Local Development (.env file)

1. **Create or update `.env` file** in the `mumee-ai` directory:

```env
# Admin Password (use VITE_ prefix for Vite to expose it to frontend)
VITE_ADMIN_PASSWORD=your_admin_password_here

# Other Firebase variables
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
```

2. **Restart your development server**:
```bash
npm run dev
```

### For Production (Render Environment Variables)

1. **Go to your Render dashboard**
2. **Select your service**
3. **Go to Environment tab**
4. **Add environment variable**:
   - **Key**: `VITE_ADMIN_PASSWORD`
   - **Value**: `your_admin_password_here`
5. **Redeploy your service**

## 🔍 Debug Steps

1. **Open browser console** when trying to log in
2. **Look for these debug messages**:
   ```
   🔍 Environment variables check:
     - VITE_ADMIN_PASSWORD: SET (or NOT SET)
     - ADMIN_PASSWORD: SET (or NOT SET)
     - Final ADMIN_PASSWORD value: [actual value]
   ```

3. **If you see "NOT SET"**, the environment variable is not configured correctly

## 📝 Important Notes

- **Vite requires `VITE_` prefix** for environment variables to be exposed to the frontend
- **Without `VITE_` prefix**, the variable won't be available in the browser
- **The fallback password** is `'titliAI2025!'` if no environment variable is set
- **Restart the dev server** after changing `.env` file
- **Redeploy** after changing Render environment variables

## 🎯 Test Steps

1. **Set up environment variable** (local or production)
2. **Restart/redeploy** your application
3. **Go to admin page**: `http://localhost:5173/admin` (local) or your production URL
4. **Enter the password** you set in the environment variable
5. **Check browser console** for debug messages
6. **You should be able to log in successfully**

## 🔧 Troubleshooting

### If still getting "Invalid password":

1. **Check browser console** for debug messages
2. **Verify environment variable name** is exactly `VITE_ADMIN_PASSWORD`
3. **Make sure you restarted/redeployed** after setting the variable
4. **Try the fallback password** `titliAI2025!` to test if the component works
5. **Check for typos** in the password value

### Common Issues:

- **Wrong variable name**: Must be `VITE_ADMIN_PASSWORD` (with VITE_ prefix)
- **Not restarted**: Dev server needs restart after `.env` changes
- **Not redeployed**: Production needs redeploy after environment variable changes
- **Case sensitivity**: Environment variable names are case-sensitive
- **Spaces in value**: Make sure there are no extra spaces in the password value

## 🚀 Example .env file

```env
# Admin Password
VITE_ADMIN_PASSWORD=MySecureAdminPassword123!

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-project
VITE_FIREBASE_STORAGE_BUCKET=my-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
VITE_FIREBASE_DATABASE_URL=https://my-project-default-rtdb.firebaseio.com
```
