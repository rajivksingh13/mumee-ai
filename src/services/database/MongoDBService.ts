// MongoDB Service is currently disabled as it's not being used
// This prevents import errors for the mongodb package
// import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
// import { 
//   IDatabaseService, 
//   DatabaseConfig, 
//   User, 
//   Workshop, 
//   Enrollment, 
//   Payment, 
//   Module,
//   DataConverter 
// } from './IDatabaseService';
// import { Timestamp } from 'firebase/firestore';

// MongoDB Service is currently disabled as it's not being used
// This prevents import errors for the mongodb package
/*
export class MongoDBService implements IDatabaseService {
  private client: MongoClient;
  private db: Db;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.client = new MongoClient(config.connectionString!);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db(this.config.database || 'titliai');
      console.log('✅ MongoDB connected successfully');
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.db.admin().ping();
      return true;
    } catch {
      return false;
    }
  }

  // User operations
  async createUser(userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<string> {
    const collection = this.db.collection('users');
    const now = new Date();
    
    const user = {
      _id: userData.uid,
      ...userData,
      createdAt: now,
      updatedAt: now
    };

    await collection.insertOne(user);
    return userData.uid;
  }

  async getUser(userId: string): Promise<User | null> {
    const collection = this.db.collection('users');
    const user = await collection.findOne({ _id: userId });
    
    if (user) {
      return DataConverter.normalizeUser(user);
    }
    return null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const collection = this.db.collection('users');
    await collection.updateOne(
      { _id: userId },
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      }
    );
  }

  async deleteUser(userId: string): Promise<void> {
    const collection = this.db.collection('users');
    await collection.deleteOne({ _id: userId });
  }

  // Workshop operations
  async createWorkshop(workshopData: Omit<Workshop, 'createdAt' | 'updatedAt'>): Promise<string> {
    const collection = this.db.collection('workshops');
    const now = new Date();
    
    const workshop = {
      _id: workshopData.id,
      ...workshopData,
      createdAt: now,
      updatedAt: now
    };

    await collection.insertOne(workshop);
    return workshopData.id;
  }

  async getWorkshops(status: 'active' | 'draft' | 'archived' = 'active'): Promise<Workshop[]> {
    const collection = this.db.collection('workshops');
    const workshops = await collection.find({ status }).toArray();
    return workshops.map(w => DataConverter.normalizeWorkshop(w));
  }

  async getWorkshop(workshopId: string): Promise<Workshop | null> {
    const collection = this.db.collection('workshops');
    const workshop = await collection.findOne({ _id: workshopId });
    
    if (workshop) {
      return DataConverter.normalizeWorkshop(workshop);
    }
    return null;
  }

  async getWorkshopBySlug(slug: string): Promise<Workshop | null> {
    const collection = this.db.collection('workshops');
    const workshop = await collection.findOne({ slug, status: 'active' });
    
    if (workshop) {
      return DataConverter.normalizeWorkshop(workshop);
    }
    return null;
  }

  async updateWorkshop(workshopId: string, updates: Partial<Workshop>): Promise<void> {
    const collection = this.db.collection('workshops');
    await collection.updateOne(
      { _id: workshopId },
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      }
    );
  }

  async deleteWorkshop(workshopId: string): Promise<void> {
    const collection = this.db.collection('workshops');
    await collection.deleteOne({ _id: workshopId });
  }

  // Enrollment operations
  async createEnrollment(enrollmentData: Omit<Enrollment, 'id' | 'enrolledAt'>): Promise<string> {
    const collection = this.db.collection('enrollments');
    const now = new Date();
    
    const enrollment = {
      _id: new ObjectId().toString(),
      ...enrollmentData,
      enrolledAt: now
    };

    await collection.insertOne(enrollment);
    return enrollment._id;
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    const collection = this.db.collection('enrollments');
    const enrollments = await collection.find({ userId }).toArray();
    return enrollments.map(e => DataConverter.normalizeEnrollment(e));
  }

  async getEnrollment(enrollmentId: string): Promise<Enrollment | null> {
    const collection = this.db.collection('enrollments');
    const enrollment = await collection.findOne({ _id: enrollmentId });
    
    if (enrollment) {
      return DataConverter.normalizeEnrollment(enrollment);
    }
    return null;
  }

  async updateEnrollment(enrollmentId: string, updates: Partial<Enrollment>): Promise<void> {
    const collection = this.db.collection('enrollments');
    await collection.updateOne(
      { _id: enrollmentId },
      { $set: updates }
    );
  }

  async deleteEnrollment(enrollmentId: string): Promise<void> {
    const collection = this.db.collection('enrollments');
    await collection.deleteOne({ _id: enrollmentId });
  }

  async isUserEnrolled(userId: string, workshopId: string): Promise<boolean> {
    const collection = this.db.collection('enrollments');
    const enrollment = await collection.findOne({ 
      userId, 
      workshopId, 
      status: { $in: ['active', 'completed'] } 
    });
    return !!enrollment;
  }

  // Payment operations
  async createPayment(paymentData: Omit<Payment, 'id' | 'createdAt'>): Promise<string> {
    const collection = this.db.collection('payments');
    const now = new Date();
    
    const payment = {
      _id: new ObjectId().toString(),
      ...paymentData,
      createdAt: now
    };

    await collection.insertOne(payment);
    return payment._id;
  }

  async getPayment(paymentId: string): Promise<Payment | null> {
    const collection = this.db.collection('payments');
    const payment = await collection.findOne({ _id: paymentId });
    
    if (payment) {
      return DataConverter.normalizePayment(payment);
    }
    return null;
  }

  async updatePayment(paymentId: string, updates: Partial<Payment>): Promise<void> {
    const collection = this.db.collection('payments');
    await collection.updateOne(
      { _id: paymentId },
      { $set: updates }
    );
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    const collection = this.db.collection('payments');
    const payments = await collection.find({ userId }).toArray();
    return payments.map(p => DataConverter.normalizePayment(p));
  }

  // Module operations
  async createModule(moduleData: Omit<Module, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const collection = this.db.collection('modules');
    const now = new Date();
    
    const module = {
      _id: new ObjectId().toString(),
      ...moduleData,
      createdAt: now,
      updatedAt: now
    };

    await collection.insertOne(module);
    return module._id;
  }

  async getWorkshopModules(workshopId: string): Promise<Module[]> {
    const collection = this.db.collection('modules');
    const modules = await collection.find({ 
      workshopId, 
      status: 'active' 
    }).sort({ order: 1 }).toArray();
    return modules.map(m => DataConverter.normalizeModule(m));
  }

  async getModule(moduleId: string): Promise<Module | null> {
    const collection = this.db.collection('modules');
    const module = await collection.findOne({ _id: moduleId });
    
    if (module) {
      return DataConverter.normalizeModule(module);
    }
    return null;
  }

  async updateModule(moduleId: string, updates: Partial<Module>): Promise<void> {
    const collection = this.db.collection('modules');
    await collection.updateOne(
      { _id: moduleId },
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      }
    );
  }

  async deleteModule(moduleId: string): Promise<void> {
    const collection = this.db.collection('modules');
    await collection.deleteOne({ _id: moduleId });
  }

  // Batch operations
  async enrollUserInWorkshop(
    userId: string, 
    workshopId: string, 
    paymentData?: Partial<Payment>
  ): Promise<{ enrollmentId: string; paymentId?: string }> {
    const session = this.client.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Get workshop data
        const workshop = await this.getWorkshop(workshopId);
        if (!workshop) {
          throw new Error('Workshop not found');
        }

        // Create enrollment
        const enrollmentId = await this.createEnrollment({
          userId,
          workshopId,
          status: 'active',
          payment: {
            amount: paymentData?.amount || 0,
            currency: paymentData?.currency || 'INR',
            paymentId: paymentData?.paymentId,
            orderId: paymentData?.orderId,
            status: paymentData?.status || 'completed',
            paymentMethod: paymentData?.paymentMethod || 'free',
            paidAt: paymentData?.status === 'completed' ? new Date() : undefined
          },
          progress: {
            currentModule: 0,
            completedModules: [],
            totalModules: workshop.curriculum?.modules?.length || 0,
            percentageComplete: 0,
            lastAccessed: new Date()
          }
        });

        // Create payment record if provided
        let paymentId: string | undefined;
        if (paymentData) {
          paymentId = await this.createPayment({
            userId,
            workshopId,
            enrollmentId,
            amount: paymentData.amount || 0,
            currency: paymentData.currency || 'INR',
            status: paymentData.status || 'completed',
            paymentMethod: 'razorpay',
            razorpay: {
              paymentId: paymentData.paymentId || '',
              orderId: paymentData.orderId || ''
            }
          });
        }

        // Update user stats
        await this.updateUser(userId, {
          stats: {
            totalEnrollments: 1,
            completedWorkshops: 0,
            certificatesEarned: 0,
            totalSpent: paymentData?.amount || 0,
            preferredCurrency: paymentData?.currency || 'INR'
          }
        });

        return { enrollmentId, paymentId };
      });
    } finally {
      await session.endSession();
    }

    return { enrollmentId: '', paymentId: undefined };
  }

  // Analytics operations
  async updateAnalytics(date: string, data: any): Promise<void> {
    const collection = this.db.collection('analytics');
    await collection.updateOne(
      { date },
      { $set: data },
      { upsert: true }
    );
  }

  async getAnalytics(date: string): Promise<any> {
    const collection = this.db.collection('analytics');
    const analytics = await collection.findOne({ date });
    return analytics || {};
  }

  // Real-time listeners (not supported in MongoDB)
  onUserEnrollments(userId: string, callback: (enrollments: Enrollment[]) => void): () => void {
    // MongoDB doesn't support real-time listeners like Firestore
    // This would need to be implemented with polling or WebSockets
    console.warn('Real-time listeners not supported in MongoDB');
    return () => {};
  }

  onWorkshopUpdates(workshopId: string, callback: (workshop: Workshop | null) => void): () => void {
    // MongoDB doesn't support real-time listeners like Firestore
    // This would need to be implemented with polling or WebSockets
    console.warn('Real-time listeners not supported in MongoDB');
    return () => {};
  }
}
*/ 