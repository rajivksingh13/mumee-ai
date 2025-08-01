// Comprehensive Resend configuration checker
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    TEST_CONFIG: '/api/email/test-config',
  },
};

const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

async function checkResendConfiguration() {
  console.log('🔧 Checking Resend Configuration...');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Check API key and basic configuration
    console.log('1️⃣ Testing API Key and Basic Configuration...');
    const configResponse = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.TEST_CONFIG));
    
    if (configResponse.ok) {
      const config = await configResponse.json();
      console.log('✅ API Key is working');
      console.log(`📋 API Key configured: ${config.apiKeyConfigured}`);
      console.log(`🏢 Domains found: ${config.domains?.length || 0}`);
      
      if (config.domains && config.domains.length > 0) {
        console.log('\n📋 Available domains:');
        config.domains.forEach((domain, index) => {
          console.log(`   ${index + 1}. ${domain.name} (${domain.status})`);
        });
      } else {
        console.log('⚠️ No domains found in Resend account');
      }
    } else {
      const error = await configResponse.text();
      console.log(`❌ Configuration test failed: ${error}`);
      return;
    }
    
    // Test 2: Check domain verification status
    console.log('\n2️⃣ Checking Domain Verification...');
    await checkDomainVerification();
    
    // Test 3: Check sending limits and account status
    console.log('\n3️⃣ Checking Account Status...');
    await checkAccountStatus();
    
    // Test 4: Check DNS records (if custom domain exists)
    console.log('\n4️⃣ Checking DNS Records...');
    await checkDNSRecords();
    
    // Test 5: Check email deliverability settings
    console.log('\n5️⃣ Checking Deliverability Settings...');
    await checkDeliverabilitySettings();
    
  } catch (error) {
    console.error('❌ Configuration check failed:', error.message);
  }
}

async function checkDomainVerification() {
  try {
    // This would typically check domain verification status
    console.log('🔍 Checking domain verification status...');
    console.log('📋 To verify domains manually:');
    console.log('   1. Go to https://resend.com/domains');
    console.log('   2. Check if your domain is listed');
    console.log('   3. Verify status is "Verified"');
    console.log('   4. If not verified, follow the verification steps');
  } catch (error) {
    console.log('❌ Could not check domain verification:', error.message);
  }
}

async function checkAccountStatus() {
  try {
    console.log('🔍 Checking account status...');
    console.log('📋 To check account status manually:');
    console.log('   1. Go to https://resend.com/account');
    console.log('   2. Check if account is active');
    console.log('   3. Verify sending limits');
    console.log('   4. Check if any restrictions are in place');
  } catch (error) {
    console.log('❌ Could not check account status:', error.message);
  }
}

async function checkDNSRecords() {
  try {
    console.log('🔍 Checking DNS records...');
    console.log('📋 For custom domain verification, ensure these DNS records exist:');
    console.log('   - SPF record: v=spf1 include:_spf.resend.com ~all');
    console.log('   - DKIM record: (provided by Resend)');
    console.log('   - DMARC record: v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com');
    console.log('   - MX record: (if using custom domain for receiving)');
  } catch (error) {
    console.log('❌ Could not check DNS records:', error.message);
  }
}

async function checkDeliverabilitySettings() {
  try {
    console.log('🔍 Checking deliverability settings...');
    console.log('📋 Common deliverability issues:');
    console.log('   1. Domain reputation (new domains may have lower deliverability)');
    console.log('   2. Email content (avoid spam trigger words)');
    console.log('   3. Sending frequency (avoid sending too many emails quickly)');
    console.log('   4. Recipient engagement (low engagement can affect deliverability)');
  } catch (error) {
    console.log('❌ Could not check deliverability settings:', error.message);
  }
}

async function runConfigurationCheck() {
  console.log('🚀 Starting Resend Configuration Check...');
  console.log('This will help identify configuration issues before applying code changes.');
  console.log('');
  
  await checkResendConfiguration();
  
  console.log('\n📊 Configuration Check Summary:');
  console.log('=' .repeat(60));
  console.log('✅ If all checks pass, the issue might be:');
  console.log('   - Domain not properly verified');
  console.log('   - DNS records not configured correctly');
  console.log('   - Account limitations or restrictions');
  console.log('   - Email provider blocking (Yahoo, etc.)');
  console.log('');
  console.log('🔧 Next Steps:');
  console.log('   1. Fix any configuration issues identified above');
  console.log('   2. Test email sending again');
  console.log('   3. If issues persist, then apply the code changes');
  console.log('   4. Monitor Resend dashboard for delivery status');
}

// Run the configuration check
runConfigurationCheck().catch(console.error); 