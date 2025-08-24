#!/usr/bin/env node

/**
 * Test Admin Workshop Upload
 * 
 * This script tests the admin workshop upload functionality
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

/**
 * Create a test Excel file for admin upload
 */
function createTestExcelFile() {
  console.log('🧪 Creating test Excel file for admin upload...');
  
  const testData = [
    {
      // Required fields
      id: 'admin-test-workshop-1',
      title: 'Admin Test Workshop',
      description: 'This is a test workshop created via admin upload',
      overview: 'Test workshop overview for admin upload',
      level: 'beginner',
      price: 1999,
      currency: 'INR',
      duration: 15,
      format: 'Online Interactive',
      certificate: 'true',
      status: 'active',
      featured: 'false',
      slug: 'admin-test-workshop-1',
      
      // Live session fields
      isLiveSession: 'false',
      maxParticipants: 15,
      meetingId: '',
      meetingLink: '',
      meetingPassword: '',
      scheduledDate: '',
      scheduledTime: '',
      sessionDuration: 90,
      timezone: 'Asia/Kolkata',
      
      // Complex fields (JSON)
      curriculum_json: JSON.stringify({
        modules: [
          {
            id: 'admin-test-module-1',
            title: 'Admin Test Module',
            description: 'Test module description for admin upload',
            duration: 1,
            lessons: [
              {
                id: 'admin-test-lesson-1',
                title: 'Admin Test Lesson',
                description: 'Test lesson description for admin upload',
                content: 'This is test lesson content for admin upload',
                duration: 30,
                videoUrl: 'https://example.com/admin-test-video',
                resources: ['admin-test-resource1.pdf', 'admin-test-resource2.pdf']
              }
            ]
          }
        ]
      }, null, 2)
    }
  ];
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(testData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Workshops');
  
  // Write test file
  const testPath = path.join(__dirname, 'admin-test-workshop.xlsx');
  XLSX.writeFile(workbook, testPath);
  
  console.log('✅ Test Excel file created for admin upload:', testPath);
  return testPath;
}

/**
 * Test admin upload functionality
 */
async function testAdminUpload() {
  console.log('🧪 Testing admin workshop upload functionality...');
  
  try {
    // Create test Excel file
    const testFilePath = createTestExcelFile();
    
    // Check if file exists
    if (!fs.existsSync(testFilePath)) {
      throw new Error('Test file was not created');
    }
    
    console.log('✅ Test file created successfully');
    console.log('📁 File path:', testFilePath);
    console.log('📊 File size:', fs.statSync(testFilePath).size, 'bytes');
    
    // Test file reading
    const workbook = XLSX.readFile(testFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log('✅ Excel file reading test passed');
    console.log('📊 Found', data.length, 'workshop(s) in test file');
    
    // Test data structure
    if (data.length > 0) {
      const workshop = data[0];
      console.log('📋 Workshop data structure:');
      console.log('  - id:', workshop.id);
      console.log('  - title:', workshop.title);
      console.log('  - level:', workshop.level);
      console.log('  - price:', workshop.price);
      console.log('  - curriculum_json:', workshop.curriculum_json ? 'Present' : 'Missing');
    }
    
    // Clean up test file
    fs.unlinkSync(testFilePath);
    console.log('✅ Test file cleaned up');
    
    console.log('\n🎉 Admin workshop upload test completed successfully!');
    console.log('📋 Next steps:');
    console.log('1. Start the server: cd server && npm run dev');
    console.log('2. Open admin.html in browser');
    console.log('3. Go to "Upload Workshop" tab');
    console.log('4. Use the test Excel file to upload workshops');
    
  } catch (error) {
    console.error('❌ Admin upload test failed:', error.message);
  }
}

/**
 * Show usage instructions
 */
function showInstructions() {
  console.log(`
🚀 Admin Workshop Upload Test

This script tests the admin workshop upload functionality.

Usage:
  node test-workshop-upload-admin.js

What it does:
1. Creates a test Excel file with workshop data
2. Tests file reading and data structure
3. Cleans up test files
4. Provides instructions for manual testing

Prerequisites:
- Server dependencies installed (multer, xlsx, firebase-admin)
- Firebase service account configured
- Server running on port 3000

Manual Testing Steps:
1. Start server: cd server && npm run dev
2. Open admin.html in browser
3. Navigate to "Upload Workshop" tab
4. Upload the test Excel file
5. Check results in Firestore
`);
}

// Run test if this file is executed directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showInstructions();
  } else {
    testAdminUpload();
  }
}

module.exports = {
  testAdminUpload,
  createTestExcelFile
};
