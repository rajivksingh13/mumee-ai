// Test script to verify email service functionality
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    EMAIL: {
      WELCOME: '/api/email/welcome',
      ENROLLMENT: '/api/email/enrollment',
    },
  },
};

const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

async function testEmailService() {
  console.log('🧪 Testing Email Service...');
  
  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connectivity...');
    const healthCheck = await fetch(`${API_CONFIG.BASE_URL}/api/test-cors`);
    if (healthCheck.ok) {
      console.log('✅ Server is running');
    } else {
      console.log('❌ Server is not responding');
      return;
    }

    // Test 2: Test email configuration
    console.log('2. Testing email configuration...');
    const configTest = await fetch(`${API_CONFIG.BASE_URL}/api/email/test-config`);
    const configResult = await configTest.json();
    console.log('Config test result:', configResult);

    // Test 3: Send test welcome email
    console.log('3. Testing welcome email...');
    const emailUrl = buildApiUrl(API_CONFIG.ENDPOINTS.EMAIL.WELCOME);
    console.log('📧 Sending test welcome email to:', emailUrl);
    
    const response = await fetch(emailUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        userName: 'Test User',
        accountType: 'individual'
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Welcome email test successful:', result);
    } else {
      const error = await response.text();
      console.log('❌ Welcome email test failed:', error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testEmailService(); 