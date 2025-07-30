# titliAI Database Schema Design

## 🗄️ Database: Firebase Firestore

### **1. Users Collection**
```javascript
users/{userId}
{
  uid: string,                    // Firebase Auth UID
  email: string,
  displayName: string,
  photoURL: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  profile: {
    firstName: string,
    lastName: string,
    phone: string,
    dateOfBirth: date,
    location: string,
    bio: string,
    interests: string[],
    skillLevel: 'beginner' | 'intermediate' | 'advanced'
  },
  preferences: {
    emailNotifications: boolean,
    marketingEmails: boolean,
    newsletter: boolean
  },
  stats: {
    totalEnrollments: number,
    completedWorkshops: number,
    certificatesEarned: number,
    lastActive: timestamp
  }
}
```

### **2. Workshops Collection**
```javascript
workshops/{workshopId}
{
  id: string,                     // 'beginner', 'foundation', 'advance'
  title: string,                  // 'AI Workshop – Beginner Level'
  description: string,
  level: 'beginner' | 'foundation' | 'advanced',
  price: number,                  // 0 for free, 499 for paid
  currency: string,               // 'INR'
  duration: number,               // hours
  format: string,                 // 'Online Self-Paced'
  certificate: boolean,
  status: 'active' | 'draft' | 'archived',
  featured: boolean,
  createdAt: timestamp,
  updatedAt: timestamp,
  
  // Content
  overview: {
    duration: number,
    level: string,
    format: string,
    certificate: boolean,
    description: string
  },
  
  curriculum: [
    {
      topic: string,
      hours: number,
      subTopics: string[]
    }
  ],
  
  // Media
  thumbnail: string,              // URL to image
  banner: string,                 // URL to banner image
  videoPreview: string,           // URL to preview video
  
  // SEO
  slug: string,                   // 'ai-workshop-beginner-level'
  metaTitle: string,
  metaDescription: string,
  keywords: string[]
}
```

### **3. Enrollments Collection**
```javascript
enrollments/{enrollmentId}
{
  id: string,
  userId: string,                 // Reference to users/{userId}
  workshopId: string,             // Reference to workshops/{workshopId}
  status: 'active' | 'completed' | 'cancelled' | 'expired',
  enrolledAt: timestamp,
  completedAt: timestamp,
  expiresAt: timestamp,
  
  // Payment details
  payment: {
    amount: number,
    currency: string,
    paymentId: string,            // Razorpay payment ID
    orderId: string,              // Razorpay order ID
    status: 'pending' | 'completed' | 'failed' | 'refunded',
    paymentMethod: 'razorpay' | 'free',
    paidAt: timestamp
  },
  
  // Progress tracking
  progress: {
    currentModule: number,
    completedModules: number[],
    totalModules: number,
    percentageComplete: number,
    lastAccessed: timestamp
  },
  
  // Certificate
  certificate: {
    issued: boolean,
    certificateId: string,
    issuedAt: timestamp,
    downloadUrl: string
  }
}
```

### **4. Content Modules Collection**
```javascript
modules/{moduleId}
{
  id: string,
  workshopId: string,             // Reference to workshops/{workshopId}
  title: string,
  description: string,
  order: number,                  // Sequence in workshop
  duration: number,               // minutes
  type: 'video' | 'text' | 'quiz' | 'assignment',
  
  // Content
  content: {
    videoUrl: string,
    videoDuration: number,
    transcript: string,
    resources: [
      {
        title: string,
        type: 'pdf' | 'link' | 'download',
        url: string
      }
    ]
  },
  
  // Quiz/Assignment
  quiz: {
    questions: [
      {
        question: string,
        type: 'multiple-choice' | 'true-false' | 'text',
        options: string[],
        correctAnswer: string | number,
        explanation: string
      }
    ],
    passingScore: number
  },
  
  status: 'active' | 'draft',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### **5. Payments Collection**
```javascript
payments/{paymentId}
{
  id: string,
  userId: string,                 // Reference to users/{userId}
  workshopId: string,             // Reference to workshops/{workshopId}
  enrollmentId: string,           // Reference to enrollments/{enrollmentId}
  
  // Payment details
  amount: number,
  currency: string,
  status: 'pending' | 'completed' | 'failed' | 'refunded',
  paymentMethod: 'razorpay',
  
  // Razorpay details
  razorpay: {
    paymentId: string,
    orderId: string,
    signature: string,
    gateway: string,
    bank: string,
    cardId: string,
    method: string
  },
  
  // Timestamps
  createdAt: timestamp,
  paidAt: timestamp,
  refundedAt: timestamp
}
```

### **6. Analytics Collection**
```javascript
analytics/{date}
{
  date: string,                   // YYYY-MM-DD
  enrollments: {
    total: number,
    beginner: number,
    foundation: number,
    advanced: number,
    free: number,
    paid: number
  },
  revenue: {
    total: number,
    currency: string
  },
  users: {
    new: number,
    active: number,
    total: number
  },
  workshops: {
    views: {
      beginner: number,
      foundation: number,
      advanced: number
    },
    enrollments: {
      beginner: number,
      foundation: number,
      advanced: number
    }
  }
}
```

### **7. Notifications Collection**
```javascript
notifications/{notificationId}
{
  id: string,
  userId: string,                 // Reference to users/{userId}
  type: 'enrollment' | 'completion' | 'payment' | 'system',
  title: string,
  message: string,
  read: boolean,
  createdAt: timestamp,
  readAt: timestamp,
  
  // Action data
  action: {
    type: 'link' | 'button',
    text: string,
    url: string
  }
}
```

## 🔄 Data Relationships

### **User Enrollment Flow:**
1. User signs up → `users/{userId}` created
2. User enrolls → `enrollments/{enrollmentId}` created
3. Payment made → `payments/{paymentId}` created
4. Progress tracked → `enrollments/{enrollmentId}` updated
5. Certificate issued → `enrollments/{enrollmentId}` updated

### **Workshop Management Flow:**
1. Admin creates workshop → `workshops/{workshopId}` created
2. Admin adds modules → `modules/{moduleId}` created
3. Users view workshop → Analytics updated
4. Users enroll → `enrollments/{enrollmentId}` created

## 🛡️ Security Rules

### **Firestore Security Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read workshops
    match /workshops/{workshopId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Users can read/write their own enrollments
    match /enrollments/{enrollmentId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Users can read their own payments
    match /payments/{paymentId} {
      allow read: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 📊 Indexes Required

### **Composite Indexes:**
1. `enrollments` collection:
   - `userId` + `status` + `enrolledAt`
   - `workshopId` + `status` + `enrolledAt`

2. `payments` collection:
   - `userId` + `status` + `createdAt`
   - `workshopId` + `status` + `createdAt`

3. `modules` collection:
   - `workshopId` + `order` + `status`

## 🚀 Implementation Phases

### **Phase 1: Foundation (Week 1-2)**
- Set up Firestore database
- Create basic collections (users, workshops, enrollments)
- Implement user profile management
- Basic enrollment system

### **Phase 2: Content Management (Week 3-4)**
- Workshop CRUD operations
- Module management system
- Progress tracking
- Certificate generation

### **Phase 3: Analytics & Reporting (Week 5-6)**
- Analytics collection
- Dashboard implementation
- Reporting features
- Performance optimization

### **Phase 4: Advanced Features (Week 7-8)**
- Notifications system
- Advanced analytics
- Admin panel
- Performance monitoring 