# Admin Workshop Upload Guide

## 🎯 **Overview**

The Admin Workshop Upload feature allows administrators to upload new workshop documents to the Firestore database directly from the admin interface using Excel files. This provides a user-friendly way to add workshops without needing to write code or use command-line tools.

## 🚀 **Features**

### **✅ What's Included:**
- **📤 Excel File Upload** - Upload .xlsx and .xls files
- **📋 Template Download** - Get Excel template with correct structure
- **✅ Data Validation** - Comprehensive validation of workshop data
- **🔄 Progress Tracking** - Real-time upload progress and status
- **📊 Error Reporting** - Detailed error messages for failed uploads
- **🔄 Auto Refresh** - Automatically refreshes workshop data after upload
- **📝 Recent Uploads** - Track and view recent upload results

## 🛠 **Setup Instructions**

### **1. Install Server Dependencies**
```bash
cd mumee-ai/server
npm install multer xlsx firebase-admin @types/multer
```

### **2. Start the Server**
```bash
cd mumee-ai/server
npm run dev
```

### **3. Access Admin Interface**
1. Open `admin.html` in your browser
2. Enter admin password
3. Navigate to "📤 Upload Workshop" tab

## 📋 **Excel File Structure**

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

### **Optional Fields:**
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

### **Simple Example:**
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

## 🔧 **Usage Instructions**

### **Step 1: Get Excel Template**
1. Go to "📤 Upload Workshop" tab in admin interface
2. Click "📥 Download Template" button
3. Open the downloaded CSV file in Excel
4. Save as .xlsx format

### **Step 2: Fill Workshop Data**
1. Fill in all required fields
2. Add optional fields as needed
3. For curriculum, use JSON format in `curriculum_json` column
4. Save the Excel file

### **Step 3: Upload to Firestore**
1. Click "Choose File" and select your Excel file
2. Click "📤 Upload Workshop" button
3. Wait for validation and upload process
4. Check results in the status area

## ✅ **Validation Rules**

### **Field Validation:**
- All required fields must be filled
- `level` must be: beginner, foundation, or advanced
- `status` must be: active, inactive, or draft
- `currency` must be: INR, USD, or EUR
- `format` must be: Online Interactive, Online Self-Paced, In-Person, or Hybrid
- `price` must be a positive number
- `duration` must be a positive number

### **JSON Validation:**
- `curriculum_json` must be valid JSON
- JSON structure must match expected format

### **Duplicate Prevention:**
- Workshop IDs must be unique
- Existing workshops with same ID will be skipped

## 🎯 **Example Excel File**

| id | title | description | level | price | duration | slug | curriculum_json |
|----|-------|-------------|-------|-------|----------|------|-----------------|
| new-workshop-1 | New AI Workshop | Learn AI fundamentals | beginner | 2999 | 20 | new-workshop-1 | {"modules":[...]} |
| advanced-ml | Advanced ML | Master machine learning | advanced | 5999 | 30 | advanced-ml | {"modules":[...]} |

## 🚨 **Common Issues & Solutions**

### **Issue: "No file uploaded"**
**Solution:** Make sure you've selected an Excel file before clicking upload

### **Issue: "Invalid file type"**
**Solution:** Use only .xlsx or .xls files

### **Issue: "Missing required field"**
**Solution:** Fill in all required fields (id, title, description, level, price, duration, slug)

### **Issue: "Invalid JSON in curriculum_json"**
**Solution:** Use a JSON validator to check your curriculum JSON format

### **Issue: "Workshop with ID already exists"**
**Solution:** Use a unique ID for each workshop

### **Issue: "Server error"**
**Solution:** Check if the server is running on port 3000

## 📊 **Upload Results**

### **Success Indicators:**
- ✅ Progress bar reaches 100%
- ✅ Success message with upload count
- ✅ Recent uploads section updated
- ✅ Workshop data refreshed automatically

### **Error Handling:**
- ❌ Detailed error messages for each failed workshop
- ❌ Continues processing other workshops if some fail
- ❌ Shows error count and success count
- ❌ Expandable error details for troubleshooting

## 🔧 **Technical Implementation**

### **Frontend (admin.html):**
- File upload interface with drag-and-drop support
- Progress tracking with visual feedback
- Real-time status updates
- Error reporting and display

### **Backend (server/routes/workshop-upload.ts):**
- File upload handling with multer
- Excel file parsing with xlsx library
- Data validation and type conversion
- Firestore integration with Firebase Admin SDK

### **API Endpoints:**
- `POST /api/upload-workshop` - Upload Excel file
- `GET /api/workshop-template` - Download Excel template

## 🧪 **Testing**

### **Test Script:**
```bash
node test-workshop-upload-admin.js
```

### **Manual Testing:**
1. Start server: `cd server && npm run dev`
2. Open admin.html in browser
3. Go to "Upload Workshop" tab
4. Download template and fill with test data
5. Upload and verify in Firestore

## 📞 **Support**

### **Getting Help:**
1. Check browser console for error messages
2. Verify Excel file structure matches template
3. Ensure all required fields are filled
4. Validate JSON format for curriculum
5. Check server logs for backend errors

### **Troubleshooting:**
- **File not uploading:** Check file size (max 10MB) and format
- **Validation errors:** Review error messages and fix data
- **Server errors:** Check server logs and Firebase configuration
- **Firestore errors:** Verify Firebase Admin SDK setup

## 🎉 **Benefits**

### **For Admins:**
- ✅ **User-Friendly** - No coding required
- ✅ **Visual Interface** - Easy to use admin panel
- ✅ **Template Support** - Pre-built Excel templates
- ✅ **Error Handling** - Clear feedback on issues
- ✅ **Batch Upload** - Upload multiple workshops at once

### **For Developers:**
- ✅ **Maintainable** - Well-structured code
- ✅ **Extensible** - Easy to add new fields
- ✅ **Secure** - File validation and sanitization
- ✅ **Robust** - Comprehensive error handling
- ✅ **Documented** - Clear code comments and guides

## 🔗 **Related Files**

- `admin.html` - Admin interface with upload functionality
- `server/routes/workshop-upload.ts` - Backend upload handling
- `server/firebase-admin.ts` - Firebase Admin SDK initialization
- `test-workshop-upload-admin.js` - Test script for upload functionality
- `WORKSHOP_EXCEL_UPLOAD_GUIDE.md` - Command-line upload guide
- `scripts/workshop-excel-upload.js` - Command-line upload script
