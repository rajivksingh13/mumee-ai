# Firestore Data Upload Guide

Complete guide for uploading complex workshop data to Firestore with nested structures, arrays, and maps.

## **Method 1: Firebase Console (Manual)**

### **Step-by-Step Process:**

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project
   - Go to Firestore Database

2. **Create/Select Collection**
   - Click "Start collection" or select existing `workshops` collection
   - Enter collection ID: `workshops`

3. **Add Document**
   - Click "Add document"
   - Enter Document ID: `advanced-workshop`
   - Click "Next"

4. **Add Fields (One by One)**

#### **Basic Fields:**
```
Field: certificate
Type: boolean
Value: true

Field: currency
Type: string
Value: "INR"

Field: duration
Type: number
Value: 16

Field: featured
Type: boolean
Value: true

Field: format
Type: string
Value: "Online Interactive"

Field: id
Type: string
Value: "advanced-workshop"

Field: isLiveSession
Type: boolean
Value: false

Field: level
Type: string
Value: "advanced"

Field: maxParticipants
Type: number
Value: 20

Field: meetingId
Type: string
Value: "555666777"

Field: meetingLink
Type: string
Value: "https://zoom.us/j/555666777"

Field: meetingPassword
Type: string
Value: "titliAI2024"

Field: price
Type: number
Value: 5999

Field: scheduledDate
Type: string
Value: "2024-01-30"

Field: scheduledTime
Type: string
Value: "16:00"

Field: sessionDuration
Type: number
Value: 240

Field: slug
Type: string
Value: "advanced"

Field: status
Type: string
Value: "active"

Field: timezone
Type: string
Value: "Asia/Kolkata"

Field: title
Type: string
Value: "Advanced AI Workshop"

Field: overview
Type: string
Value: "Advanced AI techniques including RAG, vector databases, model customization, and production deployment."

Field: description
Type: string
Value: "Master advanced AI concepts with our expert-level workshop."
```

#### **Complex Fields:**

**Field: curriculum (Map)**
```
Type: map
Then add nested fields:
  - modules (array)
```

**Field: modules (Array)**
```
Type: array
Add map objects for each module:
  - description (string)
  - duration (number)
  - id (string)
  - lessons (array)
  - title (string)
```

**Field: lessons (Array within each module)**
```
Type: array
Add map objects for each lesson:
  - content (string)
  - description (string)
  - duration (number)
  - id (string)
  - resources (array)
  - title (string)
  - videoUrl (string)
```

**Field: resources (Array within each lesson)**
```
Type: array
Add string values for each resource file
```

**Field: timestamps**
```
Field: createdAt
Type: timestamp
Value: [Current time]

Field: updatedAt
Type: timestamp
Value: [Current time]
```

## **Method 2: Firebase Admin SDK Script (Recommended)**

### **Quick Setup:**

1. **Install Dependencies:**
   ```bash
   cd mumee-ai/scripts
   npm install firebase-admin
   ```

2. **Get Service Account Key:**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download JSON file
   - Rename to `firebase-service-account.json`
   - Place in `mumee-ai` root directory

3. **Run the Upload Script:**
   ```bash
   # Upload predefined advanced workshop
   node upload-advanced-workshop.js
   
   # Create sample JSON file
   node upload-advanced-workshop.js --sample
   
   # Upload from custom JSON file
   node upload-advanced-workshop.js --file my-workshop.json
   ```

## **Method 3: JSON Import/Export**

### **Create JSON Template:**

1. **Run the script to create sample:**
   ```bash
   node upload-advanced-workshop.js --sample
   ```

2. **Edit the generated JSON file:**
   - Open `advanced-workshop-sample.json`
   - Modify the data as needed
   - Save the file

3. **Upload from JSON:**
   ```bash
   node upload-advanced-workshop.js --file advanced-workshop-sample.json
   ```

## **Method 4: Firebase CLI**

### **Install Firebase CLI:**
```bash
npm install -g firebase-tools
firebase login
firebase init firestore
```

### **Create JSON file and import:**
```bash
# Export existing data (if any)
firebase firestore:export ./backup

# Import data
firebase firestore:import ./data
```

## **Method 5: Third-Party Tools**

### **Option A: Firestore Admin Panel**
- Use Firebase Console's built-in interface
- Good for small datasets
- Manual field-by-field entry

### **Option B: Firestore Viewer Extensions**
- Chrome extensions for Firestore
- Better UI for complex data
- Bulk import capabilities

### **Option C: Custom Admin Panel**
- Build a simple web interface
- Use Firebase Admin SDK
- Upload JSON files through web UI

## **Data Structure Examples**

### **Simple Workshop Structure:**
```json
{
  "id": "beginner-workshop",
  "title": "AI Fundamentals",
  "description": "Learn AI basics",
  "level": "beginner",
  "price": 2999,
  "currency": "INR",
  "duration": 20,
  "format": "Online",
  "certificate": true,
  "status": "active",
  "featured": true,
  "slug": "beginner-workshop",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### **Complex Workshop Structure (Your Case):**
```json
{
  "id": "advanced-workshop",
  "title": "Advanced AI Workshop",
  "description": "Master advanced AI concepts",
  "level": "advanced",
  "price": 5999,
  "currency": "INR",
  "duration": 16,
  "format": "Online Interactive",
  "certificate": true,
  "status": "active",
  "featured": true,
  "slug": "advanced",
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
  "isLiveSession": false,
  "maxParticipants": 20,
  "meetingId": "555666777",
  "meetingLink": "https://zoom.us/j/555666777",
  "meetingPassword": "titliAI2024",
  "scheduledDate": "2024-01-30",
  "scheduledTime": "16:00",
  "sessionDuration": 240,
  "timezone": "Asia/Kolkata",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## **Best Practices**

### **For Non-Technical Users:**
1. **Start with Firebase Console** - Most user-friendly
2. **Use the provided script** - Handles complex structures automatically
3. **Create JSON templates** - Edit in any text editor
4. **Test with one document first** - Verify structure before bulk upload

### **For Technical Users:**
1. **Use Firebase Admin SDK** - Most reliable and flexible
2. **Create reusable scripts** - For similar data structures
3. **Implement validation** - Check data before upload
4. **Use batch operations** - For multiple documents

### **Data Validation:**
- Check required fields
- Validate data types
- Ensure nested structures are correct
- Test with small datasets first

## **Troubleshooting**

### **Common Issues:**

1. **"Missing required field"**
   - Check all required fields are present
   - Verify field names match exactly

2. **"Invalid data type"**
   - Ensure numbers are numbers (not strings)
   - Check booleans are true/false (not "true"/"false")
   - Verify timestamps are in correct format

3. **"Nested structure error"**
   - Check array syntax
   - Verify map structure
   - Ensure proper nesting levels

4. **"Permission denied"**
   - Check Firebase service account permissions
   - Verify project ID is correct
   - Ensure service account key is valid

### **Performance Tips:**
- Upload in batches for large datasets
- Use offline mode for better performance
- Implement retry logic for failed uploads
- Monitor Firebase usage quotas

## **Security Considerations**

⚠️ **Important Security Notes:**
- Never commit service account keys to version control
- Add `firebase-service-account.json` to `.gitignore`
- Use environment variables for production
- Regularly rotate service account keys
- Limit service account permissions to minimum required

## **Next Steps**

1. **Choose your method** based on technical comfort level
2. **Set up Firebase service account** if using scripts
3. **Create your data structure** following the examples
4. **Test with one document** before bulk upload
5. **Verify in Firebase Console** after upload
6. **Backup your data** regularly

The **Firebase Admin SDK script** (`upload-advanced-workshop.js`) is recommended for your complex workshop structure as it handles all the nested arrays, maps, and complex data types automatically. 