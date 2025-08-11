# Firebase Setup Guide for TitliAI Admin Page

## 🔥 Issue: Firebase Connection Failed

The admin page is showing a **400 Bad Request** error when trying to connect to Firestore. This is because the Firebase configuration is using placeholder values instead of real credentials.

## 🛠️ Solution: Set Up Firebase Configuration

### Step 1: Create Environment Variables File

Create a `.env` file in the `mumee-ai` directory:

```bash
# In the mumee-ai directory
touch .env
```

### Step 2: Add Your Firebase Credentials

Add the following to your `.env` file:

```env
# Firebase Configuration
# Replace these with your actual Firebase project credentials
# Find these in your Firebase Console: https://console.firebase.google.com/

VITE_FIREBASE_API_KEY=your_actual_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
```

### Step 3: Get Your Firebase Credentials

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project** (or create a new one)
3. **Go to Project Settings** (gear icon)
4. **Scroll down to "Your apps"** section
5. **Click on your web app** (or create one)
6. **Copy the configuration** values

### Step 4: Example Configuration

Here's what your `.env` file should look like (replace with your actual values):

```env
VITE_FIREBASE_API_KEY=AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=my-titliai-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-titliai-project
VITE_FIREBASE_STORAGE_BUCKET=my-titliai-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
VITE_FIREBASE_DATABASE_URL=https://my-titliai-project-default-rtdb.firebaseio.com
```

### Step 5: Enable Firestore Database

1. **In Firebase Console**, go to **Firestore Database**
2. **Click "Create Database"**
3. **Choose "Start in test mode"** (for development)
4. **Select a location** (choose closest to your users)
5. **Click "Done"**

### Step 6: Set Up Firestore Collections

Create these collections in your Firestore database:

- `users` - for user data
- `enrollments` - for enrollment data  
- `payments` - for payment data
- `workshops` - for workshop data

### Step 7: Test the Connection

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Go to the admin page** and try logging in

3. **Check the browser console** for connection messages:
   - ✅ `Firebase connection successful` = Good
   - ❌ `Firebase connection failed` = Check your credentials

## 🔧 Troubleshooting

### If you still get connection errors:

1. **Check your `.env` file** is in the correct location (`mumee-ai/.env`)
2. **Verify all environment variables** are set correctly
3. **Make sure Firestore is enabled** in your Firebase project
4. **Check Firebase project ID** matches in `.firebaserc` and `.env`
5. **Restart the development server** after changing `.env`

### Common Issues:

- **"Project not found"**: Check your `VITE_FIREBASE_PROJECT_ID`
- **"Permission denied"**: Enable Firestore and set up security rules
- **"API key invalid"**: Check your `VITE_FIREBASE_API_KEY`

## 🚀 Alternative: Use Standalone Admin Page

If you continue having issues with the React admin page, you can use the standalone HTML admin page:

1. **Open `admin.html`** in your browser
2. **Update the Firebase config** in the HTML file directly
3. **Deploy it separately** from your main app

## 📝 Security Notes

- **Never commit `.env` files** to version control
- **Use environment variables** for production
- **Set up proper Firestore security rules** for production
- **Change the admin password** from the default

## 🎯 Next Steps

Once Firebase is connected:

1. **Add some test data** to your collections
2. **Test the admin page** functionality
3. **Set up proper security rules** for production
4. **Deploy your admin page** to your hosting platform

---

**Need help?** Check the browser console for detailed error messages and refer to the Firebase documentation: https://firebase.google.com/docs
