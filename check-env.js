const fs = require('fs');
const path = require('path');

console.log('🔍 Checking environment variables...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found at:', envPath);
  
  // Read .env file content
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('\n📄 .env file content:');
  console.log('---');
  console.log(envContent);
  console.log('---');
  
  // Check for VITE_ADMIN_PASSWORD
  if (envContent.includes('VITE_ADMIN_PASSWORD')) {
    console.log('\n✅ VITE_ADMIN_PASSWORD found in .env file');
    
    // Extract the value
    const match = envContent.match(/VITE_ADMIN_PASSWORD\s*=\s*(.+)/);
    if (match) {
      const value = match[1].trim();
      console.log('📝 Value:', value);
      console.log('📏 Length:', value.length);
      console.log('🔤 Type:', typeof value);
    }
  } else {
    console.log('\n❌ VITE_ADMIN_PASSWORD NOT found in .env file');
  }
  
  // Check for ADMIN_PASSWORD (without VITE_ prefix)
  if (envContent.includes('ADMIN_PASSWORD=')) {
    console.log('\n✅ ADMIN_PASSWORD found in .env file');
    
    // Extract the value
    const match = envContent.match(/ADMIN_PASSWORD\s*=\s*(.+)/);
    if (match) {
      const value = match[1].trim();
      console.log('📝 Value:', value);
      console.log('📏 Length:', value.length);
      console.log('🔤 Type:', typeof value);
    }
  } else {
    console.log('\n❌ ADMIN_PASSWORD NOT found in .env file');
  }
  
} else {
  console.log('❌ .env file NOT found at:', envPath);
  console.log('\n💡 Create a .env file with:');
  console.log('VITE_ADMIN_PASSWORD=your_password_here');
}

console.log('\n🔍 Environment variables in process.env:');
console.log('VITE_ADMIN_PASSWORD:', process.env.VITE_ADMIN_PASSWORD ? 'SET' : 'NOT SET');
console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? 'SET' : 'NOT SET');

console.log('\n📝 Next steps:');
console.log('1. Make sure your .env file has VITE_ADMIN_PASSWORD=your_password');
console.log('2. Restart your development server: npm run dev');
console.log('3. Check the browser console for debug messages');
console.log('4. Try the "Debug Environment Variables" button on the admin page');
