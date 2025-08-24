# 📊 Excel Workshop Template & Upload Guide

## 🎯 **Overview**

This guide explains how to use the new Excel template for creating and updating workshop documents in the TitliAI Firestore database. The system supports both creating new workshops and updating existing ones with a comprehensive structure based on your current workshop documents.

## 📋 **Template Features**

### **✅ What You Can Do:**
- **Create New Workshops** - Add completely new workshop documents
- **Update Existing Workshops** - Modify existing workshop data (advanced-workshop, beginner-workshop, foundation-workshop)
- **Complete Structure** - All fields from your existing workshop documents
- **Complex Curriculum** - Full module and lesson structure with JSON format
- **Live Session Support** - Meeting details, scheduling, and participant limits
- **SEO Metadata** - Meta titles, descriptions, and keywords for better search visibility

## 📊 **Excel Template Structure**

### **Basic Information Fields:**
| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `id` | Text | `advanced-workshop` | Unique document ID (use existing IDs to update) |
| `title` | Text | `Advanced AI Workshop` | Workshop title |
| `description` | Text | `Master advanced AI concepts...` | Detailed workshop description |
| `overview` | Text | `Brief overview of the workshop` | Short overview |
| `level` | Text | `advanced` | beginner/foundation/advanced |
| `price` | Number | `5999` | Price in currency |
| `currency` | Text | `INR` | Currency code |
| `duration` | Number | `16` | Duration in hours |
| `format` | Text | `Online Interactive` | Workshop format |
| `certificate` | Text | `true` | true/false |
| `status` | Text | `active` | active/inactive/draft |
| `featured` | Text | `true` | true/false |
| `slug` | Text | `advanced` | URL-friendly slug |

### **Live Session Fields:**
| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `isLiveSession` | Text | `false` | true/false |
| `maxParticipants` | Number | `20` | Maximum participants |
| `meetingId` | Text | `555666777` | Meeting ID |
| `meetingLink` | Text | `https://zoom.us/j/555666777` | Meeting link |
| `meetingPassword` | Text | `titliAI2024` | Meeting password |
| `scheduledDate` | Text | `2024-01-30` | Scheduled date (YYYY-MM-DD) |
| `scheduledTime` | Text | `16:00` | Scheduled time (HH:MM) |
| `sessionDuration` | Number | `240` | Duration in minutes |
| `timezone` | Text | `Asia/Kolkata` | Timezone |

### **SEO & Metadata Fields:**
| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `metaTitle` | Text | `Advanced AI Workshop - Expert Training` | SEO title |
| `metaDescription` | Text | `Master advanced AI techniques...` | SEO description |
| `keywords` | Text | `AI, machine learning, advanced` | Comma-separated keywords |
| `thumbnail` | Text | `https://example.com/thumb.jpg` | Thumbnail image URL |
| `banner` | Text | `https://example.com/banner.jpg` | Banner image URL |
| `videoPreview` | Text | `https://example.com/preview.mp4` | Preview video URL |

### **Complex Curriculum Structure:**
The `curriculum` field contains a JSON structure with modules and lessons:

```json
{
  "overview": "Comprehensive curriculum covering all essential AI topics",
  "modules": [
    {
      "id": "module-1",
      "title": "Introduction to AI",
      "description": "Learn the fundamentals of artificial intelligence",
      "duration": 2,
      "lessons": [
        {
          "id": "lesson-1-1",
          "title": "What is AI?",
          "description": "Understanding artificial intelligence basics",
          "duration": 30,
          "content": "Detailed lesson content explaining AI concepts",
          "videoUrl": "https://example.com/video-1-1",
          "resources": ["AI_Basics.pdf", "Introduction_Guide.pdf"]
        }
      ]
    }
  ]
}
```

## 🚀 **How to Use the Template**

### **Step 1: Download Template**
1. Go to the **Upload Workshop** tab in the admin panel
2. Click **"📥 Download Template"** button
3. Save the Excel file to your computer

### **Step 2: Fill in Workshop Data**
1. **For New Workshops:**
   - Use a new unique ID (e.g., `new-workshop-1`)
   - Fill in all required fields
   - Use the curriculum JSON structure from the template

2. **For Updating Existing Workshops:**
   - Use the existing ID (e.g., `advanced-workshop`, `beginner-workshop`, `foundation-workshop`)
   - Modify the fields you want to update
   - Keep the existing `createdAt` timestamp

### **Step 3: Upload to Database**
1. Select your filled Excel file
2. Click **"📤 Upload Workshop"** button
3. Monitor the progress bar
4. Review results in the "Recent Uploads" section

## 📝 **Example Use Cases**

### **Creating a New Workshop:**
```excel
id: new-ai-workshop
title: New AI Workshop
description: Learn AI fundamentals with hands-on projects
level: beginner
price: 1999
currency: INR
duration: 12
format: Online Interactive
certificate: true
status: active
featured: false
slug: new-ai-workshop
```

### **Updating Existing Workshop:**
```excel
id: advanced-workshop
title: Advanced AI Workshop (Updated)
description: Updated description with new content
price: 6999
duration: 18
featured: true
```

## ✅ **Success Messages**

After successful upload, you'll see:
- **"✅ Successfully processed X workshops!"**
- Detailed breakdown of processed vs. total rows
- Error details if any issues occurred
- Confirmation that documents are saved to Firestore

## 🔄 **Database Operations**

### **New Workshops:**
- Creates new document with `createdAt` and `updatedAt` timestamps
- Generates unique ID if not provided
- Validates all required fields

### **Existing Workshops:**
- Updates existing document with new data
- Preserves original `createdAt` timestamp
- Updates `updatedAt` timestamp
- Maintains all existing data not included in the update

## 🛠️ **Validation Rules**

### **Required Fields:**
- `title` - Cannot be empty
- `description` - Cannot be empty
- `price` - Must be positive number
- `duration` - Must be positive number
- `level` - Must be: beginner, foundation, or advanced
- `slug` - Must be unique and URL-friendly

### **Data Type Validation:**
- Numbers are automatically converted from strings
- Booleans are converted from "true"/"false" strings
- JSON curriculum is validated for proper format
- Keywords are converted to arrays

## 🎯 **Best Practices**

1. **Always download the latest template** before creating new workshops
2. **Use existing IDs** when updating workshops to avoid duplicates
3. **Test with small data** before uploading large files
4. **Backup your data** before making major updates
5. **Review the curriculum JSON** structure carefully
6. **Check the Workshops tab** after upload to verify changes

## 🔍 **Troubleshooting**

### **Common Issues:**
- **"Invalid curriculum JSON format"** - Check the JSON structure in the curriculum field
- **"Missing required field"** - Ensure all required fields are filled
- **"Workshop already exists"** - Use existing ID for updates, new ID for creation

### **Getting Help:**
- Check the browser console for detailed error messages
- Review the "Recent Uploads" section for error details
- Ensure Excel file is saved as .xlsx format
- Verify all required fields are properly filled

## 📊 **Template Examples**

The template includes two example rows:
1. **New Workshop Example** - Shows how to create a new workshop
2. **Update Example** - Shows how to update the existing advanced-workshop

Use these as references when creating your own workshop data.

---

**🎉 You're now ready to create and update workshops using the Excel template!**
