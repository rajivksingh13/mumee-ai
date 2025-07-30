// Simple environment variable check
console.log('🔍 Checking Environment Variables...');

const envVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_DATABASE_URL'
];

console.log('\n📋 Environment Variables Status:');
let missingCount = 0;

envVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: Set (${value.substring(0, 10)}...)`);
  } else {
    console.log(`❌ ${envVar}: Missing`);
    missingCount++;
  }
});

console.log(`\n📊 Summary: ${envVars.length - missingCount}/${envVars.length} variables set`);

if (missingCount > 0) {
  console.log('\n❌ Missing environment variables!');
  console.log('💡 Please check your .env file in the mumee-ai folder.');
  console.log('💡 Make sure all Firebase variables are set.');
} else {
  console.log('\n✅ All environment variables are set!');
  console.log('💡 You can now run the migration scripts.');
}

// Check if .env file exists
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');

if (existsSync(envPath)) {
  console.log('\n✅ .env file found');
  const envContent = readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  console.log(`📄 .env file has ${lines.length} non-empty lines`);
} else {
  console.log('\n❌ .env file not found!');
  console.log('💡 Please create a .env file in the mumee-ai folder.');
} 