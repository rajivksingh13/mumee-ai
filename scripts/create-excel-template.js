const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Create Excel template for workshop data upload
function createExcelTemplate() {
  console.log('📊 Creating Excel Template for Workshop Data Upload...');
  
  // Sample workshop data with proper structure
  const templateData = [
    {
      // Basic Fields
      id: "advanced-workshop",
      title: "Advanced AI Workshop",
      description: "Master advanced AI concepts with our expert-level workshop.",
      level: "advanced",
      price: 5999,
      currency: "INR",
      duration: 16,
      format: "Online Interactive",
      certificate: "true",
      status: "active",
      featured: "true",
      slug: "advanced",
      
      // Complex JSON field (curriculum)
      curriculum_json: JSON.stringify({
        modules: [
          {
            id: "module-1",
            title: "GenAI Fundamentals Refresher",
            description: "Review of core GenAI concepts",
            duration: 0.5,
            lessons: [
              {
                id: "lesson-1-1",
                title: "AI, ML, Deep Learning, GenAI Recap",
                description: "Comprehensive AI technology review",
                content: "Review core AI concepts and their relationships",
                duration: 20,
                videoUrl: "https://example.com/video-1-1",
                resources: ["AI_Recap.pdf", "Technology_Review.pdf"]
              },
              {
                id: "lesson-1-2",
                title: "Prompt Engineering (Advanced)",
                description: "Advanced prompt engineering techniques",
                content: "Master advanced prompt engineering strategies",
                duration: 15,
                videoUrl: "https://example.com/video-1-2",
                resources: ["Advanced_PE.pdf", "PE_Advanced.pdf"]
              }
            ]
          },
          {
            id: "module-2",
            title: "Retrieval Augmented Generation (RAG)",
            description: "Understanding and implementing RAG systems",
            duration: 1,
            lessons: [
              {
                id: "lesson-2-1",
                title: "What is RAG?",
                description: "Introduction to RAG concepts",
                content: "Learn the fundamentals of Retrieval Augmented Generation",
                duration: 15,
                videoUrl: "https://example.com/video-2-1",
                resources: ["RAG_Basics.pdf", "RAG_Introduction.pdf"]
              }
            ]
          }
        ]
      }),
      
      // Meeting Information
      isLiveSession: "false",
      maxParticipants: 20,
      meetingId: "555666777",
      meetingLink: "https://zoom.us/j/555666777",
      meetingPassword: "titliAI2024",
      scheduledDate: "2024-01-30",
      scheduledTime: "16:00",
      sessionDuration: 240,
      timezone: "Asia/Kolkata"
    },
    {
      // Second example - Beginner Workshop
      id: "beginner-workshop",
      title: "AI Fundamentals",
      description: "Learn AI basics and fundamentals for beginners.",
      level: "beginner",
      price: 2999,
      currency: "INR",
      duration: 8,
      format: "Online",
      certificate: "true",
      status: "active",
      featured: "true",
      slug: "beginner",
      
      curriculum_json: JSON.stringify({
        modules: [
          {
            id: "module-1",
            title: "Introduction to AI",
            description: "Basic AI concepts and terminology",
            duration: 2,
            lessons: [
              {
                id: "lesson-1-1",
                title: "What is Artificial Intelligence?",
                description: "Understanding AI basics",
                content: "Introduction to AI concepts and applications",
                duration: 30,
                videoUrl: "https://example.com/video-beginner-1",
                resources: ["AI_Basics.pdf", "Introduction.pdf"]
              }
            ]
          }
        ]
      }),
      
      isLiveSession: "false",
      maxParticipants: 15,
      meetingId: "111222333",
      meetingLink: "https://zoom.us/j/111222333",
      meetingPassword: "beginner2024",
      scheduledDate: "2024-02-15",
      scheduledTime: "14:00",
      sessionDuration: 120,
      timezone: "Asia/Kolkata"
    }
  ];
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  
  // Create worksheet from data
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  
  // Set column widths for better readability
  const columnWidths = [
    { wch: 20 }, // id
    { wch: 25 }, // title
    { wch: 40 }, // description
    { wch: 12 }, // level
    { wch: 10 }, // price
    { wch: 8 },  // currency
    { wch: 10 }, // duration
    { wch: 20 }, // format
    { wch: 12 }, // certificate
    { wch: 10 }, // status
    { wch: 10 }, // featured
    { wch: 15 }, // slug
    { wch: 50 }, // curriculum_json
    { wch: 15 }, // isLiveSession
    { wch: 15 }, // maxParticipants
    { wch: 15 }, // meetingId
    { wch: 35 }, // meetingLink
    { wch: 15 }, // meetingPassword
    { wch: 12 }, // scheduledDate
    { wch: 10 }, // scheduledTime
    { wch: 15 }, // sessionDuration
    { wch: 15 }  // timezone
  ];
  
  worksheet['!cols'] = columnWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Workshops');
  
  // Create instructions sheet
  const instructionsData = [
    {
      field: "id",
      type: "string",
      required: "Yes",
      description: "Unique document ID (e.g., 'advanced-workshop')",
      example: "advanced-workshop"
    },
    {
      field: "title",
      type: "string",
      required: "Yes",
      description: "Workshop title",
      example: "Advanced AI Workshop"
    },
    {
      field: "description",
      type: "string",
      required: "Yes",
      description: "Workshop description",
      example: "Master advanced AI concepts..."
    },
    {
      field: "level",
      type: "string",
      required: "Yes",
      description: "Workshop level (beginner/foundation/advanced)",
      example: "advanced"
    },
    {
      field: "price",
      type: "number",
      required: "Yes",
      description: "Workshop price",
      example: "5999"
    },
    {
      field: "currency",
      type: "string",
      required: "No",
      description: "Currency code (default: INR)",
      example: "INR"
    },
    {
      field: "duration",
      type: "number",
      required: "Yes",
      description: "Workshop duration in hours",
      example: "16"
    },
    {
      field: "format",
      type: "string",
      required: "No",
      description: "Workshop format (default: Online)",
      example: "Online Interactive"
    },
    {
      field: "certificate",
      type: "boolean",
      required: "No",
      description: "Certificate provided (true/false)",
      example: "true"
    },
    {
      field: "status",
      type: "string",
      required: "No",
      description: "Workshop status (default: active)",
      example: "active"
    },
    {
      field: "featured",
      type: "boolean",
      required: "No",
      description: "Featured workshop (true/false)",
      example: "true"
    },
    {
      field: "slug",
      type: "string",
      required: "Yes",
      description: "URL slug for workshop",
      example: "advanced"
    },
    {
      field: "curriculum_json",
      type: "JSON string",
      required: "Yes",
      description: "Complete curriculum structure as JSON string",
      example: '{"modules":[...]}'
    },
    {
      field: "isLiveSession",
      type: "boolean",
      required: "No",
      description: "Live session available (true/false)",
      example: "false"
    },
    {
      field: "maxParticipants",
      type: "number",
      required: "No",
      description: "Maximum participants",
      example: "20"
    },
    {
      field: "meetingId",
      type: "string",
      required: "No",
      description: "Meeting ID for live sessions",
      example: "555666777"
    },
    {
      field: "meetingLink",
      type: "string",
      required: "No",
      description: "Meeting link for live sessions",
      example: "https://zoom.us/j/555666777"
    },
    {
      field: "meetingPassword",
      type: "string",
      required: "No",
      description: "Meeting password",
      example: "titliAI2024"
    },
    {
      field: "scheduledDate",
      type: "string",
      required: "No",
      description: "Scheduled date (YYYY-MM-DD)",
      example: "2024-01-30"
    },
    {
      field: "scheduledTime",
      type: "string",
      required: "No",
      description: "Scheduled time (HH:MM)",
      example: "16:00"
    },
    {
      field: "sessionDuration",
      type: "number",
      required: "No",
      description: "Session duration in minutes",
      example: "240"
    },
    {
      field: "timezone",
      type: "string",
      required: "No",
      description: "Timezone (default: Asia/Kolkata)",
      example: "Asia/Kolkata"
    }
  ];
  
  const instructionsWorksheet = XLSX.utils.json_to_sheet(instructionsData);
  instructionsWorksheet['!cols'] = [
    { wch: 20 }, // field
    { wch: 15 }, // type
    { wch: 10 }, // required
    { wch: 40 }, // description
    { wch: 30 }  // example
  ];
  
  XLSX.utils.book_append_sheet(workbook, instructionsWorksheet, 'Instructions');
  
  // Save the file
  const fileName = 'workshop-upload-template.xlsx';
  const filePath = path.join(__dirname, fileName);
  
  XLSX.writeFile(workbook, filePath);
  
  console.log('✅ Excel template created successfully!');
  console.log('📁 File saved as:', filePath);
  console.log('📋 Template includes:');
  console.log('   - Sample workshop data');
  console.log('   - Field instructions');
  console.log('   - Proper data types');
  console.log('   - JSON structure examples');
  
  return filePath;
}

// Create curriculum JSON helper
function createCurriculumJSON() {
  console.log('📚 Creating Curriculum JSON Structure Guide...');
  
  const curriculumExample = {
    modules: [
      {
        id: "module-1",
        title: "Module Title",
        description: "Module description",
        duration: 1.5,
        lessons: [
          {
            id: "lesson-1-1",
            title: "Lesson Title",
            description: "Lesson description",
            content: "Lesson content details",
            duration: 30,
            videoUrl: "https://example.com/video-url",
            resources: ["resource1.pdf", "resource2.pdf"]
          }
        ]
      }
    ]
  };
  
  const jsonFile = path.join(__dirname, 'curriculum-structure-example.json');
  fs.writeFileSync(jsonFile, JSON.stringify(curriculumExample, null, 2));
  
  console.log('✅ Curriculum JSON example created:', jsonFile);
  console.log('📝 Use this structure for the curriculum_json field');
  
  return jsonFile;
}

// Main function
function main() {
  console.log('🚀 Workshop Excel Template Generator');
  console.log('====================================\n');
  
  try {
    // Create Excel template
    const excelFile = createExcelTemplate();
    
    // Create curriculum JSON example
    const jsonFile = createCurriculumJSON();
    
    console.log('\n📋 Next Steps:');
    console.log('1. Open the Excel template:', excelFile);
    console.log('2. Review the Instructions sheet');
    console.log('3. Edit the Workshops sheet with your data');
    console.log('4. Use the curriculum JSON structure from:', jsonFile);
    console.log('5. Upload the Excel file using n8n or your upload script');
    
    console.log('\n⚠️  Important Notes:');
    console.log('- Keep the column headers exactly as shown');
    console.log('- Use "true"/"false" for boolean fields');
    console.log('- Ensure curriculum_json is valid JSON');
    console.log('- Test with one row before bulk upload');
    
  } catch (error) {
    console.error('❌ Error creating template:', error.message);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { createExcelTemplate, createCurriculumJSON }; 