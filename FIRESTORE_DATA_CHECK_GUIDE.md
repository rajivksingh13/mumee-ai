# 🔍 Firestore Data Check Guide

## 🎯 **How to Verify Workshop Data Migration**

There are several ways to check if your workshop data has been successfully migrated to Firestore:

---

## 📊 **Method 1: Firebase Console (Recommended)**

### **Step 1: Access Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`mumee-ai`)
3. Click on **"Firestore Database"** in the left sidebar

### **Step 2: Check Collections**
1. You should see two collections:
   - **`workshops`** - Contains all workshop data
   - **`modules`** - Contains all module data

### **Step 3: Verify Workshop Data**
1. Click on the **`workshops`** collection
2. You should see 3 documents:
   - `beginner-workshop`
   - `foundation-workshop` 
   - `advanced-workshop`

### **Step 4: Check Module Data**
1. Click on the **`modules`** collection
2. You should see 6 documents (2 modules per workshop):
   - `beginner-module-1`, `beginner-module-2`
   - `foundation-module-1`, `foundation-module-2`
   - `advanced-module-1`, `advanced-module-2`

---

## 🖥️ **Method 2: Browser Console**

### **Step 1: Open Your App**
1. Start your development server: `npm run dev`
2. Open your app in the browser
3. Open Developer Tools (F12)
4. Go to the **Console** tab

### **Step 2: Run the Check Script**
1. Copy the entire content from `scripts/check-firestore-data.js`
2. Paste it into the browser console
3. Press Enter to execute

### **Expected Output:**
```
🚀 Starting Firestore Data Check...

📚 Checking workshops...
✅ Found 3 workshops:

🎯 Workshop: Beginner AI Workshop
   ID: beginner-workshop
   Level: beginner
   Price: ₹0
   Duration: 8 hours
   Status: active
   Slug: beginner
   📋 Curriculum: 5 topics

🎯 Workshop: Foundation AI Workshop
   ID: foundation-workshop
   Level: foundation
   Price: ₹2999
   Duration: 12 hours
   Status: active
   Slug: foundation
   📋 Curriculum: 5 topics

🎯 Workshop: Advanced AI Workshop
   ID: advanced-workshop
   Level: advanced
   Price: ₹5999
   Duration: 16 hours
   Status: active
   Slug: advanced
   📋 Curriculum: 6 topics

📖 Checking modules...
✅ Found 6 modules:

📚 Module: Introduction to AI
   ID: beginner-module-1
   Workshop ID: beginner-workshop
   Duration: 60 minutes
   Type: video
   Status: active

📚 Module: Machine Learning Basics
   ID: beginner-module-2
   Workshop ID: beginner-workshop
   Duration: 120 minutes
   Type: video
   Status: active

... (more modules)

✅ Firestore data check completed!
```

---

## 🖥️ **Method 3: Terminal Script**

### **Step 1: Run Verification Script**
```bash
npm run verify:workshops
```

### **Expected Output:**
```
🔍 Verifying Workshop Data Migration...
✅ Firebase initialized
📚 Found 3 workshops in Firestore:

🎯 Workshop: Beginner AI Workshop
   Level: beginner
   Price: ₹0
   Duration: 8 hours
   Status: active
   Slug: beginner
   📖 Modules: 2
   📋 Curriculum:
     1. Introduction to AI (1 hours)
     2. Machine Learning Basics (2 hours)
     3. Python for AI (2 hours)
     4. First AI Project (2 hours)
     5. AI Ethics and Future (1 hours)

... (more workshops)

✅ Verification Results:
   Beginner Workshop: ✅ Found
   Foundation Workshop: ✅ Found
   Advanced Workshop: ✅ Found

🎉 All workshops successfully migrated!
```

---

## 🔍 **Method 4: Check Specific Data**

### **Check Workshop by Slug:**
```javascript
// In browser console
const firestore = firebase.firestore();
const workshop = await firestore.collection('workshops')
  .where('slug', '==', 'beginner')
  .get();
console.log(workshop.docs[0].data());
```

### **Check Modules for a Workshop:**
```javascript
// In browser console
const modules = await firestore.collection('modules')
  .where('workshopId', '==', 'beginner-workshop')
  .get();
modules.forEach(doc => console.log(doc.data()));
```

---

## ✅ **What to Look For**

### **Workshop Data Should Include:**
- ✅ **Title** (e.g., "Beginner AI Workshop")
- ✅ **Description** (detailed workshop description)
- ✅ **Level** (beginner, foundation, advanced)
- ✅ **Price** (0, 2999, 5999)
- ✅ **Duration** (8, 12, 16 hours)
- ✅ **Slug** (beginner, foundation, advanced)
- ✅ **Curriculum** (array of topics with hours and sub-topics)
- ✅ **Status** (active)
- ✅ **Featured** (true)

### **Module Data Should Include:**
- ✅ **Title** (e.g., "Introduction to AI")
- ✅ **Workshop ID** (links to workshop)
- ✅ **Duration** (in minutes)
- ✅ **Type** (video)
- ✅ **Content** (video URL, transcript, resources)
- ✅ **Order** (1, 2, etc.)

---

## 🚨 **Troubleshooting**

### **If No Data Found:**

1. **Check if migration was run:**
   ```bash
   npm run migrate:workshops
   ```

2. **Check environment variables:**
   ```bash
   npm run test:env
   ```

3. **Check Firestore connection:**
   ```bash
   npm run test:connection
   ```

4. **Check Firebase Console:**
   - Ensure Firestore is enabled
   - Check security rules
   - Verify project configuration

### **If Data is Incomplete:**

1. **Re-run migration:**
   ```bash
   npm run migrate:workshops
   ```

2. **Check for errors in console**
3. **Verify Firebase configuration**

---

## 🎉 **Success Indicators**

You'll know the migration was successful when you see:

✅ **3 workshops** in the `workshops` collection  
✅ **6 modules** in the `modules` collection  
✅ **Complete curriculum** for each workshop  
✅ **Proper pricing** (₹0, ₹2999, ₹5999)  
✅ **Correct slugs** (beginner, foundation, advanced)  
✅ **All required fields** present in each document  

---

## 🚀 **Next Steps**

Once you confirm the data is migrated:

1. **Update Workshop Components** (Step 3)
2. **Test Workshop Display** in your app
3. **Implement Enrollment System** (Step 4)
4. **Test End-to-End Flow**

**Ready to proceed with Step 3: Update Workshop Components!** 🎯 