# titliAI Database Migration Implementation Plan

## 🎯 **Project Overview**

Transform titliAI from a static application to a modern, database-driven platform with dynamic content management, user profiles, enrollment tracking, and analytics.

## 📋 **Implementation Phases**

### **Phase 1: Foundation Setup (Week 1-2)**

#### **Week 1: Database & Core Services**
- [ ] Set up Firebase Firestore database
- [ ] Create database schema and collections
- [ ] Implement database service layer
- [ ] Set up Firestore security rules
- [ ] Create data migration scripts

#### **Week 2: User Management**
- [ ] Implement user profile creation on signup
- [ ] Create user profile management system
- [ ] Add user preferences and settings
- [ ] Implement user statistics tracking
- [ ] Create user dashboard

### **Phase 2: Workshop Management (Week 3-4)**

#### **Week 3: Workshop Data Migration**
- [ ] Migrate existing workshop data to Firestore
- [ ] Create workshop management system
- [ ] Implement dynamic workshop loading
- [ ] Add workshop CRUD operations
- [ ] Create admin interface for workshop management

#### **Week 4: Enrollment System**
- [ ] Replace localStorage with database enrollments
- [ ] Implement enrollment tracking
- [ ] Add progress tracking system
- [ ] Create enrollment management
- [ ] Implement enrollment status updates

### **Phase 3: Content & Analytics (Week 5-6)**

#### **Week 5: Content Management**
- [ ] Create module management system
- [ ] Implement content delivery system
- [ ] Add progress tracking per module
- [ ] Create certificate generation system
- [ ] Implement content analytics

#### **Week 6: Analytics & Reporting**
- [ ] Implement analytics collection
- [ ] Create dashboard for analytics
- [ ] Add reporting features
- [ ] Implement performance monitoring
- [ ] Create admin analytics panel

### **Phase 4: Advanced Features (Week 7-8)**

#### **Week 7: Notifications & Communication**
- [ ] Implement notification system
- [ ] Add email notifications
- [ ] Create in-app notifications
- [ ] Implement communication features
- [ ] Add user engagement tracking

#### **Week 8: Optimization & Launch**
- [ ] Performance optimization
- [ ] Security audit
- [ ] Testing and bug fixes
- [ ] Documentation
- [ ] Production deployment

## 🛠️ **Technical Implementation**

### **1. Database Setup**

#### **Firebase Firestore Configuration**
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firestore
firebase init firestore
```

#### **Security Rules Setup**
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
  }
}
```

### **2. Data Migration Strategy**

#### **Step 1: Create Migration Scripts**
```javascript
// scripts/migrate-workshops.js
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
      // ... other fields
    },
    // ... other workshops
  ];

  for (const workshop of workshops) {
    await databaseService.createWorkshop(workshop);
  }
};
```

#### **Step 2: Migrate Existing Data**
```javascript
// scripts/migrate-enrollments.js
const migrateEnrollments = async () => {
  // Get all users
  const users = await databaseService.getAllUsers();
  
  for (const user of users) {
    // Check localStorage for existing enrollments
    const beginnerEnrolled = localStorage.getItem(`enrolled_beginner`);
    const foundationEnrolled = localStorage.getItem(`enrolled_foundation`);
    const advanceEnrolled = localStorage.getItem(`enrolled_advance`);
    
    if (beginnerEnrolled === 'true') {
      await databaseService.enrollUserInWorkshop(user.uid, 'beginner');
    }
    
    if (foundationEnrolled === 'true') {
      await databaseService.enrollUserInWorkshop(user.uid, 'foundation');
    }
    
    if (advanceEnrolled === 'true') {
      await databaseService.enrollUserInWorkshop(user.uid, 'advance');
    }
  }
};
```

### **3. Component Updates**

#### **Update Workshops Component**
```typescript
// src/components/Workshops.tsx
import { useEffect, useState } from 'react';
import { databaseService, Workshop } from '../services/databaseService';

const Workshops: React.FC = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkshops = async () => {
      try {
        const workshopsData = await databaseService.getWorkshops();
        setWorkshops(workshopsData);
      } catch (error) {
        console.error('Error loading workshops:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkshops();
  }, []);

  // ... rest of component
};
```

#### **Update Workshop Detail Components**
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
        // Load workshop data
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

  // ... rest of component
};
```

### **4. Context Updates**

#### **Update Auth Context**
```typescript
// src/contexts/AuthContext.tsx
import { databaseService, User } from '../services/databaseService';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Create or get user profile
        let userProfile = await databaseService.getUser(firebaseUser.uid);
        
        if (!userProfile) {
          // Create new user profile
          await databaseService.createUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            profile: {},
            preferences: {
              emailNotifications: true,
              marketingEmails: true,
              newsletter: true
            },
            stats: {
              totalEnrollments: 0,
              completedWorkshops: 0,
              certificatesEarned: 0,
              lastActive: Timestamp.now()
            }
          });
          
          userProfile = await databaseService.getUser(firebaseUser.uid);
        }
        
        setUser(firebaseUser);
        setUserProfile(userProfile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
    });

    return unsubscribe;
  }, []);

  // ... rest of context
};
```

### **5. Admin Panel**

#### **Create Admin Dashboard**
```typescript
// src/components/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { databaseService } from '../services/databaseService';

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadAdminData = async () => {
      // Load analytics
      const today = new Date().toISOString().split('T')[0];
      const analyticsData = await databaseService.getAnalytics(today);
      setAnalytics(analyticsData);

      // Load workshops
      const workshopsData = await databaseService.getWorkshops();
      setWorkshops(workshopsData);

      // Load users (admin only)
      const usersData = await databaseService.getAllUsers();
      setUsers(usersData);
    };

    loadAdminData();
  }, []);

  // ... admin dashboard UI
};
```

## 📊 **Analytics Implementation**

### **Real-time Analytics Collection**
```typescript
// src/services/analyticsService.ts
import { databaseService } from './databaseService';

class AnalyticsService {
  async trackWorkshopView(workshopId: string, userId?: string) {
    const today = new Date().toISOString().split('T')[0];
    
    // Update analytics
    await databaseService.updateAnalytics(today, {
      [`workshops.views.${workshopId}`]: increment(1),
      'users.active': increment(1)
    });
  }

  async trackEnrollment(workshopId: string, userId: string, amount: number) {
    const today = new Date().toISOString().split('T')[0];
    
    await databaseService.updateAnalytics(today, {
      'enrollments.total': increment(1),
      [`enrollments.${workshopId}`]: increment(1),
      'revenue.total': increment(amount),
      'users.new': increment(1)
    });
  }
}

export const analyticsService = new AnalyticsService();
```

## 🔒 **Security Considerations**

### **1. Data Validation**
```typescript
// src/utils/validation.ts
import { z } from 'zod';

export const userSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().min(1),
  // ... other fields
});

export const workshopSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  price: z.number().min(0),
  // ... other fields
});
```

### **2. Rate Limiting**
```typescript
// src/utils/rateLimiter.ts
class RateLimiter {
  private requests = new Map<string, number[]>();
  
  isAllowed(userId: string, limit: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Remove old requests
    const recentRequests = userRequests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= limit) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(userId, recentRequests);
    return true;
  }
}
```

## 🚀 **Deployment Strategy**

### **1. Staging Environment**
```bash
# Deploy to staging
firebase use staging
npm run build
firebase deploy
```

### **2. Production Deployment**
```bash
# Deploy to production
firebase use production
npm run build
firebase deploy
```

### **3. Database Migration**
```bash
# Run migration scripts
npm run migrate:workshops
npm run migrate:enrollments
npm run migrate:users
```

## 📈 **Success Metrics**

### **Technical Metrics**
- [ ] Database response time < 200ms
- [ ] 99.9% uptime
- [ ] Zero data loss
- [ ] Real-time updates working

### **Business Metrics**
- [ ] User engagement increased by 50%
- [ ] Enrollment completion rate > 80%
- [ ] Revenue tracking accuracy 100%
- [ ] Admin efficiency improved by 70%

## 🔄 **Rollback Plan**

### **If Issues Arise:**
1. **Immediate Rollback**: Revert to previous version
2. **Data Recovery**: Restore from backups
3. **Gradual Migration**: Migrate users in batches
4. **Fallback Mode**: Use localStorage as backup

## 📝 **Documentation**

### **Required Documentation:**
- [ ] API documentation
- [ ] Database schema documentation
- [ ] Admin panel user guide
- [ ] Troubleshooting guide
- [ ] Performance optimization guide

This implementation plan provides a comprehensive roadmap for transforming titliAI into a modern, database-driven platform while maintaining the existing functionality and user experience. 