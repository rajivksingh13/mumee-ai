# Firestore to Excel Structure Guide

Complete guide for understanding Firestore document structure and representing it in Excel for upload.

## **📊 Firestore Data Types vs Excel Representation**

### **1. Basic Data Types**

| **Firestore Type** | **Excel Column** | **Example** | **Notes** |
|-------------------|------------------|-------------|-----------|
| `string` | Text Column | `"Advanced AI Workshop"` | Regular text |
| `number` | Number Column | `5999` | Numeric values |
| `boolean` | Text Column | `"true"` or `"false"` | Will be converted to boolean |
| `timestamp` | Text Column | `"2024-01-30T16:00:00Z"` | ISO date format |
| `array` | **Special Format** | See below | JSON string or separate columns |
| `map` | **Special Format** | See below | JSON string or separate columns |

### **2. Complex Data Types**

#### **Array Fields**
**Firestore:** `["AI_Recap.pdf", "Technology_Review.pdf"]`
**Excel Options:**
- **Option A:** JSON String Column
  ```
  Column: resources
  Value: ["AI_Recap.pdf", "Technology_Review.pdf"]
  ```
- **Option B:** Comma-Separated
  ```
  Column: resources
  Value: AI_Recap.pdf, Technology_Review.pdf
  ```
- **Option C:** Multiple Columns
  ```
  Column: resources_1 | resources_2 | resources_3
  Value: AI_Recap.pdf | Technology_Review.pdf | (empty)
  ```

#### **Map Fields**
**Firestore:** `{ "name": "John", "age": 30 }`
**Excel Options:**
- **Option A:** JSON String Column
  ```
  Column: user_info
  Value: {"name": "John", "age": 30}
  ```
- **Option B:** Separate Columns
  ```
  Column: user_name | user_age
  Value: John | 30
  ```

## **🏗️ Your Workshop Document Structure**

Based on your Firestore document, here's the exact structure:

### **Document: `advanced-workshop`**

```javascript
{
  // Basic Fields
  "id": "advanced-workshop",
  "title": "Advanced AI Workshop",
  "description": "Master advanced AI concepts with our expert-level workshop.",
  "level": "advanced",
  "price": 5999,
  "currency": "INR",
  "duration": 16,
  "format": "Online Interactive",
  "certificate": true,
  "status": "active",
  "featured": true,
  "slug": "advanced",
  
  // Complex Fields
  "curriculum": {
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
  },
  
  // Meeting Info
  "isLiveSession": false,
  "maxParticipants": 20,
  "meetingId": "555666777",
  "meetingLink": "https://zoom.us/j/555666777",
  "meetingPassword": "titliAI2024",
  "scheduledDate": "2024-01-30",
  "scheduledTime": "16:00",
  "sessionDuration": 240,
  "timezone": "Asia/Kolkata",
  
  // Timestamps
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## **📋 Excel Structure Options**

### **Option 1: Flattened Structure (Recommended for Simple Data)**

| Column | Type | Example | Notes |
|--------|------|---------|-------|
| `id` | Text | `advanced-workshop` | Document ID |
| `title` | Text | `Advanced AI Workshop` | Workshop title |
| `description` | Text | `Master advanced AI concepts...` | Workshop description |
| `level` | Text | `advanced` | beginner/foundation/advanced |
| `price` | Number | `5999` | Price in currency |
| `currency` | Text | `INR` | Currency code |
| `duration` | Number | `16` | Duration in hours |
| `format` | Text | `Online Interactive` | Workshop format |
| `certificate` | Text | `true` | Boolean as text |
| `status` | Text | `active` | Workshop status |
| `featured` | Text | `true` | Boolean as text |
| `slug` | Text | `advanced` | URL slug |
| `curriculum_json` | Text | `{"modules":[...]}` | Full curriculum as JSON |
| `isLiveSession` | Text | `false` | Boolean as text |
| `maxParticipants` | Number | `20` | Max participants |
| `meetingId` | Text | `555666777` | Meeting ID |
| `meetingLink` | Text | `https://zoom.us/j/555666777` | Meeting link |
| `meetingPassword` | Text | `titliAI2024` | Meeting password |
| `scheduledDate` | Text | `2024-01-30` | Date as string |
| `scheduledTime` | Text | `16:00` | Time as string |
| `sessionDuration` | Number | `240` | Duration in minutes |
| `timezone` | Text | `Asia/Kolkata` | Timezone |

### **Option 2: Detailed Structure (For Complex Data)**

#### **Main Workshop Sheet:**
| Column | Type | Example |
|--------|------|---------|
| `id` | Text | `advanced-workshop` |
| `title` | Text | `Advanced AI Workshop` |
| `description` | Text | `Master advanced AI concepts...` |
| `level` | Text | `advanced` |
| `price` | Number | `5999` |
| `currency` | Text | `INR` |
| `duration` | Number | `16` |
| `format` | Text | `Online Interactive` |
| `certificate` | Text | `true` |
| `status` | Text | `active` |
| `featured` | Text | `true` |
| `slug` | Text | `advanced` |
| `isLiveSession` | Text | `false` |
| `maxParticipants` | Number | `20` |
| `meetingId` | Text | `555666777` |
| `meetingLink` | Text | `https://zoom.us/j/555666777` |
| `meetingPassword` | Text | `titliAI2024` |
| `scheduledDate` | Text | `2024-01-30` |
| `scheduledTime` | Text | `16:00` |
| `sessionDuration` | Number | `240` |
| `timezone` | Text | `Asia/Kolkata` |

#### **Modules Sheet:**
| Column | Type | Example |
|--------|------|---------|
| `workshop_id` | Text | `advanced-workshop` |
| `module_id` | Text | `module-1` |
| `module_title` | Text | `GenAI Fundamentals Refresher` |
| `module_description` | Text | `Review of core GenAI concepts` |
| `module_duration` | Number | `0.5` |

#### **Lessons Sheet:**
| Column | Type | Example |
|--------|------|---------|
| `workshop_id` | Text | `advanced-workshop` |
| `module_id` | Text | `module-1` |
| `lesson_id` | Text | `lesson-1-1` |
| `lesson_title` | Text | `AI, ML, Deep Learning, GenAI Recap` |
| `lesson_description` | Text | `Comprehensive AI technology review` |
| `lesson_content` | Text | `Review core AI concepts and their relationships` |
| `lesson_duration` | Number | `20` |
| `lesson_videoUrl` | Text | `https://example.com/video-1-1` |
| `lesson_resources` | Text | `AI_Recap.pdf, Technology_Review.pdf` |

## **📝 Excel Template Creation**

### **Step 1: Create Basic Template**

```javascript
// Create Excel template with proper structure
const templateData = [
  {
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
            }
          ]
        }
      ]
    }),
    isLiveSession: "false",
    maxParticipants: 20,
    meetingId: "555666777",
    meetingLink: "https://zoom.us/j/555666777",
    meetingPassword: "titliAI2024",
    scheduledDate: "2024-01-30",
    scheduledTime: "16:00",
    sessionDuration: 240,
    timezone: "Asia/Kolkata"
  }
];
```

### **Step 2: Excel Column Headers**

```
A1: id
B1: title
C1: description
D1: level
E1: price
F1: currency
G1: duration
H1: format
I1: certificate
J1: status
K1: featured
L1: slug
M1: curriculum_json
N1: isLiveSession
O1: maxParticipants
P1: meetingId
Q1: meetingLink
R1: meetingPassword
S1: scheduledDate
T1: scheduledTime
U1: sessionDuration
V1: timezone
```

## **🔄 Data Transformation Process**

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
    currency: excelRow.currency,
    duration: Number(excelRow.duration),
    format: excelRow.format,
    certificate: excelRow.certificate === 'true',
    status: excelRow.status,
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
    timezone: excelRow.timezone,
    
    // Timestamps
    createdAt: new Date(),
    updatedAt: new Date()
  };
}
```

### **Firestore to Excel Conversion**

```javascript
function firestoreToExcel(firestoreDoc) {
  return {
    id: firestoreDoc.id,
    title: firestoreDoc.title,
    description: firestoreDoc.description,
    level: firestoreDoc.level,
    price: firestoreDoc.price,
    currency: firestoreDoc.currency,
    duration: firestoreDoc.duration,
    format: firestoreDoc.format,
    certificate: firestoreDoc.certificate.toString(),
    status: firestoreDoc.status,
    featured: firestoreDoc.featured.toString(),
    slug: firestoreDoc.slug,
    curriculum_json: JSON.stringify(firestoreDoc.curriculum),
    isLiveSession: firestoreDoc.isLiveSession.toString(),
    maxParticipants: firestoreDoc.maxParticipants,
    meetingId: firestoreDoc.meetingId,
    meetingLink: firestoreDoc.meetingLink,
    meetingPassword: firestoreDoc.meetingPassword,
    scheduledDate: firestoreDoc.scheduledDate,
    scheduledTime: firestoreDoc.scheduledTime,
    sessionDuration: firestoreDoc.sessionDuration,
    timezone: firestoreDoc.timezone
  };
}
```

## **📊 Excel Template Examples**

### **Example 1: Single Row (Simple Structure)**

| id | title | description | level | price | currency | duration | format | certificate | status | featured | slug | curriculum_json | isLiveSession | maxParticipants | meetingId | meetingLink | meetingPassword | scheduledDate | scheduledTime | sessionDuration | timezone |
|----|-------|-------------|-------|-------|----------|----------|--------|-------------|--------|----------|------|----------------|---------------|-----------------|-----------|-------------|----------------|---------------|---------------|------------------|----------|
| advanced-workshop | Advanced AI Workshop | Master advanced AI concepts... | advanced | 5999 | INR | 16 | Online Interactive | true | active | true | advanced | {"modules":[...]} | false | 20 | 555666777 | https://zoom.us/j/555666777 | titliAI2024 | 2024-01-30 | 16:00 | 240 | Asia/Kolkata |

### **Example 2: Multiple Workshops**

| id | title | description | level | price | currency | duration | format | certificate | status | featured | slug | curriculum_json | isLiveSession | maxParticipants | meetingId | meetingLink | meetingPassword | scheduledDate | scheduledTime | sessionDuration | timezone |
|----|-------|-------------|-------|-------|----------|----------|--------|-------------|--------|----------|------|----------------|---------------|-----------------|-----------|-------------|----------------|---------------|---------------|------------------|----------|
| beginner-workshop | AI Fundamentals | Learn AI basics... | beginner | 2999 | INR | 8 | Online | true | active | true | beginner | {"modules":[...]} | false | 15 | 111222333 | https://zoom.us/j/111222333 | beginner2024 | 2024-02-15 | 14:00 | 120 | Asia/Kolkata |
| foundation-workshop | AI Foundation | Build AI foundation... | foundation | 3999 | INR | 12 | Online Interactive | true | active | true | foundation | {"modules":[...]} | false | 18 | 444555666 | https://zoom.us/j/444555666 | foundation2024 | 2024-02-20 | 15:00 | 180 | Asia/Kolkata |
| advanced-workshop | Advanced AI Workshop | Master advanced AI concepts... | advanced | 5999 | INR | 16 | Online Interactive | true | active | true | advanced | {"modules":[...]} | false | 20 | 555666777 | https://zoom.us/j/555666777 | titliAI2024 | 2024-01-30 | 16:00 | 240 | Asia/Kolkata |

## **🔧 n8n Processing Code**

### **Excel Processing Node**

```javascript
const XLSX = require('xlsx');

// Read Excel file
const workbook = XLSX.read($input.all()[0].json.data, {type: 'buffer'});
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

// Process each workshop row
const workshops = data.map(row => {
  // Convert Excel row to Firestore format
  const workshop = {
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
    
    // Parse complex JSON fields
    curriculum: row.curriculum_json ? JSON.parse(row.curriculum_json) : {},
    
    // Boolean fields
    isLiveSession: row.isLiveSession === 'true',
    
    // Numeric fields
    maxParticipants: Number(row.maxParticipants),
    sessionDuration: Number(row.sessionDuration),
    
    // String fields
    meetingId: row.meetingId,
    meetingLink: row.meetingLink,
    meetingPassword: row.meetingPassword,
    scheduledDate: row.scheduledDate,
    scheduledTime: row.scheduledTime,
    timezone: row.timezone || 'Asia/Kolkata',
    
    // Timestamps
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return workshop;
});

return workshops.map(workshop => ({json: workshop}));
```

## **✅ Validation Rules**

### **Required Fields**
- `id` - Must be unique
- `title` - Cannot be empty
- `description` - Cannot be empty
- `level` - Must be: `beginner`, `foundation`, or `advanced`
- `price` - Must be positive number
- `currency` - Must be valid currency code
- `duration` - Must be positive number
- `format` - Cannot be empty
- `status` - Must be: `active`, `inactive`, or `draft`

### **Data Type Validation**
```javascript
function validateWorkshop(workshop) {
  const errors = [];
  
  // Required fields
  const requiredFields = ['id', 'title', 'description', 'level', 'price'];
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
- Test with sample data

### **4. Error Handling**
- Log validation errors
- Provide clear error messages
- Handle missing data gracefully
- Retry failed uploads

This structure ensures your Excel data can be properly converted to Firestore documents with all the complex nested structures intact! 