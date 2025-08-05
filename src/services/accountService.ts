import { getDatabaseService } from '../config/database';
import { User, Enrollment, Payment, Workshop } from './databaseService';

export interface AccountStats {
  totalEnrollments: number;
  completedWorkshops: number;
  certificatesEarned: number;
  totalSpent: number;
  aiTokens: number;
  preferredCurrency: string;
}

export interface AccountData {
  user: User | null;
  enrollments: Enrollment[];
  payments: Payment[];
  workshops: Workshop[];
  stats: AccountStats;
  isLoading: boolean;
  error: string | null;
}

class AccountService {
  /**
   * Get comprehensive account data for the user
   */
  async getAccountData(userId: string): Promise<AccountData> {
    try {
      const db = await getDatabaseService();
      
      // Get user profile
      const user = await db.getUser(userId);
      
      // Get user enrollments with error handling for index issues
      let enrollments: any[] = [];
      try {
        enrollments = await db.getUserEnrollments(userId);
      } catch (enrollmentError) {
        console.warn('⚠️ Index error when fetching enrollments, using fallback:', enrollmentError);
        // Return empty enrollments array as fallback
        enrollments = [];
      }
      
      // Get workshop details for enrollments
      const workshopIds = enrollments.map(e => e.workshopId);
      const workshops = await Promise.all(
        workshopIds.map(async (id) => {
          const workshop = await db.getWorkshop(id);
          return workshop;
        })
      );
      
      // Get payment history
      const payments = await this.getUserPayments(userId);
      
      // Calculate stats
      const stats = this.calculateStats(enrollments, payments, user);
      
      const result = {
        user: user as any,
        enrollments,
        payments,
        workshops: workshops.filter(w => w !== null) as any[],
        stats,
        isLoading: false,
        error: null
      };
      
      return result;
    } catch (error) {
      console.error('❌ Error fetching account data:', error);
      
      // Check if it's an index error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('index') || errorMessage.includes('Index')) {
        console.log('🔧 Index error detected, providing fallback data');
        return {
          user: null,
          enrollments: [],
          payments: [],
          workshops: [],
          stats: this.getDefaultStats(),
          isLoading: false,
          error: 'Database index is being created. Please try again in a few minutes.'
        };
      }
      
      return {
        user: null,
        enrollments: [],
        payments: [],
        workshops: [],
        stats: this.getDefaultStats(),
        isLoading: false,
        error: errorMessage
      };
    }
  }

  /**
   * Get user payment history
   */
  private async getUserPayments(userId: string): Promise<Payment[]> {
    try {
      const db = await getDatabaseService();
      const payments = await db.getUserPayments(userId);
      
      // If no payments found, try to create them from enrollment data
      if (payments.length === 0) {
        console.log('🔍 No payments found in payments collection, checking enrollments...');
        const enrollments = await db.getUserEnrollments(userId);
        
        // Create payment records from enrollment data for paid workshops
        const createdPayments = await this.createPaymentsFromEnrollments(userId, enrollments);
        if (createdPayments.length > 0) {
          console.log(`✅ Created ${createdPayments.length} payment records from enrollments`);
          return createdPayments;
        }
      }
      
      return payments as any;
    } catch (error) {
      console.error('❌ Error fetching payments:', error);
      return [];
    }
  }

  /**
   * Create payment records from enrollment data
   */
  private async createPaymentsFromEnrollments(userId: string, enrollments: any[]): Promise<Payment[]> {
    try {
      const db = await getDatabaseService();
      const payments: Payment[] = [];
      
      for (const enrollment of enrollments) {
        // Skip if enrollment already has a payment record
        if (enrollment.payment?.paymentId) {
          continue;
        }
        
        // Get workshop details
        const workshop = await db.getWorkshop(enrollment.workshopId);
        if (!workshop || workshop.price === 0) {
          continue; // Skip free workshops
        }
        
        // Create payment record
        const paymentData: Omit<Payment, 'id' | 'createdAt'> = {
          userId,
          workshopId: enrollment.workshopId,
          enrollmentId: enrollment.id,
          amount: enrollment.payment?.amount || workshop.price,
          currency: enrollment.payment?.currency || 'INR',
          status: enrollment.payment?.status || 'completed',
          paymentMethod: enrollment.payment?.paymentMethod || 'razorpay',
          paidAt: enrollment.payment?.paidAt || enrollment.enrolledAt,
          userLocation: enrollment.payment?.userLocation
        };
        
        try {
          const paymentId = await db.createPayment(paymentData);
          console.log(`✅ Created payment record: ${paymentId} for enrollment: ${enrollment.id}`);
          
          // Add to payments array
          payments.push({
            id: paymentId,
            ...paymentData,
            createdAt: enrollment.enrolledAt
          } as Payment);
        } catch (paymentError) {
          console.error(`❌ Error creating payment for enrollment ${enrollment.id}:`, paymentError);
        }
      }
      
      return payments;
    } catch (error) {
      console.error('❌ Error creating payments from enrollments:', error);
      return [];
    }
  }

  /**
   * Calculate account statistics
   */
  private calculateStats(enrollments: any[], payments: Payment[], user: any): AccountStats {
    // Debug enrollment details
    enrollments.forEach((enrollment, index) => {
      console.log(`📊 Enrollment ${index}:`, {
        id: enrollment.id,
        status: enrollment.status,
        workshopId: enrollment.workshopId,
        certificate: enrollment.certificate
      });
    });
    
    const totalEnrollments = enrollments.length;
    const completedWorkshops = enrollments.filter(e => e.status === 'completed').length;
    const certificatesEarned = enrollments.filter(e => e.certificate?.issued).length;
    const totalSpent = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    // Calculate AI tokens based on activity (mock calculation for now)
    const aiTokens = this.calculateAITokens(enrollments);
    
    const preferredCurrency = user?.stats?.preferredCurrency || 'INR';

    const stats = {
      totalEnrollments,
      completedWorkshops,
      certificatesEarned,
      totalSpent,
      aiTokens,
      preferredCurrency
    };
    
    return stats;
  }

  /**
   * Calculate AI tokens based on user activity
   */
  private calculateAITokens(enrollments: any[]): number {
    // Mock calculation based on enrollments and activity
    const baseTokens = 10;
    const enrollmentBonus = enrollments.length * 5;
    const completedBonus = enrollments.filter(e => e.status === 'completed').length * 10;
    
    return baseTokens + enrollmentBonus + completedBonus;
  }

  /**
   * Get default stats when data is not available
   */
  private getDefaultStats(): AccountStats {
    return {
      totalEnrollments: 0,
      completedWorkshops: 0,
      certificatesEarned: 0,
      totalSpent: 0,
      aiTokens: 0,
      preferredCurrency: 'INR'
    };
  }

  /**
   * Get user's recent activity
   */
  async getRecentActivity(userId: string): Promise<any[]> {
    try {
      const db = await getDatabaseService();
      const enrollments = await db.getUserEnrollments(userId);
      
      // Sort by last accessed and return recent ones
      return enrollments
        .filter(e => e.progress?.lastAccessed)
        .sort((a, b) => {
          const aTime = (a.progress?.lastAccessed as any)?.toMillis?.() || 
                       (a.progress?.lastAccessed as any)?.getTime?.() || 0;
          const bTime = (b.progress?.lastAccessed as any)?.toMillis?.() || 
                       (b.progress?.lastAccessed as any)?.getTime?.() || 0;
          return bTime - aTime;
        })
        .slice(0, 5);
    } catch (error) {
      console.error('❌ Error fetching recent activity:', error);
      return [];
    }
  }

  /**
   * Get user's learning progress
   */
  async getLearningProgress(userId: string): Promise<{
    totalModules: number;
    completedModules: number;
    averageProgress: number;
  }> {
    try {
      const enrollments = await this.getAccountData(userId);
      
      let totalModules = 0;
      let completedModules = 0;
      
      enrollments.enrollments.forEach(enrollment => {
        totalModules += enrollment.progress?.totalModules || 0;
        completedModules += enrollment.progress?.completedModules?.length || 0;
      });
      
      const averageProgress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
      
      return {
        totalModules,
        completedModules,
        averageProgress: Math.round(averageProgress)
      };
    } catch (error) {
      console.error('❌ Error calculating learning progress:', error);
      return {
        totalModules: 0,
        completedModules: 0,
        averageProgress: 0
      };
    }
  }
}

export const accountService = new AccountService(); 