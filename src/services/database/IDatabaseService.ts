import { Timestamp } from 'firebase/firestore';

// Common interfaces that work across all databases
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: Date;
    location?: string;
    bio?: string;
    interests?: string[];
    skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  };
  preferences?: {
    emailNotifications: boolean;
    marketingEmails: boolean;
    newsletter: boolean;
  };
  stats?: {
    totalEnrollments: number;
    completedWorkshops: number;
    certificatesEarned: number;
    lastActive: Timestamp | Date;
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
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  overview: {
    duration: number;
    level: string;
    format: string;
    certificate: boolean;
    description: string;
  };
  curriculum: Array<{
    topic: string;
    hours: number;
    subTopics: string[];
  }>;
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
  enrolledAt: Timestamp | Date;
  completedAt?: Timestamp | Date;
  expiresAt?: Timestamp | Date;
  payment: {
    amount: number;
    currency: string;
    paymentId?: string;
    orderId?: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentMethod: 'razorpay' | 'free';
    paidAt?: Timestamp | Date;
  };
  progress: {
    currentModule: number;
    completedModules: number[];
    totalModules: number;
    percentageComplete: number;
    lastAccessed: Timestamp | Date;
  };
  certificate?: {
    issued: boolean;
    certificateId?: string;
    issuedAt?: Timestamp | Date;
    downloadUrl?: string;
  };
}

export interface Payment {
  id: string;
  userId: string;
  workshopId: string;
  enrollmentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'razorpay' | 'free';
  razorpay?: {
    paymentId: string;
    orderId: string;
    signature?: string;
    gateway?: string;
    bank?: string;
    cardId?: string;
    method?: string;
  };
  createdAt: Timestamp | Date;
  paidAt?: Timestamp | Date;
  refundedAt?: Timestamp | Date;
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
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// Database abstraction interface
export interface IDatabaseService {
  // User operations
  createUser(userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<string>;
  getUser(userId: string): Promise<User | null>;
  updateUser(userId: string, updates: Partial<User>): Promise<void>;
  deleteUser(userId: string): Promise<void>;

  // Workshop operations
  createWorkshop(workshopData: Omit<Workshop, 'createdAt' | 'updatedAt'>): Promise<string>;
  getWorkshops(status?: 'active' | 'draft' | 'archived'): Promise<Workshop[]>;
  getWorkshop(workshopId: string): Promise<Workshop | null>;
  getWorkshopBySlug(slug: string): Promise<Workshop | null>;
  updateWorkshop(workshopId: string, updates: Partial<Workshop>): Promise<void>;
  deleteWorkshop(workshopId: string): Promise<void>;

  // Enrollment operations
  createEnrollment(enrollmentData: Omit<Enrollment, 'id' | 'enrolledAt'>): Promise<string>;
  getUserEnrollments(userId: string): Promise<Enrollment[]>;
  getEnrollment(enrollmentId: string): Promise<Enrollment | null>;
  updateEnrollment(enrollmentId: string, updates: Partial<Enrollment>): Promise<void>;
  deleteEnrollment(enrollmentId: string): Promise<void>;
  isUserEnrolled(userId: string, workshopId: string): Promise<boolean>;

  // Payment operations
  createPayment(paymentData: Omit<Payment, 'id' | 'createdAt'>): Promise<string>;
  getPayment(paymentId: string): Promise<Payment | null>;
  updatePayment(paymentId: string, updates: Partial<Payment>): Promise<void>;
  getUserPayments(userId: string): Promise<Payment[]>;

  // Module operations
  createModule(moduleData: Omit<Module, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>;
  getWorkshopModules(workshopId: string): Promise<Module[]>;
  getModule(moduleId: string): Promise<Module | null>;
  updateModule(moduleId: string, updates: Partial<Module>): Promise<void>;
  deleteModule(moduleId: string): Promise<void>;

  // Batch operations
  enrollUserInWorkshop(
    userId: string, 
    workshopId: string, 
    paymentData?: Partial<Payment>
  ): Promise<{ enrollmentId: string; paymentId?: string }>;

  // Analytics operations
  updateAnalytics(date: string, data: any): Promise<void>;
  getAnalytics(date: string): Promise<any>;

  // Real-time listeners (optional - not all databases support this)
  onUserEnrollments?(userId: string, callback: (enrollments: Enrollment[]) => void): () => void;
  onWorkshopUpdates?(workshopId: string, callback: (workshop: Workshop | null) => void): () => void;

  // Database-specific operations
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<boolean>;
}

// Database configuration interface
export interface DatabaseConfig {
  type: 'firestore' | 'mongodb';
  connectionString?: string;
  projectId?: string;
  apiKey?: string;
  authDomain?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  databaseURL?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  ssl?: boolean;
}

// Database factory
export class DatabaseFactory {
  static async createDatabase(config: DatabaseConfig): Promise<IDatabaseService> {
    switch (config.type) {
      case 'firestore':
        const { FirestoreService } = await import('./FirestoreService');
        return new FirestoreService(config);
      
      case 'mongodb':
        throw new Error('MongoDB support is currently disabled. Please use Firestore instead.');
      
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  }
}

// Utility functions for data conversion
export class DataConverter {
  static toTimestamp(date: Date | Timestamp): Timestamp | Date {
    if (date instanceof Date) {
      return Timestamp.fromDate(date);
    }
    return date;
  }

  static fromTimestamp(timestamp: Timestamp | Date): Date {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return timestamp;
  }

  static normalizeUser(user: any): User {
    return {
      ...user,
      createdAt: this.toTimestamp(user.createdAt),
      updatedAt: this.toTimestamp(user.updatedAt),
      stats: user.stats ? {
        ...user.stats,
        lastActive: this.toTimestamp(user.stats.lastActive)
      } : undefined
    };
  }

  static normalizeWorkshop(workshop: any): Workshop {
    return {
      ...workshop,
      createdAt: this.toTimestamp(workshop.createdAt),
      updatedAt: this.toTimestamp(workshop.updatedAt)
    };
  }

  static normalizeEnrollment(enrollment: any): Enrollment {
    return {
      ...enrollment,
      enrolledAt: this.toTimestamp(enrollment.enrolledAt),
      completedAt: enrollment.completedAt ? this.toTimestamp(enrollment.completedAt) : undefined,
      expiresAt: enrollment.expiresAt ? this.toTimestamp(enrollment.expiresAt) : undefined,
      payment: {
        ...enrollment.payment,
        paidAt: enrollment.payment.paidAt ? this.toTimestamp(enrollment.payment.paidAt) : undefined
      },
      progress: {
        ...enrollment.progress,
        lastAccessed: this.toTimestamp(enrollment.progress.lastAccessed)
      },
      certificate: enrollment.certificate ? {
        ...enrollment.certificate,
        issuedAt: enrollment.certificate.issuedAt ? this.toTimestamp(enrollment.certificate.issuedAt) : undefined
      } : undefined
    };
  }

  static normalizePayment(payment: any): Payment {
    return {
      ...payment,
      createdAt: this.toTimestamp(payment.createdAt),
      paidAt: payment.paidAt ? this.toTimestamp(payment.paidAt) : undefined,
      refundedAt: payment.refundedAt ? this.toTimestamp(payment.refundedAt) : undefined
    };
  }

  static normalizeModule(module: any): Module {
    return {
      ...module,
      createdAt: this.toTimestamp(module.createdAt),
      updatedAt: this.toTimestamp(module.updatedAt)
    };
  }
} 