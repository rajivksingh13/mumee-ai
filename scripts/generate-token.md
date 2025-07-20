# Manual Firebase Token Generation Guide

If the batch script isn't working, follow these steps manually:

## Method 1: Using npx (Recommended)

```bash
# Navigate to your project directory
cd mumee-ai

# Generate Firebase CI token using npx
npx firebase-tools login:ci
```

## Method 2: Install Firebase CLI Globally

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Generate CI token
firebase login:ci
```

## Method 3: Using Project Dependencies

```bash
# Navigate to your project directory
cd mumee-ai

# Install dependencies if not already done
npm install

# Generate token using local firebase-tools
npx firebase login:ci
```

## What to Expect

After running any of the above commands:

1. **Browser opens** for Firebase authentication
2. **Sign in** with your Google account
3. **Grant permissions** to Firebase CLI
4. **Copy the token** that appears in your terminal

The token will look like:
```
✔  Success! Use this token to login on a CI server:

1//0example_token_here_very_long_string
```

## Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **"New repository secret"**
4. Name: `FIREBASE_TOKEN`
5. Value: Paste the token from above
6. Click **"Add secret"**

## Troubleshooting

- **"firebase command not found"**: Use Method 1 or 2
- **Authentication fails**: Make sure you're logged into the correct Google account
- **Token not generated**: Try running `firebase login` first, then `firebase login:ci` 