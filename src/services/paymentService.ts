import { buildApiUrl, API_CONFIG } from '../config/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number;
  currency: string;
  courseId: string;
  courseTitle: string;
  userName: string;
  userEmail: string;
  userId: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
}

class PaymentService {
  /**
   * Test configuration and environment variables
   */
  testConfiguration(): void {
    console.log('🔧 Testing payment service configuration...');
    console.log('🔑 VITE_RAZORPAY_KEY_ID:', import.meta.env.VITE_RAZORPAY_KEY_ID ? '✅ Configured' : '❌ Not configured');
    console.log('🌐 VITE_API_URL (dev):', import.meta.env.VITE_API_URL || 'Not set');
    console.log('🌐 VITE_API_BASE_URL (prod):', import.meta.env.VITE_API_BASE_URL || 'Not set');
    console.log('🔧 API Base URL:', API_CONFIG.BASE_URL);
    console.log('🌍 Current hostname:', window.location.hostname);
  }

  /**
   * Initialize Razorpay script
   */
  private loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('🔍 Loading Razorpay script...');
      
      if (window.Razorpay) {
        console.log('✅ Razorpay already loaded');
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('✅ Razorpay script loaded successfully');
        resolve();
      };
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay script');
        reject(new Error('Failed to load Razorpay script'));
      };
      document.head.appendChild(script);
    });
  }

  /**
   * Create a Razorpay order
   */
  private async createOrder(options: PaymentOptions): Promise<any> {
    try {
      console.log('🔍 Creating Razorpay order with options:', options);
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PAYMENT.CREATE_ORDER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: options.amount * 100, // Convert to paise
          currency: options.currency,
          courseId: options.courseId,
        }),
      });

      console.log('📡 Order creation response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Order creation failed:', errorText);
        throw new Error(`Failed to create order: ${errorText}`);
      }

      const orderData = await response.json();
      console.log('✅ Order created successfully:', orderData);
      return orderData;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw error;
    }
  }

  /**
   * Verify payment signature
   */
  private async verifyPayment(paymentData: any): Promise<PaymentResult> {
    try {
      console.log('🔍 Verifying payment with data:', paymentData);
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PAYMENT.VERIFY), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_signature: paymentData.razorpay_signature,
          courseId: paymentData.courseId,
          userId: paymentData.userId,
        }),
      });

      console.log('📡 Payment verification response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Payment verification failed:', errorText);
        throw new Error(`Payment verification failed: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Payment verified successfully:', result);
      return {
        success: result.success,
        paymentId: result.paymentId,
        orderId: result.orderId,
      };
    } catch (error) {
      console.error('❌ Error verifying payment:', error);
      return {
        success: false,
        error: 'Payment verification failed',
      };
    }
  }

  /**
   * Process payment using Razorpay
   */
  async processPayment(options: PaymentOptions): Promise<PaymentResult> {
    try {
      console.log('🚀 Starting payment process with options:', options);
      
      // Test configuration
      this.testConfiguration();
      
      // Check if Razorpay key is configured
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      console.log('🔑 Razorpay key configured:', !!razorpayKey);
      
      if (!razorpayKey) {
        console.error('❌ Razorpay key is not configured');
        throw new Error('Razorpay key is not configured. Please set VITE_RAZORPAY_KEY_ID in your environment variables.');
      }

      // Load Razorpay script
      await this.loadRazorpayScript();

      // Create order
      const order = await this.createOrder(options);

      // Configure Razorpay options
      const razorpayOptions = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Mumee AI',
        description: options.courseTitle,
        order_id: order.id,
        prefill: {
          name: options.userName,
          email: options.userEmail,
        },
        theme: {
          color: '#3B82F6',
        },
        handler: async (response: any) => {
          console.log('💳 Payment handler called with response:', response);
          try {
            // Verify payment
            const verificationResult = await this.verifyPayment({
              ...response,
              courseId: options.courseId,
              userId: options.userId,
            });

            if (verificationResult.success) {
              console.log('✅ Payment verified successfully');
              return verificationResult;
            } else {
              throw new Error(verificationResult.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('❌ Payment verification error:', error);
            throw error;
          }
        },
        modal: {
          ondismiss: () => {
            console.log('❌ Payment modal dismissed');
          },
        },
      };

      console.log('🎯 Opening Razorpay modal with options:', razorpayOptions);

      // Open Razorpay modal and return a promise
      return new Promise((resolve, reject) => {
        const razorpay = new window.Razorpay({
          ...razorpayOptions,
          handler: async (response: any) => {
            console.log('💳 Payment handler called with response:', response);
            try {
              // Verify payment
              const verificationResult = await this.verifyPayment({
                ...response,
                courseId: options.courseId,
                userId: options.userId,
              });

              if (verificationResult.success) {
                console.log('✅ Payment verified successfully');
                resolve(verificationResult);
              } else {
                reject(new Error(verificationResult.error || 'Payment verification failed'));
              }
            } catch (error) {
              console.error('❌ Payment verification error:', error);
              reject(error);
            }
          },
          modal: {
            ondismiss: () => {
              console.log('❌ Payment modal dismissed');
              reject(new Error('Payment was cancelled'));
            },
          },
        });

        razorpay.on('payment.failed', (response: any) => {
          console.error('❌ Payment failed:', response.error);
          reject(new Error(response.error.description || 'Payment failed'));
        });

        razorpay.open();
      });
    } catch (error) {
      console.error('❌ Payment processing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed',
      };
    }
  }
}

export const paymentService = new PaymentService(); 