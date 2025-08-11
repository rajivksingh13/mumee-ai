# Render.com Admin Page Setup

This guide explains how to use Render.com environment variables for the admin page instead of hardcoded values.

## Render.com Environment Variables

Since you already have Firebase configuration in Render.com, you need to add these environment variables to your Render.com service:

### Required Environment Variables

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | `AIzaSyDNIiG_Ec_xaFvIxAcoNRPDofTauBVFXGQ` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `mumee-ai.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `mumee-ai` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `mumee-ai.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:534265645496:web:4a529a41833620ab21a74d` |
| `ADMIN_PASSWORD` | Admin page password | `your_secure_password_here` |

### Alternative Variable Names (if VITE_ prefix not available)

If Render.com doesn't support `VITE_` prefixed variables, you can use these alternative names:

| Variable Name | Description |
|---------------|-------------|
| `FIREBASE_API_KEY` | Firebase API Key |
| `FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `FIREBASE_PROJECT_ID` | Firebase Project ID |
| `FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `FIREBASE_APP_ID` | Firebase App ID |

## Setting Up in Render.com

### Step 1: Add Environment Variables

1. Go to your Render.com dashboard
2. Select your service
3. Go to **Environment** tab
4. Add the environment variables listed above

### Step 2: Update Build Command

Add this to your build command in Render.com:

```bash
npm run generate:admin && npm run build
```

Or if you have a custom build script:

```bash
npm install && npm run generate:admin && npm run build
```

### Step 3: Deploy

The admin page will be generated with your Render.com environment variables during the build process.

## Local Development

For local development, create a `.env` file in the `mumee-ai` directory:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id_here

# Admin Configuration
ADMIN_PASSWORD=your_secure_admin_password_here
```

Then run:

```bash
npm run generate:admin
```

## Commands

```bash
# Generate admin page with current environment variables
npm run generate:admin

# Check what configuration will be used
node scripts/generate-admin.js
```

## How It Works

The `generate-admin.js` script:

1. **Reads environment variables** from Render.com (or local `.env`)
2. **Supports both naming conventions** (`VITE_` prefix and without)
3. **Replaces hardcoded values** in `admin.html`
4. **Generates a new admin.html** with your environment variables

## Security Benefits

✅ **No hardcoded credentials** in source code  
✅ **Environment-specific configuration**  
✅ **Secure deployment on Render.com**  
✅ **Easy password management**  

## Troubleshooting

### Environment variables not loading on Render.com
- Check that variable names are exactly as listed above
- Ensure variables are added to the correct service
- Redeploy after adding environment variables

### Admin page not working after deployment
- Check Render.com build logs for errors
- Verify `npm run generate:admin` runs successfully
- Check browser console for Firebase errors

### Local vs Production differences
- Local: Uses `.env` file
- Production: Uses Render.com environment variables
- Both use the same variable names

## Example Render.com Environment Setup

In your Render.com service environment variables:

```
VITE_FIREBASE_API_KEY=AIzaSyDNIiG_Ec_xaFvIxAcoNRPDofTauBVFXGQ
VITE_FIREBASE_AUTH_DOMAIN=mumee-ai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mumee-ai
VITE_FIREBASE_STORAGE_BUCKET=mumee-ai.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:534265645496:web:4a529a41833620ab21a74d
ADMIN_PASSWORD=your_secure_password_here
```

## Build Process

The build process on Render.com will:

1. Install dependencies
2. Generate admin.html with environment variables
3. Build the React app
4. Deploy everything

This ensures your admin page always uses the correct environment-specific configuration.
