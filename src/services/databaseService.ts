import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  writeBatch,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
  setDoc
} from 'firebase/firestore';
import { firestore } from '../config/firebase';

// Types
export interface User {
  id: string;
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Profile information
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    bio?: string;
    location?: string;
    skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  };
  
  // Geolocation data for currency detection
  geolocation?: {
    countryCode: string;
    countryName?: string;
    region?: string;
    city?: string;
    timezone?: string;
    ipAddress?: string;
    detectedAt: Timestamp;
  };
  
  // User preferences
  preferences?: {
    emailNotifications: boolean;
    marketingEmails: boolean;
    newsletter: boolean;
    currency: 'INR' | 'USD' | 'EUR' | 'GBP'; // User's preferred currency
  };
  
  // User statistics
  stats?: {
    totalEnrollments: number;
    completedWorkshops: number;
    certificatesEarned: number;
    totalSpent: number;
    preferredCurrency: string;
  };
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'foundation' | 'advanced';
  price: number;
  currency: string;
  duration: number;
  format: string;
  certificate: boolean;
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Live session properties
  isLiveSession?: boolean;
  scheduledDate?: string; // ISO date string
  scheduledTime?: string; // HH:MM format
  timezone?: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  sessionDuration?: number; // in minutes
  maxParticipants?: number;
  
  overview: {
    duration: number;
    level: string;
    format: string;
    certificate: boolean;
    description: string;
  };
  curriculum: {
    overview: string;
    modules: Array<{
      id: string;
      title: string;
      description: string;
      duration: number;
      lessons: Array<{
        id: string;
        title: string;
        description: string;
        duration: number;
        content: string;
        videoUrl: string;
        resources: string[];
      }>;
    }>;
  };
  thumbnail?: string;
  banner?: string;
  videoPreview?: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface Enrollment {
  id: string;
  userId: string;
  workshopId: string;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  enrolledAt: Timestamp;
  completedAt?: Timestamp;
  expiresAt?: Timestamp;
  
  // Payment information with currency details
  payment: {
    amount: number;
    currency: string;
    originalAmount?: number; // Original amount in base currency
    originalCurrency?: string; // Original currency
    exchangeRate?: number; // Exchange rate used
    paymentId?: string;
    orderId?: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentMethod: 'razorpay' | 'free';
    paidAt?: Timestamp;
    
    // User location at enrollment
    userLocation?: {
      countryCode: string;
      countryName?: string;
      region?: string;
      city?: string;
      timezone?: string;
      ipAddress?: string;
    };
  };
  
  progress: {
    currentModule: number;
    completedModules: number[];
    totalModules: number;
    percentageComplete: number;
    lastAccessed: Timestamp;
  };
  
  certificate?: {
    issued: boolean;
    certificateId?: string;
    issuedAt?: Timestamp;
    downloadUrl?: string;
  };
}

export interface Payment {
  id: string;
  userId: string;
  workshopId: string;
  enrollmentId: string;
  
  // Payment details with currency information
  amount: number;
  currency: string;
  originalAmount?: number; // Original amount in base currency (INR)
  originalCurrency?: string; // Original currency (INR)
  exchangeRate?: number; // Exchange rate used for conversion
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'razorpay' | 'free';
  
  // User location at time of payment
  userLocation?: {
    countryCode: string;
    countryName?: string;
    region?: string;
    city?: string;
    timezone?: string;
    ipAddress?: string;
  };
  
  // Razorpay specific details
  razorpay?: {
    paymentId: string;
    orderId: string;
    signature?: string;
    gateway?: string;
    bank?: string;
    cardId?: string;
    method?: string;
  };
  
  // Timestamps
  createdAt: Timestamp;
  paidAt?: Timestamp;
  refundedAt?: Timestamp;
}

export interface Module {
  id: string;
  workshopId: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  content?: {
    videoUrl?: string;
    videoDuration?: number;
    transcript?: string;
    resources?: Array<{
      title: string;
      type: 'pdf' | 'link' | 'download';
      url: string;
    }>;
  };
  quiz?: {
    questions: Array<{
      question: string;
      type: 'multiple-choice' | 'true-false' | 'text';
      options?: string[];
      correctAnswer: string | number;
      explanation?: string;
    }>;
    passingScore: number;
  };
  status: 'active' | 'draft';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Database Service Class
class DatabaseService {
  // Users
  async createUser(userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<string> {
    const userRef = doc(firestore, 'users', userData.uid);
    const now = Timestamp.now();
    
    await setDoc(userRef, {
      ...userData,
      createdAt: now,
      updatedAt: now
    });
    
    return userData.uid;
  }

  async getUser(userId: string): Promise<User | null> {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as User;
    }
    return null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  // Update user geolocation data
  async updateUserGeolocation(userId: string, geolocationData: {
    countryCode: string;
    countryName?: string;
    region?: string;
    city?: string;
    timezone?: string;
    ipAddress?: string;
  }): Promise<void> {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      geolocation: {
        ...geolocationData,
        detectedAt: Timestamp.now()
      },
      updatedAt: Timestamp.now()
    });
  }

  // Get user geolocation data
  async getUserGeolocation(userId: string): Promise<User['geolocation'] | null> {
    const user = await this.getUser(userId);
    return user?.geolocation || null;
  }

  // Get analytics by country
  async getUsersByCountry(): Promise<{ [countryCode: string]: number }> {
    const usersRef = collection(firestore, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    const countryStats: { [countryCode: string]: number } = {};
    
    querySnapshot.docs.forEach(doc => {
      const userData = doc.data() as User;
      if (userData.geolocation?.countryCode) {
        const countryCode = userData.geolocation.countryCode;
        countryStats[countryCode] = (countryStats[countryCode] || 0) + 1;
      }
    });
    
    return countryStats;
  }

  // Get top countries by user count
  async getTopCountries(limit: number = 10): Promise<Array<{ countryCode: string; count: number; countryName?: string }>> {
    const countryStats = await this.getUsersByCountry();
    
    return Object.entries(countryStats)
      .map(([countryCode, count]) => ({ countryCode, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // Workshops
  async getWorkshops(status: 'active' | 'draft' | 'archived' = 'active'): Promise<Workshop[]> {
    const workshopsRef = collection(firestore, 'workshops');
    const q = query(workshopsRef, where('status', '==', status), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as Workshop);
  }

  async getWorkshop(workshopId: string): Promise<Workshop | null> {
    const workshopRef = doc(firestore, 'workshops', workshopId);
    const workshopSnap = await getDoc(workshopRef);
    
    if (workshopSnap.exists()) {
      return workshopSnap.data() as Workshop;
    }
    return null;
  }

  async getWorkshopBySlug(slug: string): Promise<Workshop | null> {
    const workshopsRef = collection(firestore, 'workshops');
    const q = query(workshopsRef, where('slug', '==', slug), where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as Workshop;
    }
    return null;
  }

  // Enrollments
  async createEnrollment(enrollmentData: Omit<Enrollment, 'id' | 'enrolledAt'>): Promise<string> {
    const enrollmentsRef = collection(firestore, 'enrollments');
    const now = Timestamp.now();
    
    const enrollmentDoc = await addDoc(enrollmentsRef, {
      ...enrollmentData,
      enrolledAt: now,
      progress: {
        currentModule: 0,
        completedModules: [],
        totalModules: 0,
        percentageComplete: 0,
        lastAccessed: now
      }
    });
    
    return enrollmentDoc.id;
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    const enrollmentsRef = collection(firestore, 'enrollments');
    const q = query(
      enrollmentsRef, 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    // Sort in memory instead of using orderBy to avoid composite index
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Enrollment))
      .sort((a, b) => b.enrolledAt.toMillis() - a.enrolledAt.toMillis());
  }

  async getEnrollment(enrollmentId: string): Promise<Enrollment | null> {
    const enrollmentRef = doc(firestore, 'enrollments', enrollmentId);
    const enrollmentSnap = await getDoc(enrollmentRef);
    
    if (enrollmentSnap.exists()) {
      return {
        id: enrollmentSnap.id,
        ...enrollmentSnap.data()
      } as Enrollment;
    }
    return null;
  }

  async updateEnrollment(enrollmentId: string, updates: Partial<Enrollment>): Promise<void> {
    const enrollmentRef = doc(firestore, 'enrollments', enrollmentId);
    await updateDoc(enrollmentRef, updates);
  }

  async isUserEnrolled(userId: string, workshopId: string): Promise<boolean> {
    const enrollmentsRef = collection(firestore, 'enrollments');
    const q = query(
      enrollmentsRef,
      where('userId', '==', userId),
      where('workshopId', '==', workshopId)
    );
    const querySnapshot = await getDocs(q);
    
    // Filter in memory instead of using where clause to avoid composite index
    return querySnapshot.docs.some(doc => {
      const data = doc.data();
      return data.status === 'active' || data.status === 'completed';
    });
  }

  // Payments
  async createPayment(paymentData: Omit<Payment, 'id' | 'createdAt'>): Promise<string> {
    const paymentsRef = collection(firestore, 'payments');
    const now = Timestamp.now();
    
    const paymentDoc = await addDoc(paymentsRef, {
      ...paymentData,
      createdAt: now
    });
    
    return paymentDoc.id;
  }

  async updatePayment(paymentId: string, updates: Partial<Payment>): Promise<void> {
    const paymentRef = doc(firestore, 'payments', paymentId);
    await updateDoc(paymentRef, updates);
  }

  async getPayment(paymentId: string): Promise<Payment | null> {
    const paymentRef = doc(firestore, 'payments', paymentId);
    const paymentSnap = await getDoc(paymentRef);
    
    if (paymentSnap.exists()) {
      return {
        id: paymentSnap.id,
        ...paymentSnap.data()
      } as Payment;
    }
    return null;
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    const paymentsRef = collection(firestore, 'payments');
    const q = query(
      paymentsRef,
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Payment))
      .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  }

  async getAllPayments(): Promise<Payment[]> {
    const paymentsRef = collection(firestore, 'payments');
    const q = query(paymentsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Payment))
      .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  }

  // Modules
  async getWorkshopModules(workshopId: string): Promise<Module[]> {
    const modulesRef = collection(firestore, 'modules');
    const q = query(
      modulesRef,
      where('workshopId', '==', workshopId)
    );
    const querySnapshot = await getDocs(q);
    
    // Filter and sort in memory instead of using composite queries
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Module))
      .filter(module => module.status === 'active')
      .sort((a, b) => a.order - b.order);
  }

  // Real-time listeners
  onUserEnrollments(userId: string, callback: (enrollments: Enrollment[]) => void) {
    const enrollmentsRef = collection(firestore, 'enrollments');
    const q = query(
      enrollmentsRef,
      where('userId', '==', userId)
    );
    
    return onSnapshot(q, 
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const enrollments = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Enrollment))
          .sort((a, b) => b.enrolledAt.toMillis() - a.enrolledAt.toMillis());
        callback(enrollments);
      },
      (error) => {
        console.error('❌ Error in onUserEnrollments listener:', error);
        // Return empty array on error to prevent UI issues
        callback([]);
      }
    );
  }

  onWorkshopUpdates(workshopId: string, callback: (workshop: Workshop | null) => void) {
    const workshopRef = doc(firestore, 'workshops', workshopId);
    
    return onSnapshot(workshopRef, 
      (doc) => {
        if (doc.exists()) {
          callback(doc.data() as Workshop);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('❌ Error in onWorkshopUpdates listener:', error);
        // Return null on error to prevent UI issues
        callback(null);
      }
    );
  }

  // Batch operations
  async enrollUserInWorkshop(
    userId: string, 
    workshopId: string, 
    paymentData?: Partial<Payment>
  ): Promise<{ enrollmentId: string; paymentId?: string }> {
    console.log('🎯 DatabaseService.enrollUserInWorkshop called with:', {
      userId,
      workshopId,
      paymentData,
      stack: new Error().stack
    });

    // Get workshop details to check if it's a paid workshop
    const workshop = await this.getWorkshop(workshopId);
    if (!workshop) {
      throw new Error('Workshop not found');
    }

    const isPaidWorkshop = workshop.price > 0;
    console.log('💰 Workshop payment check:', {
      workshopId,
      workshopTitle: workshop.title,
      price: workshop.price,
      isPaidWorkshop,
      paymentData
    });

    const batch = writeBatch(firestore);
    const now = Timestamp.now();
    
    // For paid workshops, require payment data
    if (isPaidWorkshop && !paymentData) {
      console.error('❌ No payment data provided for paid workshop enrollment');
      throw new Error('Payment data is required for paid workshop enrollment');
    }
    
    let paymentId: string | undefined;
    
    // ALWAYS create payment record for paid workshops to maintain relationship chain
    if (isPaidWorkshop) {
      const paymentsRef = collection(firestore, 'payments');
      const paymentRef = doc(paymentsRef);
      
      const payment: Omit<Payment, 'id' | 'createdAt'> = {
        userId,
        workshopId,
        enrollmentId: '', // Will be updated after enrollment creation
        amount: paymentData?.amount || workshop.price,
        currency: paymentData?.currency || 'INR',
        status: paymentData?.status || 'completed',
        paymentMethod: paymentData?.paymentMethod || 'razorpay',
        razorpay: paymentData?.razorpay,
        paidAt: paymentData?.status === 'completed' ? now : undefined,
        userLocation: paymentData?.userLocation
      };
      
      batch.set(paymentRef, {
        ...payment,
        createdAt: now
      });
      
      paymentId = paymentRef.id;
      console.log('💳 Created payment record:', paymentId);
    }
    
    // Create enrollment with proper payment reference
    const enrollmentsRef = collection(firestore, 'enrollments');
    const enrollmentRef = doc(enrollmentsRef);
    
    // Create payment object conditionally to avoid undefined values
    const paymentObject: Enrollment['payment'] = {
      amount: paymentData?.amount || (isPaidWorkshop ? workshop.price : 0),
      currency: paymentData?.currency || 'INR',
      status: paymentData?.status || (isPaidWorkshop ? 'completed' : 'completed'),
      paymentMethod: paymentData?.paymentMethod || (isPaidWorkshop ? 'razorpay' : 'free')
    };

    // Only add optional fields if they exist
    if (paymentData?.originalAmount !== undefined) {
      paymentObject.originalAmount = paymentData.originalAmount;
    }
    if (paymentData?.originalCurrency) {
      paymentObject.originalCurrency = paymentData.originalCurrency;
    }
    if (paymentData?.exchangeRate !== undefined) {
      paymentObject.exchangeRate = paymentData.exchangeRate;
    }

    // Only add paymentId and orderId if they exist
    if (paymentId) {
      paymentObject.paymentId = paymentId;
    }
    if (paymentData?.razorpay?.orderId) {
      paymentObject.orderId = paymentData.razorpay.orderId;
    }
    
    // Only add userLocation if it exists
    if (paymentData?.userLocation) {
      paymentObject.userLocation = paymentData.userLocation;
    }
    
    // Only add paidAt if it has a value
    const paidAtValue = isPaidWorkshop ? (paymentData?.status === 'completed' ? now : undefined) : now;
    if (paidAtValue) {
      paymentObject.paidAt = paidAtValue;
    }

    const enrollment: Omit<Enrollment, 'id'> = {
      userId,
      workshopId,
      status: 'active',
      enrolledAt: now,
      payment: paymentObject,
      progress: {
        currentModule: 0,
        completedModules: [],
        totalModules: 0,
        percentageComplete: 0,
        lastAccessed: now
      }
    };
    
    console.log('📝 Creating enrollment with payment reference:', {
      enrollmentId: enrollmentRef.id,
      paymentId: paymentId,
      payment: enrollment.payment,
      isPaidWorkshop
    });
    
    batch.set(enrollmentRef, enrollment);
    
    // Update payment record with enrollment ID to complete the relationship chain
    if (paymentId) {
      batch.update(doc(firestore, 'payments', paymentId), {
        enrollmentId: enrollmentRef.id
      });
      console.log('🔗 Updated payment with enrollment ID:', enrollmentRef.id);
    }
    
    await batch.commit();
    
    console.log('✅ Enrollment and payment relationship created successfully');
    return {
      enrollmentId: enrollmentRef.id,
      paymentId
    };
  }

  // Analytics
  async updateAnalytics(date: string, data: any): Promise<void> {
    const analyticsRef = doc(firestore, 'analytics', date);
    await updateDoc(analyticsRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  async getAnalytics(date: string): Promise<any> {
    const analyticsRef = doc(firestore, 'analytics', date);
    const analyticsSnap = await getDoc(analyticsRef);
    
    if (analyticsSnap.exists()) {
      return analyticsSnap.data();
    }
    return null;
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
export default databaseService; 