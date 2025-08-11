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

// Function to flatten nested objects for Excel
function flattenObject(obj, prefix = '') {
  const flattened = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (obj[key] !== null && typeof obj[key] === 'object' && !(obj[key] instanceof Date)) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        // Handle Timestamp objects
        if (obj[key] && typeof obj[key] === 'object' && obj[key].toDate) {
          flattened[newKey] = obj[key].toDate().toISOString();
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }
  }
  
  return flattened;
}

// Function to export collection to Excel
async function exportCollectionToExcel(collectionName, outputFileName) {
  try {
    console.log(`📊 Exporting ${collectionName} collection...`);
    
    const snapshot = await db.collection(collectionName).get();
    const data = [];
    
    snapshot.forEach(doc => {
      const docData = doc.data();
      const flattenedData = flattenObject(docData);
      flattenedData['Document ID'] = doc.id; // Add document ID
      data.push(flattenedData);
    });
    
    if (data.length === 0) {
      console.log(`⚠️ No documents found in ${collectionName} collection`);
      return;
    }
    
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, collectionName);
    
    // Write to file
    const outputPath = path.join(__dirname, '..', 'exports', outputFileName);
    
    // Create exports directory if it doesn't exist
    const exportsDir = path.dirname(outputPath);
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }
    
    XLSX.writeFile(workbook, outputPath);
    
    console.log(`✅ Successfully exported ${data.length} documents to ${outputPath}`);
    
  } catch (error) {
    console.error(`❌ Error exporting ${collectionName}:`, error);
  }
}

// Function to export multiple collections
async function exportAllCollections() {
  const collections = [
    { name: 'users', fileName: 'users-export.xlsx' },
    { name: 'enrollments', fileName: 'enrollments-export.xlsx' },
    { name: 'payments', fileName: 'payments-export.xlsx' },
    { name: 'workshops', fileName: 'workshops-export.xlsx' }
  ];
  
  console.log('🚀 Starting Firestore export...\n');
  
  for (const collection of collections) {
    await exportCollectionToExcel(collection.name, collection.fileName);
    console.log(''); // Add spacing between exports
  }
  
  console.log('🎉 Export completed! Check the exports folder.');
}

// Function to export specific collection
async function exportSpecificCollection(collectionName) {
  const fileName = `${collectionName}-export.xlsx`;
  await exportCollectionToExcel(collectionName, fileName);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Export all collections
    await exportAllCollections();
  } else if (args.length === 1) {
    // Export specific collection
    await exportSpecificCollection(args[0]);
  } else {
    console.log('Usage:');
    console.log('  node export-firestore-to-excel.js                    # Export all collections');
    console.log('  node export-firestore-to-excel.js users              # Export specific collection');
    console.log('');
    console.log('Available collections: users, enrollments, payments, workshops');
  }
  
  process.exit(0);
}

// Run the script
main().catch(console.error); 