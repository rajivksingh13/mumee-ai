// Enhanced email service using Resend.com with better provider support
export const sendEmail = async (to: string, subject: string, html: string): Promise<any> => {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const provider = getEmailProvider(to);
    const isProblematicProvider = ['yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'aol.com'].includes(provider);
    
    console.log(`📧 Attempting to send email to: ${to} (Provider: ${provider})`);
    
    // For problematic providers, try custom domain first, then fallback to verified domain
    if (isProblematicProvider) {
      console.log(`⚠️ Problematic provider detected: ${provider}, trying custom domain first`);
      
      // Try custom domain first for problematic providers
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'titliAI <hello@teachlea.com>',
            to: [to],
            subject: subject,
            html: html,
            reply_to: 'support@titliai.com',
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Email sent successfully with custom domain for ${provider}: ${result.id}`);
          return result;
        } else {
          const error = await response.text();
          console.log(`⚠️ Custom domain failed for ${provider}, trying verified domain: ${error}`);
          return await sendWithVerifiedDomain(to, subject, html);
        }
      } catch (error) {
        console.log(`⚠️ Custom domain error for ${provider}, trying verified domain: ${error}`);
        return await sendWithVerifiedDomain(to, subject, html);
      }
    }

    // For other providers, try custom domain first, then fallback
    console.log(`📧 Using sender: titliAI <hello@teachlea.com>`);
    
    // First attempt with custom domain
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'titliAI <hello@teachlea.com>',
        to: [to],
        subject: subject,
        html: html,
        reply_to: 'support@titliai.com',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Resend API Error with custom domain:', error);
      
      // Check if it's a domain verification issue
      if (error.includes('domain') || error.includes('from') || error.includes('unauthorized')) {
        console.log('🔄 Domain not verified, trying verified domain...');
        return await sendWithVerifiedDomain(to, subject, html);
      }
      throw new Error(`Email service error: ${error}`);
    }

    const result = await response.json();
    console.log('✅ Email sent successfully with custom domain:', result.id);
    return result;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    
    // If Resend fails completely, try alternative service
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('rate_limit') || errorMessage.includes('403') || errorMessage.includes('bounce')) {
      console.log('🔄 Resend failed, trying alternative email service...');
      return await sendWithAlternativeService(to, subject, html);
    }
    
    throw error;
  }
};

// Helper function to send with verified domains (fallback only)
async function sendWithVerifiedDomain(to: string, subject: string, html: string): Promise<any> {
  // Since verified domains are restricted to own email, we'll use a different approach
  console.log(`🔄 Attempting to send with verified domain as fallback...`);
  
  try {
    // Try with a different verified domain that might work
    const verifiedDomain = 'titliAI <hello@resend.dev>';
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: verifiedDomain,
        to: [to],
        subject: subject,
        html: html,
        reply_to: 'support@titliai.com',
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Email sent successfully with verified domain: ${result.id}`);
      return result;
    } else {
      const error = await response.text();
      console.error(`❌ Verified domain also failed:`, error);
      
      // If verified domain also fails, throw a more helpful error
      throw new Error(`Email delivery failed. Your domain is verified but there may be account restrictions. Please check your Resend account settings or contact support. Error: ${error}`);
    }
  } catch (error) {
    console.error(`❌ Error with verified domain:`, error);
    throw error;
  }
}

// Alternative email service for free tier limitations
async function sendWithAlternativeService(to: string, subject: string, html: string): Promise<any> {
  console.log('🔄 Trying alternative email service...');
  
  // For now, we'll just log that we need to implement an alternative service
  // You can integrate with services like SendGrid, Mailgun, or AWS SES
  console.log('📧 Alternative email service not implemented yet.');
  console.log('💡 To fix Yahoo bouncing on free tier, consider:');
  console.log('   1. Upgrade Resend to Pro plan ($20/month)');
  console.log('   2. Integrate with SendGrid (free tier available)');
  console.log('   3. Use AWS SES (very cheap)');
  console.log('   4. Use Mailgun (free tier available)');
  
  throw new Error('Alternative email service not implemented. Please upgrade Resend plan or integrate another email service.');
}

// Test email configuration
export const testEmailConfiguration = async (): Promise<any> => {
  try {
    console.log('🧪 Testing email configuration...');
    
    // Test with a known good email (Gmail)
    const testEmail = 'test@gmail.com';
    const testSubject = 'Test Email Configuration';
    const testHtml = '<h1>Test Email</h1><p>This is a test email to verify configuration.</p>';
    
    const result = await sendEmail(testEmail, testSubject, testHtml);
    console.log('✅ Email configuration test successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    throw error;
  }
};

// Validate email address format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Get email provider from email address
export const getEmailProvider = (email: string): string => {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain || 'unknown';
};

// Check if email provider is commonly supported
export const isSupportedProvider = (email: string): boolean => {
  const provider = getEmailProvider(email);
  const supportedProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
    'aol.com', 'icloud.com', 'protonmail.com', 'zoho.com', 'yandex.com'
  ];
  
  return supportedProviders.includes(provider) || provider.endsWith('.com') || provider.endsWith('.org') || provider.endsWith('.net');
}; 