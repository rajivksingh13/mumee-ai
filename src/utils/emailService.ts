import { buildApiUrl } from '../config/api';

interface EmailData {
  to_email: string;
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // Create HTML email template for contact form
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              line-height: 1.6;
              color: #222;
              background-color: #f4f6fa;
              margin: 0;
              padding: 0;
            }
            .container {
              background-color: #fff;
              padding: 32px 24px;
              border-radius: 14px;
              box-shadow: 0 4px 24px rgba(0,0,0,0.07);
              max-width: 600px;
              margin: 40px auto;
              border: 1px solid #e5e7eb;
            }
            .header {
              text-align: center;
              margin-bottom: 28px;
              padding-bottom: 16px;
              border-bottom: 2px solid #3b82f6;
            }
            .logo {
              font-size: 2.2em;
              font-weight: bold;
              color: #3b82f6;
              margin: 0;
              letter-spacing: 1px;
            }
            .subtitle {
              color: #64748b;
              margin-top: 6px;
              font-size: 1.1em;
            }
            .contact-details {
              background-color: #f1f5f9;
              padding: 18px;
              border-radius: 8px;
              margin: 18px 0;
              border-left: 4px solid #3b82f6;
              color: #222;
            }
            .message-content {
              background-color: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin: 18px 0;
              border: 1px solid #e2e8f0;
            }
            .footer {
              margin-top: 32px;
              padding-top: 18px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 13px;
              color: #64748b;
            }
            .label {
              font-weight: 600;
              color: #374151;
            }
            .value {
              color: #1f2937;
              margin-bottom: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">🦋 titliAI</h1>
              <p class="subtitle">New Contact Form Submission</p>
            </div>
            
            <div class="contact-details">
              <h3 style="color: #2563eb; margin-top: 0;">Contact Information</h3>
              <p><span class="label">Name:</span> <span class="value">${emailData.from_name}</span></p>
              <p><span class="label">Email:</span> <span class="value">${emailData.from_email}</span></p>
              <p><span class="label">Subject:</span> <span class="value">${emailData.subject}</span></p>
              <p><span class="label">Date:</span> <span class="value">${new Date().toLocaleString()}</span></p>
            </div>
            
            <div class="message-content">
              <h3 style="color: #2563eb; margin-top: 0;">Message</h3>
              <p style="white-space: pre-wrap; line-height: 1.6; margin: 0;">${emailData.message}</p>
            </div>
            
            <div class="footer">
              <p>This message was sent from the titliAI Contact Form.</p>
              <p>Please respond to: <strong>${emailData.from_email}</strong></p>
              <p>Best regards,<br><strong>The titliAI Team</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email using the existing titliAI email service with proper base URL
    const apiUrl = buildApiUrl('/api/email/send');
    console.log('📧 Sending contact email to:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: emailData.to_email,
        subject: emailData.subject,
        html: html
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Email service error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: errorText || 'Unknown error' };
      }
      
      throw new Error(`Email service error: ${errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('✅ Contact email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('❌ Error sending contact email:', error);
    return false;
  }
};
