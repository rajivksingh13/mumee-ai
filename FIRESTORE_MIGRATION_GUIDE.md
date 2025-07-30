# titliAI Firestore Migration Guide

## 🎯 **Why Firestore for titliAI?**

### **Current State Analysis**
- Using Firebase Realtime Database
- Simple data structure with localStorage for enrollments
- Limited querying capabilities
- No complex relationships

### **Target State with Firestore**
- Advanced data relationships
- Complex querying for analytics
- Better scalability
- Robust offline support
- Future-proof architecture

## 🚀 **Migration Strategy**

### **Phase 1: Setup Firestore (Week 1)**

#### **1.1 Enable Firestore in Firebase Console**
```bash
# Go to Firebase Console
# Navigate to Firestore Database
# Click "Create Database"
# Choose "Start in test mode" (we'll add security rules later)
# Select location closest to your users
```

#### **1.2 Update Firebase Configuration**
✅ **Already Done**: Updated `src/config/firebase.ts` to include both databases

#### **1.3 Install Required Dependencies**
```bash
npm install firebase
# Verify firebase version supports Firestore
```

### **Phase 2: Data Migration (Week 2)**

#### **2.1 Create Migration Scripts**
```javascript
// scripts/migrate-to-firestore.js
import { databaseService } from '../src/services/databaseService';

const migrateWorkshops = async () => {
  const workshops = [
    {
      id: 'beginner',
      title: 'AI Workshop – Beginner Level',
      description: 'Start your AI journey from scratch!',
      level: 'beginner',
      price: 0,
      currency: 'INR',
      duration: 4,
      format: 'Online Self-Paced',
      certificate: true,
      status: 'active',
      featured: true,
      slug: 'ai-workshop-beginner-level',
      overview: {
        duration: 4,
        level: 'Beginner',
        format: 'Online Self-Paced',
        certificate: true,
        description: 'Perfect for those new to AI and machine learning.'
      },
      curriculum: [
        {
          topic: 'Introduction to AI',
          hours: 1,
          subTopics: ['What is AI?', 'AI vs ML vs DL', 'Real-world applications']
        },
        {
          topic: 'Machine Learning Basics',
          hours: 2,
          subTopics: ['Supervised Learning', 'Unsupervised Learning', 'Model Training']
        },
        {
          topic: 'Practical Applications',
          hours: 1,
          subTopics: ['Building your first model', 'Deployment basics', 'Next steps']
        }
      ]
    },
    {
      id: 'foundation',
      title: 'AI Workshop – Foundation Level',
      description: 'Build a strong foundation in AI and machine learning!',
      level: 'foundation',
      price: 499,
      currency: 'INR',
      duration: 8,
      format: 'Online Self-Paced',
      certificate: true,
      status: 'active',
      featured: true,
      slug: 'ai-workshop-foundation-level',
      overview: {
        duration: 8,
        level: 'Foundation',
        format: 'Online Self-Paced',
        certificate: true,
        description: 'Comprehensive foundation course for AI enthusiasts.'
      },
      curriculum: [
        {
          topic: 'Advanced ML Concepts',
          hours: 2,
          subTopics: ['Neural Networks', 'Deep Learning', 'Feature Engineering']
        },
        {
          topic: 'Data Preprocessing',
          hours: 2,
          subTopics: ['Data Cleaning', 'Feature Scaling', 'Data Augmentation']
        },
        {
          topic: 'Model Evaluation',
          hours: 2,
          subTopics: ['Cross-validation', 'Metrics', 'Hyperparameter Tuning']
        },
        {
          topic: 'Real-world Projects',
          hours: 2,
          subTopics: ['Image Classification', 'Text Analysis', 'Deployment']
        }
      ]
    },
    {
      id: 'advance',
      title: 'AI Workshop – Advanced Level',
      description: 'Master advanced AI techniques and applications!',
      level: 'advanced',
      price: 999,
      currency: 'INR',
      duration: 12,
      format: 'Online Self-Paced',
      certificate: true,
      status: 'active',
      featured: true,
      slug: 'ai-workshop-advanced-level',
      overview: {
        duration: 12,
        level: 'Advanced',
        format: 'Online Self-Paced',
        certificate: true,
        description: 'Advanced course for experienced AI practitioners.'
      },
      curriculum: [
        {
          topic: 'Advanced Neural Networks',
          hours: 3,
          subTopics: ['CNN', 'RNN', 'Transformers', 'Attention Mechanisms']
        },
        {
          topic: 'Natural Language Processing',
          hours: 3,
          subTopics: ['BERT', 'GPT', 'Text Generation', 'Sentiment Analysis']
        },
        {
          topic: 'Computer Vision',
          hours: 3,
          subTopics: ['Object Detection', 'Image Segmentation', 'Video Analysis']
        },
        {
          topic: 'Production Deployment',
          hours: 3,
          subTopics: ['Model Serving', 'Scalability', 'Monitoring', 'MLOps']
        }
      ]
    }
  ];

  for (const workshop of workshops) {
    try {
      await databaseService.createWorkshop(workshop);
      console.log(`✅ Migrated workshop: ${workshop.title}`);
    } catch (error) {
      console.error(`❌ Failed to migrate workshop ${workshop.title}:`, error);
    }
  }
};

const migrateExistingEnrollments = async () => {
  // This will be run for each user when they log in
  // Check localStorage and migrate to Firestore
  const migrateUserEnrollments = (userId: string) => {
    const beginnerEnrolled = localStorage.getItem(`enrolled_beginner`);
    const foundationEnrolled = localStorage.getItem(`enrolled_foundation`);
    const advanceEnrolled = localStorage.getItem(`enrolled_advance`);
    
    const enrollments = [];
    
    if (beginnerEnrolled === 'true') {
      enrollments.push('beginner');
    }
    if (foundationEnrolled === 'true') {
      enrollments.push('foundation');
    }
    if (advanceEnrolled === 'true') {
      enrollments.push('advance');
    }
    
    return enrollments;
  };
  
  return migrateUserEnrollments;
};

// Run migration
migrateWorkshops().then(() => {
  console.log('🎉 Workshop migration completed!');
});
```

#### **2.2 Add Workshop Creation Method**
```javascript
// Add to databaseService.ts
async createWorkshop(workshopData: Omit<Workshop, 'createdAt' | 'updatedAt'>): Promise<string> {
  const workshopRef = doc(firestore, 'workshops', workshopData.id);
  const now = Timestamp.now();
  
  await setDoc(workshopRef, {
    ...workshopData,
    createdAt: now,
    updatedAt: now
  });
  
  return workshopData.id;
}
```

### **Phase 3: Component Updates (Week 3)**

#### **3.1 Update Workshops Component**
```typescript
// src/components/Workshops.tsx
import { useEffect, useState } from 'react';
import { databaseService, Workshop } from '../services/databaseService';

const Workshops: React.FC = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWorkshops = async () => {
      try {
        setLoading(true);
        const workshopsData = await databaseService.getWorkshops();
        setWorkshops(workshopsData);
      } catch (error) {
        console.error('Error loading workshops:', error);
        setError('Failed to load workshops');
      } finally {
        setLoading(false);
      }
    };

    loadWorkshops();
  }, []);

  if (loading) {
    return <div>Loading workshops...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {workshops.map((workshop) => (
        <div key={workshop.id}>
          <h3>{workshop.title}</h3>
          <p>{workshop.description}</p>
          <p>Price: ₹{workshop.price}</p>
          <p>Duration: {workshop.duration} hours</p>
        </div>
      ))}
    </div>
  );
};
```

#### **3.2 Update Workshop Detail Components**
```typescript
// src/components/BeginnerWorkshop.tsx
import { useEffect, useState } from 'react';
import { databaseService, Workshop, Enrollment } from '../services/databaseService';
import { useAuth } from '../contexts/AuthContext';

const BeginnerWorkshop: React.FC = () => {
  const { user } = useAuth();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkshopData = async () => {
      try {
        // Load workshop data from Firestore
        const workshopData = await databaseService.getWorkshop('beginner');
        setWorkshop(workshopData);

        // Check enrollment if user is logged in
        if (user) {
          const isEnrolled = await databaseService.isUserEnrolled(user.uid, 'beginner');
          if (isEnrolled) {
            const enrollments = await databaseService.getUserEnrollments(user.uid);
            const enrollmentData = enrollments.find(e => e.workshopId === 'beginner');
            setEnrollment(enrollmentData || null);
          }
        }
      } catch (error) {
        console.error('Error loading workshop data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkshopData();
  }, [user]);

  // ... rest of component logic
};
```

### **Phase 4: Security Rules (Week 4)**

#### **4.1 Firestore Security Rules**
```javascript
// firestore.rules
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
    
    // Analytics - admin only
    match /analytics/{date} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### **Phase 5: Testing & Validation (Week 5)**

#### **5.1 Test Data Migration**
```javascript
// scripts/test-migration.js
import { databaseService } from '../src/services/databaseService';

const testMigration = async () => {
  // Test workshop loading
  const workshops = await databaseService.getWorkshops();
  console.log('Workshops loaded:', workshops.length);
  
  // Test enrollment creation
  const testUserId = 'test-user-123';
  const testWorkshopId = 'beginner';
  
  const result = await databaseService.enrollUserInWorkshop(testUserId, testWorkshopId);
  console.log('Enrollment created:', result);
  
  // Test enrollment query
  const isEnrolled = await databaseService.isUserEnrolled(testUserId, testWorkshopId);
  console.log('User enrolled:', isEnrolled);
  
  // Test user enrollments
  const enrollments = await databaseService.getUserEnrollments(testUserId);
  console.log('User enrollments:', enrollments);
};
```

## 📊 **Performance Comparison**

### **Before (Realtime Database)**
```
- Simple queries: ~50ms
- Complex queries: Not possible
- Offline support: Limited
- Data structure: Flat
- Scalability: Limited
```

### **After (Firestore)**
```
- Simple queries: ~100ms
- Complex queries: ~200ms
- Offline support: Full
- Data structure: Hierarchical
- Scalability: Excellent
```

## 💰 **Cost Analysis**

### **Estimated Monthly Costs for 1000 Users**

#### **Realtime Database**
```
- Storage: 1GB = $5
- Transfer: 10GB = $10
- Total: ~$15/month
```

#### **Firestore**
```
- Storage: 1GB = $0.18
- Reads: 50K = $0.03
- Writes: 5K = $0.045
- Total: ~$0.26/month
```

**Firestore is significantly more cost-effective!**

## 🚀 **Deployment Steps**

### **1. Enable Firestore**
```bash
# In Firebase Console
# Go to Firestore Database
# Click "Create Database"
# Choose test mode initially
```

### **2. Deploy Security Rules**
```bash
firebase deploy --only firestore:rules
```

### **3. Run Migration**
```bash
npm run migrate:workshops
```

### **4. Update Components**
```bash
# Deploy updated components
npm run build
firebase deploy
```

### **5. Monitor Performance**
```bash
# Check Firebase Console
# Monitor Firestore usage
# Check for any errors
```

## ✅ **Migration Checklist**

- [ ] Enable Firestore in Firebase Console
- [ ] Update Firebase configuration
- [ ] Create migration scripts
- [ ] Migrate workshop data
- [ ] Update components to use Firestore
- [ ] Deploy security rules
- [ ] Test all functionality
- [ ] Monitor performance
- [ ] Remove Realtime Database code (optional)

## 🎯 **Benefits After Migration**

1. **Better Data Structure**: Hierarchical collections with relationships
2. **Advanced Querying**: Complex queries for analytics and reporting
3. **Offline Support**: Full offline functionality
4. **Scalability**: Handles growth better
5. **Cost Efficiency**: More cost-effective for your use case
6. **Future-Proof**: Google's recommended solution

This migration will transform titliAI into a modern, scalable platform ready for growth! 