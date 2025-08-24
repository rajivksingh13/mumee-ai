# Workshop Excel Upload Guide

## 🎯 **Overview**

This guide explains how to upload new workshop documents to the Firestore database using Excel files. The system supports both simple and complex workshop structures, maintaining the same field structure as existing workshops.

## 📊 **Current Workshop Structure Analysis**

### **Existing Workshops:**
1. **advanced-workshop** - Complex structure with curriculum modules
2. **beginner-workshop** - Basic structure  
3. **foundation-workshop** - Basic structure

### **Workshop Document Structure:**
```javascript
{
  // Basic Fields
  id: string,                    // Document ID (e.g., "new-workshop-1")
  title: string,                 // Workshop title
  description: string,           // Workshop description
  overview: string,              // Brief overview
  level: string,                 // beginner/foundation/advanced
  price: number,                 // Price in currency
  currency: string,              // INR (default)
  duration: number,              // Hours
  format: string,                // Online Interactive (default)
  certificate: boolean,          // true/false
  status: string,                // active/inactive/draft
  featured: boolean,             // true/false
  slug: string,                  // URL slug
  
  // Complex Curriculum Structure
  curriculum: {
    modules: [
      {
        id: string,
        title: string,
        description: string,
        duration: number,
        lessons: [
          {
            id: string,
            title: string,
            description: string,
            content: string,
            duration: number,
            videoUrl: string,
            resources: string[]
          }
        ]
      }
    ]
  },
  
  // Live Session Fields
  isLiveSession: boolean,
  maxParticipants: number,
  meetingId: string,
  meetingLink: string,
  meetingPassword: string,
  scheduledDate: string,
  scheduledTime: string,
  sessionDuration: number,
  timezone: string,
  
  // Timestamps
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🚀 **Quick Start**

### **Step 1: Create Excel Template**
```bash
cd mumee-ai/scripts
node workshop-excel-upload.js --template
```

This creates `workshop-upload-template.xlsx` with the correct structure.

### **Step 2: Fill Excel Template**
1. Open the template in Excel
2. Fill in your workshop data
3. Save the file

### **Step 3: Upload to Firestore**
```bash
node workshop-excel-upload.js --file your-workshop-file.xlsx
```

## 📋 **Excel Column Structure**

### **Required Fields (Must be filled):**
| Column | Type | Example | Description |
|--------|------|---------|-------------|
| `id` | Text | `new-workshop-1` | Unique document ID |
| `title` | Text | `New AI Workshop` | Workshop title |
| `description` | Text | `Learn AI fundamentals...` | Workshop description |
| `level` | Text | `beginner` | beginner/foundation/advanced |
| `price` | Number | `2999` | Price in currency |
| `duration` | Number | `20` | Duration in hours |
| `slug` | Text | `new-workshop-1` | URL slug |

### **Optional Basic Fields:**
| Column | Type | Example | Default |
|--------|------|---------|---------|
| `overview` | Text | `Brief overview...` | Empty |
| `currency` | Text | `INR` | `INR` |
| `format` | Text | `Online Interactive` | `Online Interactive` |
| `certificate` | Text | `true` | `true` |
| `status` | Text | `active` | `active` |
| `featured` | Text | `false` | `false` |

### **Live Session Fields:**
| Column | Type | Example | Default |
|--------|------|---------|---------|
| `isLiveSession` | Text | `false` | `false` |
| `maxParticipants` | Number | `20` | Empty |
| `meetingId` | Text | `123456789` | Empty |
| `meetingLink` | Text | `https://zoom.us/j/123` | Empty |
| `meetingPassword` | Text | `password123` | Empty |
| `scheduledDate` | Text | `2024-01-30` | Empty |
| `scheduledTime` | Text | `16:00` | Empty |
| `sessionDuration` | Number | `120` | Empty |
| `timezone` | Text | `Asia/Kolkata` | `Asia/Kolkata` |

### **Complex Fields:**
| Column | Type | Example | Description |
|--------|------|---------|-------------|
| `curriculum_json` | Text | `{"modules":[...]}` | JSON string for curriculum |

## 📚 **Curriculum JSON Structure**

### **Simple Curriculum Example:**
```json
{
  "modules": [
    {
      "id": "module-1",
      "title": "Introduction to AI",
      "description": "Learn AI fundamentals",
      "duration": 1,
      "lessons": [
        {
          "id": "lesson-1-1",
          "title": "What is AI?",
          "description": "Understanding AI basics",
          "content": "AI is a branch of computer science...",
          "duration": 30,
          "videoUrl": "https://example.com/video-1",
          "resources": ["ai-basics.pdf", "intro-slides.pdf"]
        }
      ]
    }
  ]
}
```

### **Complex Curriculum Example:**
```json
{
  "modules": [
    {
      "id": "module-1",
      "title": "AI Fundamentals",
      "description": "Core AI concepts",
      "duration": 2,
      "lessons": [
        {
          "id": "lesson-1-1",
          "title": "Introduction to AI",
          "description": "AI basics and history",
          "content": "Artificial Intelligence is...",
          "duration": 45,
          "videoUrl": "https://youtube.com/watch?v=abc123",
          "resources": ["ai-history.pdf", "timeline.pdf"]
        },
        {
          "id": "lesson-1-2",
          "title": "Machine Learning Basics",
          "description": "Understanding ML",
          "content": "Machine Learning is a subset...",
          "duration": 60,
          "videoUrl": "https://youtube.com/watch?v=def456",
          "resources": ["ml-basics.pdf", "algorithms.pdf"]
        }
      ]
    },
    {
      "id": "module-2",
      "title": "Practical Applications",
      "description": "Real-world AI applications",
      "duration": 3,
      "lessons": [
        {
          "id": "lesson-2-1",
          "title": "AI in Healthcare",
          "description": "Medical AI applications",
          "content": "AI is revolutionizing healthcare...",
          "duration": 50,
          "videoUrl": "https://youtube.com/watch?v=ghi789",
          "resources": ["healthcare-ai.pdf", "case-studies.pdf"]
        }
      ]
    }
  ]
}
```

## 🔧 **Usage Examples**

### **1. Create Template**
```bash
node workshop-excel-upload.js --template
```

### **2. List Existing Workshops**
```bash
node workshop-excel-upload.js --list
```

### **3. Upload Single Workshop**
```bash
node workshop-excel-upload.js --file single-workshop.xlsx
```

### **4. Upload Multiple Workshops**
```bash
node workshop-excel-upload.js --file multiple-workshops.xlsx
```

### **5. Get Help**
```bash
node workshop-excel-upload.js --help
```

## ✅ **Validation Rules**

### **Required Field Validation:**
- All required fields must be filled
- `id` must be unique
- `title` cannot be empty
- `description` cannot be empty

### **Data Type Validation:**
- `level` must be: `beginner`, `foundation`, or `advanced`
- `status` must be: `active`, `inactive`, or `draft`
- `currency` must be: `INR`, `USD`, or `EUR`
- `format` must be: `Online Interactive`, `Online Self-Paced`, `In-Person`, or `Hybrid`
- `price` must be a positive number
- `duration` must be a positive number

### **JSON Validation:**
- `curriculum_json` must be valid JSON
- JSON structure must match the expected format

## 🛠 **Advanced Features**

### **Batch Upload:**
You can upload multiple workshops in a single Excel file. Each row represents one workshop.

### **Error Handling:**
- Detailed validation errors for each workshop
- Continues processing even if some workshops fail
- Summary report of successes and failures

### **Data Type Conversion:**
- Automatically converts Excel data types to Firestore types
- Handles boolean conversions (`true`/`false` strings)
- Parses JSON strings for complex fields
- Sets default values for optional fields

## 📝 **Best Practices**

### **1. Use the Template**
Always start with the generated template to ensure correct structure.

### **2. Validate JSON**
Use online JSON validators to check your `curriculum_json` before uploading.

### **3. Test with One Workshop**
Upload a single workshop first to verify everything works correctly.

### **4. Backup Existing Data**
Export existing workshops before bulk uploads:
```bash
node export-firestore-to-excel.js
```

### **5. Check for Duplicates**
Ensure workshop IDs are unique to avoid overwriting existing data.

## 🚨 **Common Issues & Solutions**

### **Issue: "Missing required field"**
**Solution:** Fill in all required fields (id, title, description, level, price, duration, slug)

### **Issue: "Invalid JSON in curriculum_json"**
**Solution:** Validate your JSON using an online JSON validator

### **Issue: "Invalid level"**
**Solution:** Use only: `beginner`, `foundation`, or `advanced`

### **Issue: "File not found"**
**Solution:** Check the file path and ensure the Excel file exists

### **Issue: "No data found in Excel file"**
**Solution:** Ensure the Excel file has data in the first worksheet

## 📊 **Example Excel File Structure**

| id | title | description | level | price | duration | slug | curriculum_json |
|----|-------|-------------|-------|-------|----------|------|-----------------|
| new-workshop-1 | New AI Workshop | Learn AI fundamentals | beginner | 2999 | 20 | new-workshop-1 | {"modules":[...]} |
| advanced-ml | Advanced ML | Master machine learning | advanced | 5999 | 30 | advanced-ml | {"modules":[...]} |

## 🎉 **Success Indicators**

When upload is successful, you'll see:
```
✅ Successfully uploaded: New AI Workshop (ID: new-workshop-1)
✅ Successfully uploaded: Advanced ML (ID: advanced-ml)

🎉 Upload completed!
✅ Success: 2
❌ Errors: 0
```

## 🔗 **Related Files**

- `scripts/workshop-excel-upload.js` - Main upload script
- `scripts/export-firestore-to-excel.js` - Export existing data
- `scripts/upload-advanced-workshop.js` - Example workshop structure
- `firebase-service-account.json` - Firebase credentials (required)

## 📞 **Support**

If you encounter issues:
1. Check the validation errors in the console output
2. Verify your Excel file structure matches the template
3. Ensure all required fields are filled
4. Validate JSON format for complex fields
