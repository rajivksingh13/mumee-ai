// Simple email service using Resend.com
export const sendEmail = async (to: string, subject: string, html: string): Promise<any> => {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'mumeeAI <hello@teachlea.com>', // Try with your domain
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API Error:', error);
      
      // If domain fails, fallback to test domain
      if (error.includes('domain') || error.includes('from')) {
        console.log('Domain not verified, trying test domain...');
        const fallbackResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'mumeeAI <onboarding@resend.dev>', // Fallback to test domain
            to: [to],
            subject: subject,
            html: html,
          }),
        });
        
        if (!fallbackResponse.ok) {
          const fallbackError = await fallbackResponse.text();
          throw new Error(`Email service error: ${fallbackError}`);
        }
        
        const fallbackResult = await fallbackResponse.json();
        console.log('Email sent successfully with fallback domain:', fallbackResult.id);
        return fallbackResult;
      }
      
      throw new Error(`Email service error: ${error}`);
    }

    const result = await response.json();
    console.log('Email sent successfully:', result.id);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}; 