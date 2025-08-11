import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
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
import { 
  IDatabaseService, 
  DatabaseConfig, 
  User, 
  Workshop, 
  Enrollment, 
  Payment, 
  Module,
  DataConverter 
} from './IDatabaseService';
import { firestore } from '../../config/firebase';

export class FirestoreService implements IDatabaseService {
  constructor(_config: DatabaseConfig) {
    // Config is stored but not actively used in current implementation
    // Keeping for future use when needed
  }

  async connect(): Promise<void> {
    // Firestore is automatically connected via Firebase config
    console.log('✅ Firestore connected successfully');
  }

  async disconnect(): Promise<void> {
    // Firestore handles connection management automatically
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Simple health check by trying to read a document
      const testRef = doc(firestore, 'health', 'test');
      await getDoc(testRef);
      return true;
    } catch {
      return false;
    }
  }

  // User operations
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
      return DataConverter.normalizeUser(userSnap.data() as User);
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

  async deleteUser(userId: string): Promise<void> {
    const userRef = doc(firestore, 'users', userId);
    await deleteDoc(userRef);
  }

  async getAllUsers(): Promise<User[]> {
    const usersRef = collection(firestore, 'users');
    
    try {
      const querySnapshot = await getDocs(usersRef);
      
      const users = querySnapshot.docs
        .map(doc => {
          return DataConverter.normalizeUser({
            id: doc.id,
            ...doc.data()
          } as User);
        })
        .sort((a, b) => {
          const aTime = (a.createdAt as any)?.toMillis?.() || (a.createdAt as any)?.getTime?.() || 0;
          const bTime = (b.createdAt as any)?.toMillis?.() || (b.createdAt as any)?.getTime?.() || 0;
          return bTime - aTime; // Sort by newest first
        });
      
      return users;
    } catch (error) {
      console.error('❌ FirestoreService: Error getting all users:', error);
      throw error;
    }
  }

  // Workshop operations
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

  async getWorkshops(status: 'active' | 'draft' | 'archived' = 'active'): Promise<Workshop[]> {
    const workshopsRef = collection(firestore, 'workshops');
    const q = query(workshopsRef, where('status', '==', status), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => DataConverter.normalizeWorkshop(doc.data() as Workshop));
  }

  async getWorkshop(workshopId: string): Promise<Workshop | null> {
    const workshopRef = doc(firestore, 'workshops', workshopId);
    const workshopSnap = await getDoc(workshopRef);
    
    if (workshopSnap.exists()) {
      return DataConverter.normalizeWorkshop(workshopSnap.data() as Workshop);
    }
    return null;
  }

  async getWorkshopBySlug(slug: string): Promise<Workshop | null> {
    const workshopsRef = collection(firestore, 'workshops');
    const q = query(workshopsRef, where('slug', '==', slug), where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return DataConverter.normalizeWorkshop(querySnapshot.docs[0].data() as Workshop);
    }
    return null;
  }

  async updateWorkshop(workshopId: string, updates: Partial<Workshop>): Promise<void> {
    const workshopRef = doc(firestore, 'workshops', workshopId);
    await updateDoc(workshopRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  async deleteWorkshop(workshopId: string): Promise<void> {
    const workshopRef = doc(firestore, 'workshops', workshopId);
    await deleteDoc(workshopRef);
  }

  // Enrollment operations
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
    
    try {
      const querySnapshot = await getDocs(q);
      
      // Sort in memory instead of using orderBy to avoid composite index requirement
      const enrollments = querySnapshot.docs
        .map(doc => {
          return DataConverter.normalizeEnrollment({
            id: doc.id,
            ...doc.data()
          } as Enrollment);
        })
        .sort((a, b) => {
          const aTime = (a.enrolledAt as any)?.toMillis?.() || (a.enrolledAt as any)?.getTime?.() || 0;
          const bTime = (b.enrolledAt as any)?.toMillis?.() || (b.enrolledAt as any)?.getTime?.() || 0;
          return bTime - aTime; // Sort by newest first
        });
      
      return enrollments;
    } catch (error) {
      console.error('❌ FirestoreService: Error getting enrollments:', error);
      throw error;
    }
  }

  async getAllEnrollments(): Promise<Enrollment[]> {
    const enrollmentsRef = collection(firestore, 'enrollments');
    
    try {
      const querySnapshot = await getDocs(enrollmentsRef);
      
      // Sort in memory instead of using orderBy to avoid composite index requirement
      const enrollments = querySnapshot.docs
        .map(doc => {
          return DataConverter.normalizeEnrollment({
            id: doc.id,
            ...doc.data()
          } as Enrollment);
        })
        .sort((a, b) => {
          const aTime = (a.enrolledAt as any)?.toMillis?.() || (a.enrolledAt as any)?.getTime?.() || 0;
          const bTime = (b.enrolledAt as any)?.toMillis?.() || (b.enrolledAt as any)?.getTime?.() || 0;
          return bTime - aTime; // Sort by newest first
        });
      
      return enrollments;
    } catch (error) {
      console.error('❌ FirestoreService: Error getting all enrollments:', error);
      throw error;
    }
  }

  async getEnrollment(enrollmentId: string): Promise<Enrollment | null> {
    const enrollmentRef = doc(firestore, 'enrollments', enrollmentId);
    const enrollmentSnap = await getDoc(enrollmentRef);
    
    if (enrollmentSnap.exists()) {
      return DataConverter.normalizeEnrollment({
        id: enrollmentSnap.id,
        ...enrollmentSnap.data()
      } as Enrollment);
    }
    return null;
  }

  async updateEnrollment(enrollmentId: string, updates: Partial<Enrollment>): Promise<void> {
    const enrollmentRef = doc(firestore, 'enrollments', enrollmentId);
    await updateDoc(enrollmentRef, updates);
  }

  async deleteEnrollment(enrollmentId: string): Promise<void> {
    const enrollmentRef = doc(firestore, 'enrollments', enrollmentId);
    await deleteDoc(enrollmentRef);
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

  // Payment operations
  async createPayment(paymentData: Omit<Payment, 'id' | 'createdAt'>): Promise<string> {
    const paymentsRef = collection(firestore, 'payments');
    const now = Timestamp.now();
    
    const paymentDoc = await addDoc(paymentsRef, {
      ...paymentData,
      createdAt: now
    });
    
    return paymentDoc.id;
  }

  async getPayment(paymentId: string): Promise<Payment | null> {
    const paymentRef = doc(firestore, 'payments', paymentId);
    const paymentSnap = await getDoc(paymentRef);
    
    if (paymentSnap.exists()) {
      return DataConverter.normalizePayment({
        id: paymentSnap.id,
        ...paymentSnap.data()
      } as Payment);
    }
    return null;
  }

  async updatePayment(paymentId: string, updates: Partial<Payment>): Promise<void> {
    const paymentRef = doc(firestore, 'payments', paymentId);
    await updateDoc(paymentRef, updates);
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    try {
      const paymentsRef = collection(firestore, 'payments');
      const q = query(
        paymentsRef,
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Sort in memory instead of using orderBy to avoid composite index requirement
      const payments = querySnapshot.docs
        .map(doc => DataConverter.normalizePayment({
          id: doc.id,
          ...doc.data()
        } as Payment))
        .sort((a, b) => {
          const aTime = (a.createdAt as any)?.toMillis?.() || (a.createdAt as any)?.getTime?.() || 0;
          const bTime = (b.createdAt as any)?.toMillis?.() || (b.createdAt as any)?.getTime?.() || 0;
          return bTime - aTime; // Sort by newest first
        });
      
      return payments;
    } catch (error) {
      console.error('Error getting user payments:', error);
      return [];
    }
  }

  async getAllPayments(): Promise<Payment[]> {
    try {
      const paymentsRef = collection(firestore, 'payments');
      const q = query(paymentsRef, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => DataConverter.normalizePayment({
        id: doc.id,
        ...doc.data()
      } as Payment));
    } catch (error) {
      console.error('Error getting all payments:', error);
      return [];
    }
  }

  // Module operations
  async createModule(moduleData: Omit<Module, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const modulesRef = collection(firestore, 'modules');
    const now = Timestamp.now();
    
    const moduleDoc = await addDoc(modulesRef, {
      ...moduleData,
      createdAt: now,
      updatedAt: now
    });
    
    return moduleDoc.id;
  }

  async getWorkshopModules(workshopId: string): Promise<Module[]> {
    const modulesRef = collection(firestore, 'modules');
    const q = query(
      modulesRef,
      where('workshopId', '==', workshopId)
    );
    const querySnapshot = await getDocs(q);
    
    // Filter and sort in memory instead of using composite queries
    return querySnapshot.docs
      .map(doc => DataConverter.normalizeModule({
        id: doc.id,
        ...doc.data()
      } as Module))
      .filter(module => module.status === 'active')
      .sort((a, b) => a.order - b.order);
  }

  async getModule(moduleId: string): Promise<Module | null> {
    const moduleRef = doc(firestore, 'modules', moduleId);
    const moduleSnap = await getDoc(moduleRef);
    
    if (moduleSnap.exists()) {
      return DataConverter.normalizeModule({
        id: moduleSnap.id,
        ...moduleSnap.data()
      } as Module);
    }
    return null;
  }

  async updateModule(moduleId: string, updates: Partial<Module>): Promise<void> {
    const moduleRef = doc(firestore, 'modules', moduleId);
    await updateDoc(moduleRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  async deleteModule(moduleId: string): Promise<void> {
    const moduleRef = doc(firestore, 'modules', moduleId);
    await deleteDoc(moduleRef);
  }

  // Batch operations
  async enrollUserInWorkshop(
    userId: string, 
    workshopId: string, 
    paymentData?: Partial<Payment>
  ): Promise<{ enrollmentId: string; paymentId?: string }> {
    console.log('🎯 FirestoreService.enrollUserInWorkshop called with:', {
      userId,
      workshopId,
      paymentData
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
      isPaidWorkshop
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
        originalAmount: paymentData?.originalAmount || paymentData?.amount || workshop.price,
        originalCurrency: paymentData?.originalCurrency || 'INR',
        exchangeRate: paymentData?.exchangeRate || 1,
        status: paymentData?.status || 'completed',
        paymentMethod: paymentData?.paymentMethod || 'razorpay',
        userLocation: paymentData?.userLocation,
        razorpay: paymentData?.razorpay,
        paidAt: paymentData?.status === 'completed' ? now : undefined
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
    
    // Build payment object conditionally to avoid undefined values
    const paymentObject: any = {
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
    
    // Only add paymentId if it exists (for paid workshops)
    if (paymentId) {
      paymentObject.paymentId = paymentId;
    }
    
    // Only add orderId if it exists
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
      isPaidWorkshop,
      paymentObject
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

  // Analytics operations
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

  // Real-time listeners (Firestore's strength!)
  onUserEnrollments(userId: string, callback: (enrollments: Enrollment[]) => void): () => void {
    const enrollmentsRef = collection(firestore, 'enrollments');
    const q = query(
      enrollmentsRef,
      where('userId', '==', userId)
    );
    
    return onSnapshot(q, 
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const enrollments = querySnapshot.docs
          .map(doc => DataConverter.normalizeEnrollment({
            id: doc.id,
            ...doc.data()
          } as Enrollment))
          .sort((a, b) => {
            const aTime = (a.enrolledAt as any)?.toMillis?.() || (a.enrolledAt as any)?.getTime?.() || 0;
            const bTime = (b.enrolledAt as any)?.toMillis?.() || (b.enrolledAt as any)?.getTime?.() || 0;
            return bTime - aTime; // Sort by newest first
          });
        callback(enrollments);
      },
      (error) => {
        console.error('❌ Error in FirestoreService onUserEnrollments listener:', error);
        // Return empty array on error to prevent UI issues
        callback([]);
      }
    );
  }

  onWorkshopUpdates(workshopId: string, callback: (workshop: Workshop | null) => void): () => void {
    const workshopRef = doc(firestore, 'workshops', workshopId);
    
    return onSnapshot(workshopRef, 
      (doc) => {
        if (doc.exists()) {
          callback(DataConverter.normalizeWorkshop(doc.data() as Workshop));
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('❌ Error in FirestoreService onWorkshopUpdates listener:', error);
        // Return null on error to prevent UI issues
        callback(null);
      }
    );
  }
} 