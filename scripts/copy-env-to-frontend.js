#!/usr/bin/env node

// Script to help copy environment variables from backend to frontend
console.log('🔧 Copying Environment Variables from Backend to Frontend Format\n');

// Load environment variables
require('dotenv').config();

const backendToFrontendMapping = {
  'FIREBASE_API_KEY': 'VITE_FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN': 'VITE_FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID': 'VITE_FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET': 'VITE_FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID': 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID': 'VITE_FIREBASE_APP_ID',
  'FIREBASE_DATABASE_URL': 'VITE_FIREBASE_DATABASE_URL'
};

console.log('📋 Environment Variables to Add to Frontend:');
console.log('============================================');

let allBackendVarsPresent = true;

Object.entries(backendToFrontendMapping).forEach(([backendVar, frontendVar]) => {
  const value = process.env[backendVar];
  if (value && value !== 'undefined' && value !== '') {
    // Mask the API key for security
    if (backendVar === 'FIREBASE_API_KEY') {
      const masked = value.substring(0, 8) + '...' + value.substring(value.length - 4);
      console.log(`✅ ${frontendVar}=${masked}`);
    } else {
      console.log(`✅ ${frontendVar}=${value}`);
    }
  } else {
    console.log(`❌ ${frontendVar}=[MISSING - ${backendVar} not found]`);
    allBackendVarsPresent = false;
  }
});

console.log('\n============================================');

if (allBackendVarsPresent) {
  console.log('🎉 All backend variables are available!');
  console.log('\n📝 Instructions:');
  console.log('1. Go to your FRONTEND service on Render.com');
  console.log('2. Click on "Environment" tab');
  console.log('3. Add each variable above with its value');
  console.log('4. Redeploy your frontend service');
} else {
  console.log('❌ Some backend variables are missing!');
  console.log('Please ensure all Firebase variables are set in your backend service first.');
}

console.log('\n🔍 To verify after deployment:');
console.log('1. Go to titliAI.com');
console.log('2. Open browser console (F12)');
console.log('3. Look for "Firebase initialized successfully" message');
console.log('4. Try logging in - should work without API key errors');
