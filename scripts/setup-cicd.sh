#!/bin/bash

echo "🚀 Setting up CI/CD for MumeeAI Firebase deployment"
echo "=================================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

echo "✅ Firebase CLI is installed"

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 You need to log in to Firebase first:"
    firebase login
fi

echo "✅ Firebase authentication verified"

echo ""
echo "🔑 Generating Firebase CI token..."
echo "This will open a browser window for authentication."
echo "After authentication, copy the token and add it to your GitHub repository secrets."
echo ""

# Generate CI token
firebase login:ci

echo ""
echo "📋 Next steps:"
echo "1. Copy the token from above"
echo "2. Go to your GitHub repository"
echo "3. Navigate to Settings → Secrets and variables → Actions"
echo "4. Click 'New repository secret'"
echo "5. Name: FIREBASE_TOKEN"
echo "6. Value: Paste the token"
echo "7. Click 'Add secret'"
echo ""
echo "🎉 Your CI/CD pipeline is ready! Push to main branch to trigger deployment." 