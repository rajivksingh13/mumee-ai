#!/usr/bin/env node

// Frontend Environment Variables Checker
console.log('🔍 Checking Frontend Environment Variables...\n');

// Load environment variables
require('dotenv').config();

const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

let allSet = true;

console.log('📋 Required Frontend Environment Variables:');
console.log('============================================');

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value && value !== 'undefined' && value !== '') {
    // Mask the API key for security
    if (varName === 'VITE_FIREBASE_API_KEY') {
      const masked = value.substring(0, 8) + '...' + value.substring(value.length - 4);
      console.log(`✅ ${varName}: ${masked}`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`❌ ${varName}: MISSING`);
    allSet = false;
  }
});

console.log('\n============================================');

if (allSet) {
  console.log('🎉 All frontend environment variables are set!');
  console.log('✅ Your Firebase configuration should work in production.');
} else {
  console.log('❌ Some frontend environment variables are missing!');
  console.log('\n🔧 To fix this:');
  console.log('1. Go to your frontend deployment platform (Render/Vercel/Netlify)');
  console.log('2. Add the missing environment variables');
  console.log('3. Redeploy your frontend application');
  console.log('\n📖 Example variables to add:');
  console.log('VITE_FIREBASE_API_KEY=your_actual_api_key');
  console.log('VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com');
  console.log('VITE_FIREBASE_PROJECT_ID=your_project_id');
  console.log('VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com');
  console.log('VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id');
  console.log('VITE_FIREBASE_APP_ID=your_app_id');
  process.exit(1);
}

console.log('\n📚 Next Steps:');
console.log('1. Redeploy your frontend application');
console.log('2. Test login on titliAI.com');
console.log('3. Check browser console for Firebase initialization messages');
