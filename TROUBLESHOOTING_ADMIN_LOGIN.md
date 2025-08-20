# 🔍 Admin Login Troubleshooting Guide

## 🚨 Current Issue
Still getting "Invalid password" error even after setting up environment variables.

## 🔧 Step-by-Step Debug Process

### Step 1: Check Your .env File

1. **Verify .env file exists** in the `mumee-ai` directory
2. **Check the content** - it should look like this:

```env
VITE_ADMIN_PASSWORD=your_actual_password_here
```

3. **Common mistakes to avoid**:
   - No spaces around the `=` sign
   - No quotes around the password
   - Must use `VITE_` prefix
   - No trailing spaces

### Step 2: Run Environment Check Script

```bash
cd mumee-ai
node check-env.js
```

This will show you:
- If `.env` file exists
- What's in your `.env` file
- If environment variables are being read

### Step 3: Test the Admin Page

1. **Go to admin page**: `http://localhost:5173/admin`
2. **Click "Debug Environment Variables" button**
3. **Check browser console** for detailed output
4. **Look at the status message** below the title

### Step 4: Manual Testing

Try these passwords in order:

1. **Fallback password**: `titliAI2025!`
2. **Your environment password**: (whatever you set in `.env`)
3. **Check the debug output** to see what password is actually loaded

## 🔍 Debug Output Analysis

### What to look for in browser console:

```
🔍 === ENVIRONMENT VARIABLE DEBUG ===
import.meta.env: {VITE_ADMIN_PASSWORD: "your_password", ...}
VITE_ADMIN_PASSWORD: "your_password"
ADMIN_PASSWORD: undefined
Final ADMIN_PASSWORD value: "your_password"
Type of ADMIN_PASSWORD: string
Length of ADMIN_PASSWORD: 15
🔍 === END DEBUG ===
```

### If you see:
- `VITE_ADMIN_PASSWORD: undefined` → Environment variable not set
- `Final ADMIN_PASSWORD value: "titliAI2025!"` → Using fallback password
- `Type of ADMIN_PASSWORD: undefined` → Environment variable not loaded

## 🛠️ Common Solutions

### Solution 1: Fix .env File Format

**Wrong:**
```env
VITE_ADMIN_PASSWORD = mypassword
VITE_ADMIN_PASSWORD="mypassword"
VITE_ADMIN_PASSWORD= mypassword
```

**Correct:**
```env
VITE_ADMIN_PASSWORD=mypassword
```

### Solution 2: Restart Development Server

After changing `.env` file:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Solution 3: Check File Location

Make sure `.env` file is in the correct location:
```
mumee-ai/
├── .env  ← Should be here
├── src/
├── package.json
└── ...
```

### Solution 4: Production Environment Variables

For Render/production:
1. Go to Render dashboard
2. Environment variables tab
3. Add: `VITE_ADMIN_PASSWORD` = `your_password`
4. Redeploy

## 🎯 Quick Test Commands

### Test 1: Check if .env exists
```bash
ls -la mumee-ai/.env
```

### Test 2: View .env content
```bash
cat mumee-ai/.env
```

### Test 3: Check environment variables
```bash
cd mumee-ai
node check-env.js
```

### Test 4: Test with fallback password
Use `titliAI2025!` to test if the component works

## 📝 Debug Checklist

- [ ] `.env` file exists in `mumee-ai` directory
- [ ] `.env` file contains `VITE_ADMIN_PASSWORD=your_password`
- [ ] No spaces around `=` in `.env` file
- [ ] Development server restarted after `.env` changes
- [ ] Browser console shows environment variables loaded
- [ ] Admin page shows "✅ Loaded" status
- [ ] Debug button shows correct password value

## 🚨 Emergency Fix

If nothing works, temporarily hardcode the password:

```typescript
// In src/components/AdminPage.tsx, line 24
const ADMIN_PASSWORD = 'your_actual_password_here'; // Temporary fix
```

Then restart the server and test.

## 📞 Next Steps

1. Run the debug script: `node check-env.js`
2. Check browser console output
3. Try the fallback password: `titliAI2025!`
4. Report back what you see in the debug output

This will help us identify exactly where the issue is occurring.
