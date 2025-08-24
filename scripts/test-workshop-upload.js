#!/usr/bin/env node

/**
 * Test Workshop Excel Upload
 * 
 * This script tests the workshop Excel upload functionality
 */

const { uploadFromExcel, createExcelTemplate, validateWorkshop, convertDataTypes } = require('./workshop-excel-upload.js');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * Create a test Excel file
 */
function createTestExcelFile() {
  console.log('🧪 Creating test Excel file...');
  
  const testData = [
    {
      // Required fields
      id: 'test-workshop-1',
      title: 'Test AI Workshop',
      description: 'This is a test workshop for validation',
      overview: 'Test workshop overview',
      level: 'beginner',
      price: 1999,
      currency: 'INR',
      duration: 15,
      format: 'Online Interactive',
      certificate: 'true',
      status: 'active',
      featured: 'false',
      slug: 'test-workshop-1',
      
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
            id: 'test-module-1',
            title: 'Test Module',
            description: 'Test module description',
            duration: 1,
            lessons: [
              {
                id: 'test-lesson-1',
                title: 'Test Lesson',
                description: 'Test lesson description',
                content: 'This is test lesson content',
                duration: 30,
                videoUrl: 'https://example.com/test-video',
                resources: ['test-resource1.pdf', 'test-resource2.pdf']
              }
            ]
          }
        ]
      }, null, 2)
    },
    {
      // Second test workshop (simple structure)
      id: 'test-workshop-2',
      title: 'Simple Test Workshop',
      description: 'A simple test workshop without complex curriculum',
      level: 'foundation',
      price: 2999,
      duration: 20,
      slug: 'test-workshop-2',
      curriculum_json: JSON.stringify({ modules: [] })
    }
  ];
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(testData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Workshops');
  
  // Write test file
  const testPath = path.join(__dirname, 'test-workshops.xlsx');
  XLSX.writeFile(workbook, testPath);
  
  console.log('✅ Test Excel file created:', testPath);
  return testPath;
}

/**
 * Test validation function
 */
function testValidation() {
  console.log('\n🧪 Testing validation function...');
  
  const validWorkshop = {
    id: 'test-valid',
    title: 'Valid Workshop',
    description: 'Valid description',
    level: 'beginner',
    price: 1000,
    duration: 10,
    slug: 'test-valid'
  };
  
  const invalidWorkshop = {
    id: 'test-invalid',
    title: '', // Missing title
    level: 'invalid-level', // Invalid level
    price: -100, // Negative price
    duration: 0 // Zero duration
  };
  
  // Test valid workshop
  const validErrors = validateWorkshop(validWorkshop);
  console.log('✅ Valid workshop errors:', validErrors.length === 0 ? 'None' : validErrors);
  
  // Test invalid workshop
  const invalidErrors = validateWorkshop(invalidWorkshop);
  console.log('❌ Invalid workshop errors:', invalidErrors);
  
  return validErrors.length === 0 && invalidErrors.length > 0;
}

/**
 * Test data type conversion
 */
function testDataConversion() {
  console.log('\n🧪 Testing data type conversion...');
  
  const excelData = {
    id: 'test-conversion',
    title: 'Test Conversion',
    description: 'Test description',
    level: 'advanced',
    price: '5999', // String number
    duration: '25', // String number
    certificate: 'true', // String boolean
    featured: 'false', // String boolean
    isLiveSession: 'true', // String boolean
    maxParticipants: '20', // String number
    sessionDuration: '120', // String number
    curriculum_json: JSON.stringify({ modules: [] })
  };
  
  const converted = convertDataTypes(excelData);
  
  console.log('✅ Data type conversion test:');
  console.log('  - price (number):', typeof converted.price, converted.price);
  console.log('  - duration (number):', typeof converted.duration, converted.duration);
  console.log('  - certificate (boolean):', typeof converted.certificate, converted.certificate);
  console.log('  - featured (boolean):', typeof converted.featured, converted.featured);
  console.log('  - isLiveSession (boolean):', typeof converted.isLiveSession, converted.isLiveSession);
  console.log('  - curriculum (object):', typeof converted.curriculum, converted.curriculum);
  
  return typeof converted.price === 'number' && 
         typeof converted.certificate === 'boolean' && 
         typeof converted.curriculum === 'object';
}

/**
 * Test Excel file creation
 */
function testExcelCreation() {
  console.log('\n🧪 Testing Excel template creation...');
  
  try {
    const templatePath = createExcelTemplate();
    const exists = fs.existsSync(templatePath);
    console.log('✅ Excel template creation:', exists ? 'Success' : 'Failed');
    return exists;
  } catch (error) {
    console.log('❌ Excel template creation failed:', error.message);
    return false;
  }
}

/**
 * Test Excel file reading
 */
function testExcelReading() {
  console.log('\n🧪 Testing Excel file reading...');
  
  try {
    const testPath = createTestExcelFile();
    const workbook = XLSX.readFile(testPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log('✅ Excel file reading:', data.length > 0 ? 'Success' : 'Failed');
    console.log('  - Found', data.length, 'workshops in test file');
    
    // Clean up test file
    fs.unlinkSync(testPath);
    
    return data.length > 0;
  } catch (error) {
    console.log('❌ Excel file reading failed:', error.message);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting Workshop Excel Upload Tests...\n');
  
  const tests = [
    { name: 'Validation Function', test: testValidation },
    { name: 'Data Type Conversion', test: testDataConversion },
    { name: 'Excel Template Creation', test: testExcelCreation },
    { name: 'Excel File Reading', test: testExcelReading }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    try {
      const result = test.test();
      if (result) {
        console.log(`✅ ${test.name}: PASSED`);
        passedTests++;
      } else {
        console.log(`❌ ${test.name}: FAILED`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
    }
    console.log('');
  }
  
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! The workshop Excel upload system is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the errors above.');
  }
  
  return passedTests === totalTests;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  testValidation,
  testDataConversion,
  testExcelCreation,
  testExcelReading
};
