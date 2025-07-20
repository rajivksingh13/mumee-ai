@echo off
echo 🚀 Setting up CI/CD for MumeeAI Firebase deployment
echo ==================================================

REM Check if Firebase CLI is installed
echo Checking Firebase CLI installation...
firebase --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Firebase CLI is not installed globally.
    echo.
    echo Please install it first:
    echo npm install -g firebase-tools
    echo.
    echo Or use npx to run it:
    echo npx firebase-tools login:ci
    echo.
    pause
    exit /b 1
)

echo ✅ Firebase CLI is installed

REM Check if user is logged in
echo Checking Firebase authentication...
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo 🔐 You need to log in to Firebase first:
    firebase login
    if errorlevel 1 (
        echo ❌ Firebase login failed
        pause
        exit /b 1
    )
)

echo ✅ Firebase authentication verified

echo.
echo 🔑 Generating Firebase CI token...
echo This will open a browser window for authentication.
echo After authentication, copy the token and add it to your GitHub repository secrets.
echo.

REM Generate CI token
firebase login:ci
if errorlevel 1 (
    echo ❌ Failed to generate Firebase CI token
    echo.
    echo Try running manually:
    echo firebase login:ci
    pause
    exit /b 1
)

echo.
echo ✅ Token generated successfully!
echo.
echo 📋 Next steps:
echo 1. Copy the token from above
echo 2. Go to your GitHub repository
echo 3. Navigate to Settings → Secrets and variables → Actions
echo 4. Click 'New repository secret'
echo 5. Name: FIREBASE_TOKEN
echo 6. Value: Paste the token
echo 7. Click 'Add secret'
echo.
echo 🎉 Your CI/CD pipeline is ready! Push to master branch to trigger deployment.
pause 