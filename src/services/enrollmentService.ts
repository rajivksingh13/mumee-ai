import { databaseService, Enrollment, Workshop } from './databaseService';
import { Timestamp } from 'firebase/firestore';

export interface EnrollmentProgress {
  currentModule: number;
  completedModules: number[];
  totalModules: number;
  percentageComplete: number;
  lastAccessed: Timestamp;
}

export interface EnrollmentStatus {
  isEnrolled: boolean;
  enrollment: Enrollment | null;
  progress: EnrollmentProgress | null;
  canAccess: boolean;
  isCompleted: boolean;
}

class EnrollmentService {
  /**
   * Enroll user in a workshop
   */
  async enrollUser(
    userId: string,
    workshopId: string,
    _workshop: Workshop,
    paymentData?: {
      amount: number;
      currency: string;
      status: 'pending' | 'completed' | 'failed';
      paymentMethod: 'razorpay' | 'free';
      paymentId?: string;
      orderId?: string;
    }
  ): Promise<{ enrollmentId: string; paymentId?: string }> {
    try {
      console.log('🎯 EnrollmentService.enrollUser called with:', {
        userId,
        workshopId,
        paymentData,
        stack: new Error().stack
      });

      // Check if user is already enrolled
      const isEnrolled = await this.isUserEnrolled(userId, workshopId);
      if (isEnrolled) {
        console.log(`User ${userId} is already enrolled in workshop ${workshopId}`);
        // Return existing enrollment info
        const existingEnrollment = await this.getUserEnrollment(userId, workshopId);
        return { 
          enrollmentId: existingEnrollment?.id || '', 
          paymentId: existingEnrollment?.payment?.paymentId 
        };
      }

      console.log('✅ Creating new enrollment for user:', userId, 'in workshop:', workshopId);

      // Create enrollment using database service
      const result = await databaseService.enrollUserInWorkshop(
        userId,
        workshopId,
        paymentData ? {
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: paymentData.status,
          paymentMethod: paymentData.paymentMethod,
          razorpay: {
            paymentId: paymentData.paymentId || '',
            orderId: paymentData.orderId || ''
          }
        } : undefined
      );

      // Update user stats
      await this.updateUserEnrollmentStats(userId);

      console.log(`✅ Successfully enrolled user ${userId} in workshop ${workshopId}, there is no flow of payment using razor pay has been triggered here, fix the Payment flow using razor pay for enrollment of paid workshops`);
      return result;
    } catch (error) {
      console.error('❌ Error enrolling user:', error);
      throw error;
    }
  }

  /**
   * Check if user is enrolled in a workshop
   */
  async isUserEnrolled(userId: string, workshopId: string): Promise<boolean> {
    try {
      return await databaseService.isUserEnrolled(userId, workshopId);
    } catch (error) {
      console.error('Error checking enrollment status:', error);
      return false;
    }
  }

  /**
   * Get user's enrollment for a specific workshop
   */
  async getUserEnrollment(userId: string, workshopId: string): Promise<Enrollment | null> {
    try {
      const enrollments = await databaseService.getUserEnrollments(userId);
      return enrollments.find(e => e.workshopId === workshopId) || null;
    } catch (error) {
      console.error('Error getting user enrollment:', error);
      return null;
    }
  }

  /**
   * Get comprehensive enrollment status
   */
  async getEnrollmentStatus(userId: string, workshopId: string): Promise<EnrollmentStatus> {
    try {
      const enrollment = await this.getUserEnrollment(userId, workshopId);
      
      if (!enrollment) {
        return {
          isEnrolled: false,
          enrollment: null,
          progress: null,
          canAccess: false,
          isCompleted: false
        };
      }

      const canAccess = enrollment.status === 'active' && 
                       enrollment.payment.status === 'completed';
      
      const isCompleted = enrollment.status === 'completed';

      return {
        isEnrolled: true,
        enrollment,
        progress: enrollment.progress,
        canAccess,
        isCompleted
      };
    } catch (error) {
      console.error('Error getting enrollment status:', error);
      return {
        isEnrolled: false,
        enrollment: null,
        progress: null,
        canAccess: false,
        isCompleted: false
      };
    }
  }

  /**
   * Update enrollment progress
   */
  async updateProgress(
    enrollmentId: string,
    progress: Partial<EnrollmentProgress>
  ): Promise<void> {
    try {
      const enrollment = await databaseService.getEnrollment(enrollmentId);
      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      const updatedProgress = {
        ...enrollment.progress,
        ...progress,
        lastAccessed: Timestamp.now()
      };

      await databaseService.updateEnrollment(enrollmentId, {
        progress: updatedProgress
      });
    } catch (error) {
      console.error('Error updating enrollment progress:', error);
      throw error;
    }
  }

  /**
   * Mark module as completed
   */
  async completeModule(
    enrollmentId: string,
    moduleIndex: number,
    totalModules: number
  ): Promise<void> {
    try {
      const enrollment = await databaseService.getEnrollment(enrollmentId);
      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      const completedModules = [...enrollment.progress.completedModules];
      if (!completedModules.includes(moduleIndex)) {
        completedModules.push(moduleIndex);
      }

      const percentageComplete = Math.round((completedModules.length / totalModules) * 100);

      await this.updateProgress(enrollmentId, {
        currentModule: moduleIndex + 1,
        completedModules,
        totalModules,
        percentageComplete
      });
    } catch (error) {
      console.error('Error completing module:', error);
      throw error;
    }
  }

  /**
   * Complete workshop
   */
  async completeWorkshop(enrollmentId: string): Promise<void> {
    try {
      await databaseService.updateEnrollment(enrollmentId, {
        status: 'completed',
        completedAt: Timestamp.now()
      });

      // Update user stats
      const enrollment = await databaseService.getEnrollment(enrollmentId);
      if (enrollment) {
        await this.updateUserEnrollmentStats(enrollment.userId);
      }
    } catch (error) {
      console.error('Error completing workshop:', error);
      throw error;
    }
  }

  /**
   * Get all user enrollments
   */
  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    try {
      return await databaseService.getUserEnrollments(userId);
    } catch (error) {
      console.error('Error getting user enrollments:', error);
      return [];
    }
  }

  /**
   * Cancel enrollment
   */
  async cancelEnrollment(enrollmentId: string): Promise<void> {
    try {
      await databaseService.updateEnrollment(enrollmentId, {
        status: 'cancelled'
      });
    } catch (error) {
      console.error('Error cancelling enrollment:', error);
      throw error;
    }
  }

  /**
   * Update user enrollment statistics
   */
  private async updateUserEnrollmentStats(userId: string): Promise<void> {
    try {
      const enrollments = await this.getUserEnrollments(userId);
      const totalEnrollments = enrollments.length;
      const completedWorkshops = enrollments.filter(e => e.status === 'completed').length;
      const certificatesEarned = enrollments.filter(e => e.certificate?.issued).length;

      await databaseService.updateUser(userId, {
        stats: {
          totalEnrollments,
          completedWorkshops,
          certificatesEarned,
          lastActive: Timestamp.now()
        }
      });
    } catch (error) {
      console.error('Error updating user enrollment stats:', error);
    }
  }

  /**
   * Migrate localStorage enrollments to Firestore
   */
  async migrateLocalStorageEnrollments(_userId: string, _specificWorkshopId?: string): Promise<void> {
    try {
      // DISABLED: Migration is causing duplicate enrollments
      // Only allow manual enrollment through the UI
      console.log('Migration disabled to prevent duplicate enrollments');
      return;
      
      // Original migration code (disabled)
      /*
      const localStorageEnrollments = [
        { key: 'enrolled_beginner', workshopId: 'beginner-workshop' },
        { key: 'enrolled_foundation', workshopId: 'foundation-workshop' },
        { key: 'enrolled_advanced', workshopId: 'advanced-workshop' }
      ];

      // If specific workshop is provided, only migrate that one
      const enrollmentsToCheck = specificWorkshopId 
        ? localStorageEnrollments.filter(e => e.workshopId === specificWorkshopId)
        : localStorageEnrollments;

      for (const { key, workshopId } of enrollmentsToCheck) {
        const isEnrolled = localStorage.getItem(key) === 'true';
        
        if (isEnrolled) {
          // Check if already enrolled in Firestore
          const firestoreEnrolled = await this.isUserEnrolled(userId, workshopId);
          
          if (!firestoreEnrolled) {
            // Get workshop data
            const workshop = await databaseService.getWorkshop(workshopId);
            if (workshop) {
              // Create enrollment in Firestore
              await this.enrollUser(userId, workshopId, workshop, {
                amount: workshop.price,
                currency: workshop.currency,
                status: 'completed',
                paymentMethod: workshop.price === 0 ? 'free' : 'razorpay'
              });
              
              console.log(`Migrated enrollment for workshop: ${workshopId}`);
            }
          }
        }
      }
      */
    } catch (error) {
      console.error('Error migrating localStorage enrollments:', error);
    }
  }

  /**
   * Get enrollment analytics
   */
  async getEnrollmentAnalytics(userId: string): Promise<{
    totalEnrollments: number;
    completedWorkshops: number;
    certificatesEarned: number;
    averageProgress: number;
    recentEnrollments: Enrollment[];
  }> {
    try {
      const enrollments = await this.getUserEnrollments(userId);
      const totalEnrollments = enrollments.length;
      const completedWorkshops = enrollments.filter(e => e.status === 'completed').length;
      const certificatesEarned = enrollments.filter(e => e.certificate?.issued).length;
      
      const averageProgress = enrollments.length > 0 
        ? enrollments.reduce((sum, e) => sum + e.progress.percentageComplete, 0) / enrollments.length
        : 0;

      const recentEnrollments = enrollments
        .sort((a, b) => b.enrolledAt.toMillis() - a.enrolledAt.toMillis())
        .slice(0, 5);

      return {
        totalEnrollments,
        completedWorkshops,
        certificatesEarned,
        averageProgress,
        recentEnrollments
      };
    } catch (error) {
      console.error('Error getting enrollment analytics:', error);
      return {
        totalEnrollments: 0,
        completedWorkshops: 0,
        certificatesEarned: 0,
        averageProgress: 0,
        recentEnrollments: []
      };
    }
  }
}

// Export singleton instance
export const enrollmentService = new EnrollmentService();
export default enrollmentService;