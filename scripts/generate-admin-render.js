const fs = require('fs');
const path = require('path');

console.log('🔧 Generating admin.html for Render.com deployment...');

// Read the current admin.html as template
const outputPath = path.join(__dirname, '..', 'admin.html');

// Firebase configuration from Render.com environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Admin password from Render.com environment variable
const adminPassword = process.env.ADMIN_PASSWORD || 'YOUR_ADMIN_PASSWORD';

console.log('📊 Firebase Project ID:', firebaseConfig.projectId);
console.log('🔑 Admin password configured:', adminPassword !== 'YOUR_ADMIN_PASSWORD' ? 'Yes' : 'No');
console.log('🌍 Environment: Render.com');

// Check if we're using placeholder values
const usingPlaceholders = firebaseConfig.apiKey === "YOUR_FIREBASE_API_KEY" || adminPassword === 'YOUR_ADMIN_PASSWORD';

if (usingPlaceholders) {
  console.log('⚠️  WARNING: Using placeholder values. Please add environment variables to Render.com:');
  console.log('   Required variables:');
  console.log('   - VITE_FIREBASE_API_KEY');
  console.log('   - VITE_FIREBASE_AUTH_DOMAIN');
  console.log('   - VITE_FIREBASE_PROJECT_ID');
  console.log('   - VITE_FIREBASE_STORAGE_BUCKET');
  console.log('   - VITE_FIREBASE_MESSAGING_SENDER_ID');
  console.log('   - VITE_FIREBASE_APP_ID');
  console.log('   - ADMIN_PASSWORD');
  console.log('   See RENDER_ADMIN_SETUP.md for details');
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
  console.log('\n📋 Next Steps for Render.com:');
  console.log('1. Go to your Render.com dashboard');
  console.log('2. Select your service');
  console.log('3. Go to Environment tab');
  console.log('4. Add the required environment variables');
  console.log('5. Redeploy your service');
  console.log('6. The admin page will be generated with your Render.com environment variables');
}
