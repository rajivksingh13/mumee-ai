#!/usr/bin/env node

/**
 * Workshop Excel Upload Tool
 * 
 * This script allows admins to upload workshop data from Excel files to Firestore
 * Supports both simple and complex workshop structures
 */

const admin = require('firebase-admin');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Workshop field definitions
const WORKSHOP_FIELDS = {
  // Required fields
  required: ['id', 'title', 'description', 'level', 'price', 'duration', 'slug'],
  
  // Basic fields
  basic: [
    'id', 'title', 'description', 'overview', 'level', 'price', 'currency', 
    'duration', 'format', 'certificate', 'status', 'featured', 'slug'
  ],
  
  // Live session fields
  liveSession: [
    'isLiveSession', 'maxParticipants', 'meetingId', 'meetingLink', 
    'meetingPassword', 'scheduledDate', 'scheduledTime', 'sessionDuration', 'timezone'
  ],
  
  // Complex fields (JSON strings in Excel)
  complex: ['curriculum_json']
};

// Field validation rules
const VALIDATION_RULES = {
  level: ['beginner', 'foundation', 'advanced'],
  status: ['active', 'inactive', 'draft'],
  currency: ['INR', 'USD', 'EUR'],
  format: ['Online Interactive', 'Online Self-Paced', 'In-Person', 'Hybrid']
};

/**
 * Validate workshop data
 */
function validateWorkshop(workshop) {
  const errors = [];
  
  // Check required fields
  for (const field of WORKSHOP_FIELDS.required) {
    if (!workshop[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Validate level
  if (workshop.level && !VALIDATION_RULES.level.includes(workshop.level)) {
    errors.push(`Invalid level: ${workshop.level}. Must be one of: ${VALIDATION_RULES.level.join(', ')}`);
  }
  
  // Validate status
  if (workshop.status && !VALIDATION_RULES.status.includes(workshop.status)) {
    errors.push(`Invalid status: ${workshop.status}. Must be one of: ${VALIDATION_RULES.status.join(', ')}`);
  }
  
  // Validate price
  if (workshop.price && (isNaN(workshop.price) || workshop.price < 0)) {
    errors.push(`Invalid price: ${workshop.price}. Must be a positive number`);
  }
  
  // Validate duration
  if (workshop.duration && (isNaN(workshop.duration) || workshop.duration <= 0)) {
    errors.push(`Invalid duration: ${workshop.duration}. Must be a positive number`);
  }
  
  return errors;
}

/**
 * Convert Excel data types to Firestore types
 */
function convertDataTypes(workshop) {
  const converted = { ...workshop };
  
  // Convert numbers
  if (converted.price) converted.price = Number(converted.price);
  if (converted.duration) converted.duration = Number(converted.duration);
  if (converted.maxParticipants) converted.maxParticipants = Number(converted.maxParticipants);
  if (converted.sessionDuration) converted.sessionDuration = Number(converted.sessionDuration);
  
  // Convert booleans
  if (converted.certificate !== undefined) {
    converted.certificate = converted.certificate === 'true' || converted.certificate === true;
  }
  if (converted.featured !== undefined) {
    converted.featured = converted.featured === 'true' || converted.featured === true;
  }
  if (converted.isLiveSession !== undefined) {
    converted.isLiveSession = converted.isLiveSession === 'true' || converted.isLiveSession === true;
  }
  
  // Parse JSON fields
  if (converted.curriculum_json) {
    try {
      converted.curriculum = JSON.parse(converted.curriculum_json);
      delete converted.curriculum_json;
    } catch (error) {
      throw new Error(`Invalid JSON in curriculum_json: ${error.message}`);
    }
  }
  
  // Set default values
  if (!converted.currency) converted.currency = 'INR';
  if (!converted.format) converted.format = 'Online Interactive';
  if (!converted.status) converted.status = 'active';
  if (!converted.certificate) converted.certificate = true;
  if (!converted.featured) converted.featured = false;
  if (!converted.isLiveSession) converted.isLiveSession = false;
  if (!converted.timezone) converted.timezone = 'Asia/Kolkata';
  
  // Add timestamps
  converted.createdAt = admin.firestore.Timestamp.now();
  converted.updatedAt = admin.firestore.Timestamp.now();
  
  return converted;
}

/**
 * Create Excel template for workshop upload
 */
function createExcelTemplate() {
  console.log('📝 Creating Excel template for workshop upload...');
  
  // Sample data for template
  const templateData = [
    {
      // Required fields
      id: 'new-workshop-1',
      title: 'New AI Workshop',
      description: 'Description of the new workshop',
      overview: 'Brief overview of the workshop',
      level: 'beginner',
      price: 2999,
      currency: 'INR',
      duration: 20,
      format: 'Online Interactive',
      certificate: 'true',
      status: 'active',
      featured: 'false',
      slug: 'new-workshop-1',
      
      // Live session fields
      isLiveSession: 'false',
      maxParticipants: 20,
      meetingId: '',
      meetingLink: '',
      meetingPassword: '',
      scheduledDate: '',
      scheduledTime: '',
      sessionDuration: 120,
      timezone: 'Asia/Kolkata',
      
      // Complex fields (JSON)
      curriculum_json: JSON.stringify({
        modules: [
          {
            id: 'module-1',
            title: 'Introduction',
            description: 'Module description',
            duration: 1,
            lessons: [
              {
                id: 'lesson-1-1',
                title: 'First Lesson',
                description: 'Lesson description',
                content: 'Lesson content',
                duration: 30,
                videoUrl: 'https://example.com/video',
                resources: ['resource1.pdf', 'resource2.pdf']
              }
            ]
          }
        ]
      }, null, 2)
    }
  ];
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Workshops');
  
  // Write template file
  const templatePath = path.join(__dirname, 'workshop-upload-template.xlsx');
  XLSX.writeFile(workbook, templatePath);
  
  console.log('✅ Excel template created:', templatePath);
  console.log('📋 Instructions:');
  console.log('1. Open the template in Excel');
  console.log('2. Fill in your workshop data');
  console.log('3. Save the file');
  console.log('4. Run: node workshop-excel-upload.js --file your-file.xlsx');
  
  return templatePath;
}

/**
 * Upload workshops from Excel file
 */
async function uploadFromExcel(filePath) {
  try {
    console.log('📖 Reading Excel file:', filePath);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    // Read Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    if (data.length === 0) {
      throw new Error('No data found in Excel file');
    }
    
    console.log(`📊 Found ${data.length} workshop(s) in Excel file`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each workshop
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      console.log(`\n🔄 Processing workshop ${i + 1}/${data.length}: ${row.title || row.id || 'Unknown'}`);
      
      try {
        // Validate workshop data
        const validationErrors = validateWorkshop(row);
        if (validationErrors.length > 0) {
          console.log(`❌ Validation errors for workshop ${i + 1}:`);
          validationErrors.forEach(error => console.log(`   - ${error}`));
          errorCount++;
          continue;
        }
        
        // Convert data types
        const workshop = convertDataTypes(row);
        
        // Upload to Firestore
        const workshopRef = db.collection('workshops').doc(workshop.id);
        await workshopRef.set(workshop);
        
        console.log(`✅ Successfully uploaded: ${workshop.title} (ID: ${workshop.id})`);
        successCount++;
        
      } catch (error) {
        console.log(`❌ Error uploading workshop ${i + 1}: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Upload completed!`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    
    if (errorCount > 0) {
      console.log('\n💡 Tips:');
      console.log('- Check the validation errors above');
      console.log('- Ensure all required fields are filled');
      console.log('- Verify JSON format for curriculum_json field');
      console.log('- Use the template: node workshop-excel-upload.js --template');
    }
    
  } catch (error) {
    console.error('❌ Error reading Excel file:', error.message);
  }
}

/**
 * List existing workshops
 */
async function listExistingWorkshops() {
  try {
    console.log('📋 Listing existing workshops...\n');
    
    const snapshot = await db.collection('workshops').get();
    
    if (snapshot.empty) {
      console.log('No workshops found in database');
      return;
    }
    
    console.log('Existing workshops:');
    console.log('─'.repeat(80));
    
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`📚 ${data.title}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Level: ${data.level}`);
      console.log(`   Price: ₹${data.price}`);
      console.log(`   Status: ${data.status}`);
      console.log(`   Live Session: ${data.isLiveSession ? 'Yes' : 'No'}`);
      console.log(`   Modules: ${data.curriculum?.modules?.length || 0}`);
      console.log('─'.repeat(80));
    });
    
  } catch (error) {
    console.error('❌ Error listing workshops:', error.message);
  }
}

/**
 * Show help information
 */
function showHelp() {
  console.log(`
🚀 Workshop Excel Upload Tool

Usage:
  node workshop-excel-upload.js [options]

Options:
  --template                    Create Excel template
  --file <path>                Upload workshops from Excel file
  --list                       List existing workshops
  --help                       Show this help

Examples:
  node workshop-excel-upload.js --template
  node workshop-excel-upload.js --file workshops.xlsx
  node workshop-excel-upload.js --list

Excel Structure:
  Required fields: id, title, description, level, price, duration, slug
  Optional fields: overview, currency, format, certificate, status, featured
  Live session fields: isLiveSession, maxParticipants, meetingId, etc.
  Complex fields: curriculum_json (JSON string)

Template:
  Run --template to create a sample Excel file with the correct structure.
`);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    showHelp();
    return;
  }
  
  if (args.includes('--template')) {
    createExcelTemplate();
    return;
  }
  
  if (args.includes('--list')) {
    await listExistingWorkshops();
    return;
  }
  
  const fileIndex = args.indexOf('--file');
  if (fileIndex !== -1 && args[fileIndex + 1]) {
    const filePath = args[fileIndex + 1];
    await uploadFromExcel(filePath);
    return;
  }
  
  console.log('❌ Invalid arguments. Use --help for usage information.');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  uploadFromExcel,
  createExcelTemplate,
  validateWorkshop,
  convertDataTypes
};
