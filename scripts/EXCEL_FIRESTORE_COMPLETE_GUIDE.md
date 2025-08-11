# Complete Excel to Firestore Upload Guide

Complete guide for understanding Firestore document structure and uploading data from Excel to Firestore.

## **📊 Understanding Firestore Document Structure**

### **Your Workshop Document Structure**

```javascript
{
  // Basic Fields (Simple Types)
  "id": "advanced-workshop",           // string
  "title": "Advanced AI Workshop",     // string
  "description": "Master advanced...", // string
  "level": "advanced",                 // string
  "price": 5999,                      // number
  "currency": "INR",                  // string
  "duration": 16,                     // number
  "format": "Online Interactive",      // string
  "certificate": true,                // boolean
  "status": "active",                 // string
  "featured": true,                   // boolean
  "slug": "advanced",                 // string
  
  // Complex Fields (Nested Structures)
  "curriculum": {                     // map (object)
    "modules": [                      // array
      {
        "id": "module-1",             // string
        "title": "GenAI Fundamentals", // string
        "description": "Review...",   // string
        "duration": 0.5,             // number
        "lessons": [                  // array
          {
            "id": "lesson-1-1",       // string
            "title": "AI Recap",      // string
            "description": "Review...", // string
            "content": "Review core...", // string
            "duration": 20,           // number
            "videoUrl": "https://...", // string
            "resources": [             // array
              "AI_Recap.pdf",         // string
              "Technology_Review.pdf" // string
            ]
          }
        ]
      }
    ]
  },
  
  // Meeting Information
  "isLiveSession": false,             // boolean
  "maxParticipants": 20,              // number
  "meetingId": "555666777",          // string
  "meetingLink": "https://zoom.us/...", // string
  "meetingPassword": "titliAI2024",  // string
  "scheduledDate": "2024-01-30",     // string
  "scheduledTime": "16:00",          // string
  "sessionDuration": 240,            // number
  "timezone": "Asia/Kolkata",        // string
  
  // Timestamps
  "createdAt": "timestamp",          // timestamp
  "updatedAt": "timestamp"           // timestamp
}
```

## **📋 Excel Structure for Upload**

### **Excel Column Structure**

| Column | Firestore Type | Excel Type | Example | Required |
|--------|----------------|------------|---------|----------|
| `id` | string | Text | `advanced-workshop` | ✅ Yes |
| `title` | string | Text | `Advanced AI Workshop` | ✅ Yes |
| `description` | string | Text | `Master advanced AI concepts...` | ✅ Yes |
| `level` | string | Text | `advanced` | ✅ Yes |
| `price` | number | Number | `5999` | ✅ Yes |
| `currency` | string | Text | `INR` | ❌ No |
| `duration` | number | Number | `16` | ✅ Yes |
| `format` | string | Text | `Online Interactive` | ❌ No |
| `certificate` | boolean | Text | `true` | ❌ No |
| `status` | string | Text | `active` | ❌ No |
| `featured` | boolean | Text | `true` | ❌ No |
| `slug` | string | Text | `advanced` | ✅ Yes |
| `curriculum_json` | map | Text | `{"modules":[...]}` | ✅ Yes |
| `isLiveSession` | boolean | Text | `false` | ❌ No |
| `maxParticipants` | number | Number | `20` | ❌ No |
| `meetingId` | string | Text | `555666777` | ❌ No |
| `meetingLink` | string | Text | `https://zoom.us/j/555666777` | ❌ No |
| `meetingPassword` | string | Text | `titliAI2024` | ❌ No |
| `scheduledDate` | string | Text | `2024-01-30` | ❌ No |
| `scheduledTime` | string | Text | `16:00` | ❌ No |
| `sessionDuration` | number | Number | `240` | ❌ No |
| `timezone` | string | Text | `Asia/Kolkata` | ❌ No |

### **Complex Data Types in Excel**

#### **1. Boolean Fields**
- **Excel:** Use `"true"` or `"false"` (as text)
- **Firestore:** Will be converted to `true` or `false`

#### **2. Array Fields**
- **Excel:** Store as JSON string
- **Example:** `["AI_Recap.pdf", "Technology_Review.pdf"]`

#### **3. Map/Object Fields**
- **Excel:** Store as JSON string
- **Example:** `{"modules": [{"id": "module-1", "title": "..."}]}`

#### **4. Nested Structures**
- **Excel:** Store entire structure as JSON string
- **Example:** Complete curriculum with modules and lessons

## **🛠️ Tools and Scripts**

### **1. Excel Template Generator**
```bash
cd mumee-ai/scripts
npm run create-template
```

**Creates:**
- `workshop-upload-template.xlsx` - Ready-to-use Excel template
- `curriculum-structure-example.json` - JSON structure guide

### **2. Firestore Export Tool**
```bash
npm run export-workshops
```

**Exports:**
- Current Firestore data to Excel for reference

### **3. Upload Script**
```bash
npm run upload
```

**Uploads:**
- Excel data to Firestore

## **📝 Step-by-Step Process**

### **Step 1: Generate Excel Template**
```bash
cd mumee-ai/scripts
npm run create-template
```

### **Step 2: Edit Excel File**
1. Open `workshop-upload-template.xlsx`
2. Review the "Instructions" sheet
3. Edit the "Workshops" sheet with your data
4. Ensure `curriculum_json` contains valid JSON

### **Step 3: Validate Data**
- Check required fields are filled
- Verify data types are correct
- Ensure JSON is valid
- Test with one row first

### **Step 4: Upload to Firestore**
```bash
npm run upload
```

## **🔧 Data Transformation Process**

### **Excel to Firestore Conversion**

```javascript
function excelToFirestore(excelRow) {
  return {
    // Basic fields (direct mapping)
    id: excelRow.id,
    title: excelRow.title,
    description: excelRow.description,
    level: excelRow.level,
    price: Number(excelRow.price),
    currency: excelRow.currency || 'INR',
    duration: Number(excelRow.duration),
    format: excelRow.format || 'Online',
    certificate: excelRow.certificate === 'true',
    status: excelRow.status || 'active',
    featured: excelRow.featured === 'true',
    slug: excelRow.slug,
    
    // Complex fields (JSON parsing)
    curriculum: excelRow.curriculum_json ? JSON.parse(excelRow.curriculum_json) : {},
    
    // Boolean fields
    isLiveSession: excelRow.isLiveSession === 'true',
    
    // Numeric fields
    maxParticipants: Number(excelRow.maxParticipants),
    sessionDuration: Number(excelRow.sessionDuration),
    
    // String fields
    meetingId: excelRow.meetingId,
    meetingLink: excelRow.meetingLink,
    meetingPassword: excelRow.meetingPassword,
    scheduledDate: excelRow.scheduledDate,
    scheduledTime: excelRow.scheduledTime,
    timezone: excelRow.timezone || 'Asia/Kolkata',
    
    // Timestamps
    createdAt: new Date(),
    updatedAt: new Date()
  };
}
```

## **📊 Excel Template Examples**

### **Example 1: Single Workshop Row**

| id | title | description | level | price | currency | duration | format | certificate | status | featured | slug | curriculum_json | isLiveSession | maxParticipants | meetingId | meetingLink | meetingPassword | scheduledDate | scheduledTime | sessionDuration | timezone |
|----|-------|-------------|-------|-------|----------|----------|--------|-------------|--------|----------|------|----------------|---------------|-----------------|-----------|-------------|----------------|---------------|---------------|------------------|----------|
| advanced-workshop | Advanced AI Workshop | Master advanced AI concepts... | advanced | 5999 | INR | 16 | Online Interactive | true | active | true | advanced | {"modules":[...]} | false | 20 | 555666777 | https://zoom.us/j/555666777 | titliAI2024 | 2024-01-30 | 16:00 | 240 | Asia/Kolkata |

### **Example 2: Curriculum JSON Structure**

```json
{
  "modules": [
    {
      "id": "module-1",
      "title": "GenAI Fundamentals Refresher",
      "description": "Review of core GenAI concepts",
      "duration": 0.5,
      "lessons": [
        {
          "id": "lesson-1-1",
          "title": "AI, ML, Deep Learning, GenAI Recap",
          "description": "Comprehensive AI technology review",
          "content": "Review core AI concepts and their relationships",
          "duration": 20,
          "videoUrl": "https://example.com/video-1-1",
          "resources": ["AI_Recap.pdf", "Technology_Review.pdf"]
        }
      ]
    }
  ]
}
```

## **✅ Validation Rules**

### **Required Fields**
- `id` - Must be unique, no spaces
- `title` - Cannot be empty
- `description` - Cannot be empty
- `level` - Must be: `beginner`, `foundation`, or `advanced`
- `price` - Must be positive number
- `duration` - Must be positive number
- `slug` - Must be unique, URL-friendly

### **Data Type Validation**
```javascript
function validateWorkshop(workshop) {
  const errors = [];
  
  // Required fields
  const requiredFields = ['id', 'title', 'description', 'level', 'price', 'duration', 'slug'];
  requiredFields.forEach(field => {
    if (!workshop[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Level validation
  if (workshop.level && !['beginner', 'foundation', 'advanced'].includes(workshop.level)) {
    errors.push('Invalid level. Must be: beginner, foundation, or advanced');
  }
  
  // Price validation
  if (workshop.price && (isNaN(workshop.price) || workshop.price < 0)) {
    errors.push('Invalid price. Must be a positive number');
  }
  
  // Curriculum validation
  if (workshop.curriculum && typeof workshop.curriculum !== 'object') {
    errors.push('Invalid curriculum format');
  }
  
  return errors;
}
```

## **🚀 n8n Integration**

### **n8n Workflow for Excel Upload**

1. **File Trigger** - Monitor Excel file changes
2. **Read Binary Files** - Read Excel content
3. **Code Node** - Process and validate data
4. **HTTP Request** - Upload to Firebase
5. **Send Email** - Notify completion

### **n8n Processing Code**
```javascript
const XLSX = require('xlsx');

// Read Excel file
const workbook = XLSX.read($input.all()[0].json.data, {type: 'buffer'});
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

// Process each workshop row
const workshops = data.map(row => {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    level: row.level,
    price: Number(row.price),
    currency: row.currency || 'INR',
    duration: Number(row.duration),
    format: row.format || 'Online',
    certificate: row.certificate === 'true',
    status: row.status || 'active',
    featured: row.featured === 'true',
    slug: row.slug,
    curriculum: row.curriculum_json ? JSON.parse(row.curriculum_json) : {},
    isLiveSession: row.isLiveSession === 'true',
    maxParticipants: Number(row.maxParticipants),
    meetingId: row.meetingId,
    meetingLink: row.meetingLink,
    meetingPassword: row.meetingPassword,
    scheduledDate: row.scheduledDate,
    scheduledTime: row.scheduledTime,
    sessionDuration: Number(row.sessionDuration),
    timezone: row.timezone || 'Asia/Kolkata',
    createdAt: new Date(),
    updatedAt: new Date()
  };
});

return workshops.map(workshop => ({json: workshop}));
```

## **📋 Best Practices**

### **1. Excel Structure**
- Use consistent column names
- Include all required fields
- Use proper data types in Excel
- Validate data before upload

### **2. Complex Data**
- Store JSON strings for complex objects
- Use consistent formatting
- Validate JSON structure
- Handle nested arrays properly

### **3. Data Validation**
- Check required fields
- Validate data types
- Ensure business rules
- Test with small datasets first

### **4. Error Handling**
- Log validation errors
- Provide clear error messages
- Handle missing data gracefully
- Retry failed uploads

## **🔧 Troubleshooting**

### **Common Issues**

1. **"Invalid JSON format"**
   - Check `curriculum_json` field
   - Validate JSON syntax
   - Use JSON validator

2. **"Missing required field"**
   - Check all required fields are filled
   - Verify field names match exactly

3. **"Invalid data type"**
   - Ensure numbers are numbers (not strings)
   - Check booleans are "true"/"false"
   - Verify timestamps are in correct format

4. **"Permission denied"**
   - Check Firebase service account permissions
   - Verify project ID is correct
   - Ensure service account key is valid

## **📚 Additional Resources**

- **Firestore Data Types:** https://firebase.google.com/docs/firestore/manage-data/data-types
- **n8n Documentation:** https://docs.n8n.io/
- **Excel JSON Processing:** https://github.com/SheetJS/sheetjs

This complete guide ensures your Excel data can be properly converted to Firestore documents with all complex nested structures intact! 