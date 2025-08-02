import { databaseService } from './databaseService';

export interface CurrencyAnalytics {
  totalRevenue: {
    INR: number;
    USD: number;
    EUR: number;
    GBP: number;
  };
  enrollmentsByCurrency: {
    INR: number;
    USD: number;
    EUR: number;
    GBP: number;
  };
  averageOrderValue: {
    INR: number;
    USD: number;
    EUR: number;
    GBP: number;
  };
  topCountries: Array<{
    countryCode: string;
    countryName: string;
    enrollments: number;
    revenue: number;
    currency: string;
  }>;
  exchangeRates: {
    USD_TO_INR: number;
    EUR_TO_INR: number;
    GBP_TO_INR: number;
  };
}

export interface PaymentAnalytics {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  totalRevenue: number;
  currencyBreakdown: {
    [currency: string]: {
      count: number;
      amount: number;
    };
  };
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    currency: string;
  }>;
}

class AnalyticsService {
  /**
   * Get currency-based analytics
   */
  async getCurrencyAnalytics(): Promise<CurrencyAnalytics> {
    try {
      const payments = await databaseService.getAllPayments();
      
      const analytics: CurrencyAnalytics = {
        totalRevenue: { INR: 0, USD: 0, EUR: 0, GBP: 0 },
        enrollmentsByCurrency: { INR: 0, USD: 0, EUR: 0, GBP: 0 },
        averageOrderValue: { INR: 0, USD: 0, EUR: 0, GBP: 0 },
        topCountries: [],
        exchangeRates: {
          USD_TO_INR: 83.5,
          EUR_TO_INR: 90.0,
          GBP_TO_INR: 105.0
        }
      };

      // Process payments
      const countryStats: { [key: string]: { enrollments: number; revenue: number; currency: string } } = {};
      
      payments.forEach(payment => {
        if (payment.status === 'completed') {
          // Update revenue by currency
          const currency = payment.currency as keyof typeof analytics.totalRevenue;
          if (currency in analytics.totalRevenue) {
            analytics.totalRevenue[currency] += payment.amount;
            analytics.enrollmentsByCurrency[currency]++;
          }

          // Update country statistics
          if (payment.userLocation?.countryCode) {
            const countryCode = payment.userLocation.countryCode;
            if (!countryStats[countryCode]) {
              countryStats[countryCode] = {
                enrollments: 0,
                revenue: 0,
                currency: payment.currency
              };
            }
            countryStats[countryCode].enrollments++;
            countryStats[countryCode].revenue += payment.amount;
          }
        }
      });

      // Calculate average order values
      Object.keys(analytics.totalRevenue).forEach(currency => {
        const key = currency as keyof typeof analytics.totalRevenue;
        if (analytics.enrollmentsByCurrency[key] > 0) {
          analytics.averageOrderValue[key] = analytics.totalRevenue[key] / analytics.enrollmentsByCurrency[key];
        }
      });

      // Get top countries
      analytics.topCountries = Object.entries(countryStats)
        .map(([countryCode, stats]) => ({
          countryCode,
          countryName: this.getCountryName(countryCode),
          enrollments: stats.enrollments,
          revenue: stats.revenue,
          currency: stats.currency
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      return analytics;
    } catch (error) {
      console.error('Error getting currency analytics:', error);
      throw error;
    }
  }

  /**
   * Get payment analytics
   */
  async getPaymentAnalytics(): Promise<PaymentAnalytics> {
    try {
      const payments = await databaseService.getAllPayments();
      
      const analytics: PaymentAnalytics = {
        totalPayments: payments.length,
        successfulPayments: payments.filter(p => p.status === 'completed').length,
        failedPayments: payments.filter(p => p.status === 'failed').length,
        totalRevenue: 0,
        currencyBreakdown: {},
        monthlyRevenue: []
      };

      // Calculate total revenue and currency breakdown
      payments.forEach(payment => {
        if (payment.status === 'completed') {
          analytics.totalRevenue += payment.amount;
          
          if (!analytics.currencyBreakdown[payment.currency]) {
            analytics.currencyBreakdown[payment.currency] = { count: 0, amount: 0 };
          }
          analytics.currencyBreakdown[payment.currency].count++;
          analytics.currencyBreakdown[payment.currency].amount += payment.amount;
        }
      });

      // Calculate monthly revenue
      const monthlyData: { [key: string]: { revenue: number; currency: string } } = {};
      
      payments.forEach(payment => {
        if (payment.status === 'completed' && payment.paidAt) {
          const month = payment.paidAt.toDate().toISOString().slice(0, 7); // YYYY-MM
          if (!monthlyData[month]) {
            monthlyData[month] = { revenue: 0, currency: payment.currency };
          }
          monthlyData[month].revenue += payment.amount;
        }
      });

      analytics.monthlyRevenue = Object.entries(monthlyData)
        .map(([month, data]) => ({
          month,
          revenue: data.revenue,
          currency: data.currency
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

      return analytics;
    } catch (error) {
      console.error('Error getting payment analytics:', error);
      throw error;
    }
  }

  /**
   * Get user spending analytics
   */
  async getUserSpendingAnalytics(userId: string): Promise<{
    totalSpent: number;
    preferredCurrency: string;
    enrollments: number;
    averageSpending: number;
    currencyBreakdown: { [currency: string]: number };
  }> {
    try {
      const userPayments = await databaseService.getUserPayments(userId);
      const successfulPayments = userPayments.filter(p => p.status === 'completed');
      
      const analytics = {
        totalSpent: 0,
        preferredCurrency: 'INR',
        enrollments: successfulPayments.length,
        averageSpending: 0,
        currencyBreakdown: {} as { [currency: string]: number }
      };

      // Calculate spending by currency
      successfulPayments.forEach(payment => {
        analytics.totalSpent += payment.amount;
        
        if (!analytics.currencyBreakdown[payment.currency]) {
          analytics.currencyBreakdown[payment.currency] = 0;
        }
        analytics.currencyBreakdown[payment.currency] += payment.amount;
      });

      // Determine preferred currency
      if (Object.keys(analytics.currencyBreakdown).length > 0) {
        analytics.preferredCurrency = Object.entries(analytics.currencyBreakdown)
          .sort(([, a], [, b]) => b - a)[0][0];
      }

      // Calculate average spending
      if (analytics.enrollments > 0) {
        analytics.averageSpending = analytics.totalSpent / analytics.enrollments;
      }

      return analytics;
    } catch (error) {
      console.error('Error getting user spending analytics:', error);
      throw error;
    }
  }

  /**
   * Update user spending statistics
   */
  async updateUserSpendingStats(userId: string): Promise<void> {
    try {
      const spendingAnalytics = await this.getUserSpendingAnalytics(userId);
      
      await databaseService.updateUser(userId, {
        stats: {
          totalEnrollments: 0,
          completedWorkshops: 0,
          certificatesEarned: 0,
          totalSpent: spendingAnalytics.totalSpent,
          preferredCurrency: spendingAnalytics.preferredCurrency
        }
      });
    } catch (error) {
      console.error('Error updating user spending stats:', error);
    }
  }

  /**
   * Get country name from country code
   */
  private getCountryName(countryCode: string): string {
    const countryNames: { [key: string]: string } = {
      'IN': 'India',
      'US': 'United States',
      'GB': 'United Kingdom',
      'CA': 'Canada',
      'AU': 'Australia',
      'DE': 'Germany',
      'FR': 'France',
      'JP': 'Japan',
      'SG': 'Singapore',
      'AE': 'United Arab Emirates'
    };
    
    return countryNames[countryCode] || countryCode;
  }
}

export const analyticsService = new AnalyticsService(); 