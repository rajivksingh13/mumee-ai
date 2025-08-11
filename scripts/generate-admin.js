const fs = require('fs');
const path = require('path');

// Load environment variables from .env file if it exists, otherwise use system environment
try {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
} catch (error) {
  console.log('No .env file found, using system environment variables');
}

// Read the template admin.html
const templatePath = path.join(__dirname, '..', 'admin-template.html');
const outputPath = path.join(__dirname, '..', 'admin.html');

// Firebase configuration from environment variables (works with Render.com)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Admin password from environment variable (works with Render.com)
const adminPassword = process.env.ADMIN_PASSWORD || 'YOUR_ADMIN_PASSWORD';

console.log('🔧 Generating admin.html with environment variables...');
console.log('📊 Firebase Project ID:', firebaseConfig.projectId);
console.log('🔑 Admin password configured:', adminPassword !== 'YOUR_ADMIN_PASSWORD' ? 'Yes' : 'No');
console.log('🌍 Environment source:', process.env.NODE_ENV === 'production' ? 'Render.com' : 'Local .env');

// Check if we're using placeholder values
const usingPlaceholders = firebaseConfig.apiKey === "YOUR_FIREBASE_API_KEY" || adminPassword === 'YOUR_ADMIN_PASSWORD';

if (usingPlaceholders) {
  console.log('⚠️  WARNING: Using placeholder values. Please set environment variables:');
  console.log('   - For local development: Create a .env file');
  console.log('   - For Render.com: Add environment variables to your service');
  console.log('   - See RENDER_ADMIN_SETUP.md for details');
}

// Read the current admin.html as template
let adminHtml = fs.readFileSync(path.join(__dirname, '..', 'admin.html'), 'utf8');

// Replace the hardcoded Firebase config
const firebaseConfigString = JSON.stringify(firebaseConfig, null, 8);
adminHtml = adminHtml.replace(
  /const firebaseConfig = \{[\s\S]*?\};/,
  `const firebaseConfig = ${firebaseConfigString};`
);

// Replace the hardcoded admin password
adminHtml = adminHtml.replace(
  /const ADMIN_PASSWORD = '[^']*';/,
  `const ADMIN_PASSWORD = '${adminPassword}';`
);

// Write the generated admin.html
fs.writeFileSync(outputPath, adminHtml);

console.log('✅ admin.html generated successfully!');
console.log('📁 Output file:', outputPath);
console.log('🔒 Admin password:', adminPassword);
console.log('🌐 Firebase project:', firebaseConfig.projectId);

// Log environment variable sources for debugging
console.log('\n🔍 Environment Variable Sources:');
console.log('VITE_FIREBASE_API_KEY:', process.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Not set');
console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? 'Set' : 'Not set');
console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? 'Set' : 'Not set');

if (usingPlaceholders) {
  console.log('\n📋 Next Steps:');
  console.log('1. For Render.com: Add environment variables to your service');
  console.log('2. For local development: Create a .env file with your Firebase config');
  console.log('3. Run this script again after setting environment variables');
}
