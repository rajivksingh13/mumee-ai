const fs = require('fs');
const path = require('path');

console.log('📁 Copying admin.html to dist folder...');

const sourcePath = path.join(__dirname, '..', 'admin.html');
const destPath = path.join(__dirname, '..', 'dist', 'admin.html');

// Create dist directory if it doesn't exist
const distDir = path.dirname(destPath);
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy admin.html to dist folder
try {
  fs.copyFileSync(sourcePath, destPath);
  console.log('✅ admin.html copied to dist folder successfully!');
  console.log('📁 Source:', sourcePath);
  console.log('📁 Destination:', destPath);
} catch (error) {
  console.error('❌ Error copying admin.html:', error.message);
  process.exit(1);
}
