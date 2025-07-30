import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Step-by-Step Debug - Starting...');

// Step 1: Load .env file
console.log('\n📋 Step 1: Loading .env file...');
const loadEnvFile = () => {
  const envPath = join(__dirname, '..', '.env');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=');
          process.env[key] = value;
        }
      }
    });
    
    console.log('✅ .env file loaded successfully');
  } else {
    console.log('❌ .env file not found at:', envPath);
    process.exit(1);
  }
};

loadEnvFile();

// Step 2: Check environment variables
console.log('\n📋 Step 2: Checking environment variables...');
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL
};

console.log('Firebase Config:');
Object.keys(firebaseConfig).forEach(key => {
  const value = firebaseConfig[key];
  if (value) {
    console.log(`   ✅ ${key}: Set (${value.substring(0, 10)}...)`);
  } else {
    console.log(`   ❌ ${key}: Missing`);
  }
});

if (!process.env.VITE_FIREBASE_API_KEY || !process.env.VITE_FIREBASE_PROJECT_ID) {
  console.log('\n❌ Missing required environment variables!');
  process.exit(1);
}

console.log('✅ Environment variables are set correctly!');

// Step 3: Try to import Firebase modules
console.log('\n📦 Step 3: Importing Firebase modules...');
try {
  console.log('   Trying to import firebase/app...');
  const { initializeApp } = await import('firebase/app');
  console.log('   ✅ firebase/app imported successfully');
  
  console.log('   Trying to import firebase/firestore...');
  const { getFirestore, doc, setDoc, collection, getDocs } = await import('firebase/firestore');
  console.log('   ✅ firebase/firestore imported successfully');
  
  console.log('✅ All Firebase modules imported successfully!');
  
  // Step 4: Try to initialize Firebase
  console.log('\n🚀 Step 4: Initializing Firebase...');
  try {
    const app = initializeApp(firebaseConfig);
    console.log('   ✅ Firebase app initialized');
    
    const firestore = getFirestore(app);
    console.log('   ✅ Firestore initialized');
    
    console.log('✅ Firebase initialized successfully!');
    
    // Step 5: Try a simple Firestore operation
    console.log('\n🔍 Step 5: Testing Firestore connection...');
    try {
      console.log('   Trying to read from workshops collection...');
      const workshopsSnapshot = await getDocs(collection(firestore, 'workshops'));
      console.log(`   ✅ Successfully read from Firestore. Found ${workshopsSnapshot.size} workshops.`);
      
      console.log('✅ Firestore connection test successful!');
      
      // Step 6: Try to write to Firestore
      console.log('\n✍️ Step 6: Testing Firestore write...');
      try {
        const testDoc = doc(firestore, 'test', 'migration-test');
        await setDoc(testDoc, {
          message: 'Migration test successful',
          timestamp: new Date(),
          test: true
        });
        console.log('   ✅ Successfully wrote to Firestore');
        
        console.log('✅ All Firebase operations working correctly!');
        console.log('🎉 The migration script should work now!');
        
      } catch (writeError) {
        console.error('❌ Error writing to Firestore:', writeError.message);
        console.error('   This might be a permissions issue.');
      }
      
    } catch (readError) {
      console.error('❌ Error reading from Firestore:', readError.message);
      console.error('   This might be a permissions or connection issue.');
    }
    
  } catch (initError) {
    console.error('❌ Error initializing Firebase:', initError.message);
    console.error('   Error details:', initError);
  }
  
} catch (importError) {
  console.error('❌ Error importing Firebase modules:', importError.message);
  console.error('   This might be a dependency or module issue.');
  console.error('   Error details:', importError);
}

console.log('\n🔍 Debug completed!'); 