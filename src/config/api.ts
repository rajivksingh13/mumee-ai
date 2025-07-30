// API Configuration
export const API_CONFIG = {
  // Use environment variable for backend URL, fallback to production URL
  BASE_URL: import.meta.env.VITE_API_URL || 'https://mumee-ai-backend.onrender.com',
  // API endpoints
  ENDPOINTS: {
    EMAIL: {
      WELCOME: '/api/email/welcome',
      ENROLLMENT: '/api/email/enrollment',
    },
    PAYMENT: {
      CREATE_ORDER: '/api/payment/create-order',
      VERIFY: '/api/payment/verify',
    },
  },
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 