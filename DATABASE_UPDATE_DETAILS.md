# Database Update Details - Live Session Email Tracking

## 📊 **Database Collections Being Updated**

### **1. `enrollments` Collection**

**What gets updated:** When an email is successfully sent, the enrollment document is updated with notification tracking information.

**Update Location:** 
```javascript
const enrollmentRef = firebase.firestore().collection('enrollments').doc(enrollmentId);
await enrollmentRef.update({
    'notifications.liveSessionSent': new Date(),
    'notifications.lastUpdated': new Date()
});
```

**Fields Added/Updated:**
- `notifications.liveSessionSent` - Timestamp when the live session email was sent
- `notifications.lastUpdated` - Timestamp when the notification was last updated

**Example Document Structure:**
```json
{
  "id": "enrollment-123",
  "userId": "user-456",
  "workshopId": "workshop-789",
  "status": "active",
  "enrolledAt": "2025-08-21T10:00:00Z",
  "notifications": {
    "liveSessionSent": "2025-08-23T14:30:00Z",
    "lastUpdated": "2025-08-23T14:30:00Z"
  }
}
```

---

### **2. `workshops` Collection**

**What gets updated:** When setting a workshop date/time for live sessions.

**Update Location:**
```javascript
const workshopRef = firebase.firestore().collection('workshops').doc(workshopId);
await workshopRef.update({
    scheduledDate: scheduledDate,
    scheduledTime: scheduledTime,
    timezone: timezone,
    sessionDuration: parseInt(sessionDuration),
    updatedAt: new Date()
});
```

**Fields Added/Updated:**
- `scheduledDate` - Date of the live session (YYYY-MM-DD format)
- `scheduledTime` - Time of the live session (HH:MM format)
- `timezone` - Timezone for the session (e.g., "Asia/Kolkata")
- `sessionDuration` - Duration in minutes (e.g., 120)
- `updatedAt` - Timestamp when workshop was last updated

**Example Document Structure:**
```json
{
  "id": "workshop-789",
  "title": "Advanced AI Workshop",
  "isLiveSession": true,
  "scheduledDate": "2025-08-25",
  "scheduledTime": "14:00",
  "timezone": "Asia/Kolkata",
  "sessionDuration": 120,
  "updatedAt": "2025-08-23T10:00:00Z"
}
```

---

## 🔄 **Update Flow**

### **Step 1: Email Sending**
1. Admin clicks "📧 Send Reminder" button
2. Email is sent via `/api/email/live-session-notification` endpoint
3. If email sends successfully, proceed to database update

### **Step 2: Database Update**
1. **Enrollment Document Update:**
   - Collection: `enrollments`
   - Document ID: `enrollmentId` (specific enrollment)
   - Fields Updated: `notifications.liveSessionSent`, `notifications.lastUpdated`

2. **Local Data Update:**
   - Updates the local `allData.enrollments` array
   - Ensures UI reflects changes immediately

### **Step 3: UI Refresh**
1. `renderContent()` is called to refresh the display
2. Shows "✅ Email Sent: [Date]" instead of "📧 Send Reminder" button

---

## 📈 **Tracking Benefits**

### **What Admin Can See:**
- ✅ **Email Status:** Whether email was sent or not
- 📅 **Sent Date:** When the email was sent
- 👥 **User Count:** How many users received emails
- ⏳ **Pending Count:** How many users still need emails

### **Prevents:**
- ❌ **Duplicate Emails:** Won't send to users who already received emails
- ❌ **Missing Users:** Clear visibility of who hasn't received emails
- ❌ **Manual Tracking:** No need to manually track who was emailed

---

## 🛠 **Technical Implementation**

### **Database Schema:**
```javascript
// Enrollment Schema
{
  id: string,
  userId: string,
  workshopId: string,
  status: string,
  enrolledAt: timestamp,
  notifications: {
    liveSessionSent: timestamp,  // When email was sent
    lastUpdated: timestamp       // When notification was updated
  }
}

// Workshop Schema
{
  id: string,
  title: string,
  isLiveSession: boolean,
  scheduledDate: string,         // YYYY-MM-DD
  scheduledTime: string,         // HH:MM
  timezone: string,              // e.g., "Asia/Kolkata"
  sessionDuration: number,       // minutes
  updatedAt: timestamp
}
```

### **Query Examples:**
```javascript
// Find enrollments with sent emails
const sentEmails = enrollments.filter(e => e.notifications?.liveSessionSent);

// Find enrollments without sent emails
const pendingEmails = enrollments.filter(e => !e.notifications?.liveSessionSent);

// Find live session workshops
const liveWorkshops = workshops.filter(w => w.isLiveSession);
```

---

## 🎯 **Summary**

**Collections Updated:**
1. **`enrollments`** - Tracks email sending status per user
2. **`workshops`** - Stores live session scheduling details

**Key Fields:**
- `notifications.liveSessionSent` - Email tracking
- `scheduledDate/scheduledTime` - Live session scheduling
- `timezone/sessionDuration` - Session configuration

**Benefits:**
- ✅ Complete email tracking
- ✅ No duplicate emails
- ✅ Clear admin visibility
- ✅ Automated status updates
