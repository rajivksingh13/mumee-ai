// Simple test to verify current email configuration
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    TEST_SEND: '/api/email/test-send',
    WELCOME: '/api/email/welcome',
  },
};

const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

async function testCurrentConfiguration() {
  console.log('🧪 Testing Current Email Configuration...');
  console.log('=' .repeat(50));
  
  const testEmails = [
    'test@gmail.com',           // Should work with custom domain
    'rajiv.kumar0213@yahoo.com' // Should use verified domain
  ];
  
  for (const email of testEmails) {
    console.log(`\n📧 Testing email to: ${email}`);
    
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.TEST_SEND), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Email sent successfully!');
        console.log(`📧 Email ID: ${result.emailId}`);
        console.log(`🏢 Provider: ${result.provider}`);
        console.log(`✅ Supported: ${result.isSupported}`);
      } else {
        const error = await response.text();
        console.log(`❌ Test failed: ${error}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n📊 Expected Behavior:');
  console.log('- Gmail: Should use custom domain (hello@teachlea.com)');
  console.log('- Yahoo: Should use verified domain (onboarding@resend.dev)');
  console.log('- Both should be delivered successfully');
}

// Run the test
testCurrentConfiguration().catch(console.error); 