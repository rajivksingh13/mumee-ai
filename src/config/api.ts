// API Configuration
export const API_CONFIG = {
  // Automatically detect environment and use appropriate backend URL
  BASE_URL: (() => {
    console.log('🔍 Environment Detection Debug - Build Time:', new Date().toISOString());
    console.log('📍 Current hostname:', window.location.hostname);
    console.log('🌐 VITE_API_URL:', import.meta.env.VITE_API_URL);
    console.log('🌐 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    console.log('🔧 import.meta.env keys:', Object.keys(import.meta.env));
    
    // Check if we're in development (localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const devUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      console.log('🔧 Development environment detected, using backend URL:', devUrl);
      return devUrl;
    }
    
    // Production environment - prioritize VITE_API_BASE_URL from Render environment
    // If VITE_API_BASE_URL is set, use it; otherwise fallback to hardcoded URL
    const prodUrl = import.meta.env.VITE_API_BASE_URL || 'https://mumee-ai-backend.onrender.com';
    console.log('🚀 Production environment detected');
    console.log('🚀 VITE_API_BASE_URL from Render:', import.meta.env.VITE_API_BASE_URL || 'Not set');
    console.log('🚀 Final production URL:', prodUrl);
    return prodUrl;
  })(),
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
  const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
  console.log('🔗 Building API URL:', fullUrl);
  return fullUrl;
}; 