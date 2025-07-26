import express from 'express';
import { sendEmail } from '../utils/emailService';

const router = express.Router();

// Test endpoint to check API key configuration
router.get('/test-config', async (req, res) => {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key not configured',
        message: 'RESEND_API_KEY environment variable is not set'
      });
    }

    // Test the API key by making a simple request to Resend
    const response = await fetch('https://api.resend.com/domains', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      const domains = await response.json();
      res.json({ 
        success: true,
        message: 'API key is working',
        domains: domains.data || [],
        apiKeyConfigured: true
      });
    } else {
      const error = await response.text();
      res.status(400).json({ 
        error: 'API key is invalid',
        message: error,
        apiKeyConfigured: true
      });
    }
  } catch (error) {
    console.error('Config test failed:', error);
    res.status(500).json({ 
      error: 'Failed to test configuration',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// General email endpoint for other email functionality
router.post('/send', async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await sendEmail(to, subject, html);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Welcome email endpoint
router.post('/welcome', async (req, res) => {
  try {
    const { email, userName, accountType } = req.body;

    if (!email || !userName) {
      return res.status(400).json({ error: 'Email and userName are required' });
    }

    const subject = 'Welcome to titliAI – Your AI Journey Begins!';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to titliAI</title>
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
              max-width: 520px;
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
            .welcome-text {
              font-size: 1.15em;
              color: #2563eb;
              margin-bottom: 18px;
              font-weight: 500;
            }
            .account-details {
              background-color: #f1f5f9;
              padding: 18px;
              border-radius: 8px;
              margin: 18px 0;
              border-left: 4px solid #3b82f6;
              color: #222;
            }
            .button {
              display: inline-block;
              padding: 14px 28px;
              background-color: #1A237E; /* Corporate dark blue */
              color: #fff !important;
              text-decoration: none;
              border-radius: 6px;
              margin: 22px 0 10px 0;
              font-weight: 600;
              font-size: 1.1em;
              border: 1px solid #0D1333;
              box-shadow: 0 2px 8px rgba(26,35,126,0.10);
              letter-spacing: 0.5px;
              transition: background 0.2s;
            }
            .button:hover {
              background-color: #3949AB;
              color: #fff !important;
            }
            .tips {
              background-color: #e0e7ef;
              padding: 16px;
              border-radius: 8px;
              margin: 18px 0;
              color: #334155;
            }
            .footer {
              margin-top: 32px;
              padding-top: 18px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 13px;
              color: #64748b;
            }
            ul, ol {
              padding-left: 20px;
            }
            h3 {
              color: #2563eb;
              margin-bottom: 8px;
              margin-top: 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">🦋 titliAI</h1>
              <p class="subtitle">Empowering Your Future with AI</p>
            </div>
            <h2 class="welcome-text">Hello ${userName}!</h2>
            <p>Thank you for joining <strong>titliAI</strong>! We're thrilled to have you as part of our AI-driven community. Your account has been successfully created and you’re ready to explore the world of Artificial Intelligence.</p>
            <div class="account-details">
              <h3>Your Account Details</h3>
              <p><strong>Account Type:</strong> ${accountType}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <h3>What’s Next?</h3>
            <ul>
              <li>🎓 <strong>Join AI Workshops:</strong> Foundation & Advanced levels</li>
              <li>💡 <strong>Consult with AI Experts</strong></li>
              <li>📚 <strong>Access the AI Library</strong></li>
              <li>🤖 <strong>Explore the AI Agents Marketplace</strong></li>
              <li>🏆 <strong>Get AI Training & Certifications</strong></li>
              <li>📰 <strong>Read the latest AI Blogs</strong></li>
            </ul>
            <p>Ready to get started? Click below to visit your dashboard and begin your AI journey:</p>
            <div style="text-align: center;">
              <a href="https://mumee-ai.web.app/" class="button">Go to titliAI</a>
            </div>
            <div class="tips">
              <h3>Getting Started Tips</h3>
              <ol>
                <li><strong>Browse Offerings:</strong> Check out our AI workshops, library, and more</li>
                <li><strong>Set Goals:</strong> Define your AI learning objectives</li>
                <li><strong>Connect:</strong> Engage with our experts and community</li>
                <li><strong>Stay Updated:</strong> Follow our blog for the latest in AI</li>
              </ol>
            </div>
            <p>If you have any questions or need assistance, our support team is here to help. You can reach us at <strong>support@titliai.com</strong>.</p>
            <div class="footer">
              <p>Best regards,<br><strong>The titliAI Team</strong></p>
              <p>This is an automated message, please do not reply directly to this email.</p>
              <p>To unsubscribe, click here: <a href="https://mumee-ai.web.app/unsubscribe">Unsubscribe</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail(email, subject, html);
    res.json({ message: 'Welcome email sent successfully' });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({ 
      error: 'Failed to send welcome email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enrollment email endpoint
router.post('/enrollment', async (req, res) => {
  try {
    const { email, courseTitle, coursePrice, paymentId, orderId, userName } = req.body;

    if (!email || !courseTitle || !userName) {
      return res.status(400).json({ error: 'Email, courseTitle, and userName are required' });
    }

    const subject = `Welcome to ${courseTitle} - Enrollment Confirmed!`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Course Enrollment Confirmation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #4F46E5;
            }
            .logo {
              font-size: 2.5em;
              font-weight: bold;
              color: #4F46E5;
              margin: 0;
            }
            .subtitle {
              color: #666;
              margin-top: 5px;
              font-size: 1.1em;
            }
            .success-text {
              font-size: 1.2em;
              color: #4F46E5;
              margin-bottom: 20px;
            }
            .enrollment-details {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #4F46E5;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background-color: #1A237E; /* Corporate dark blue */
              color: #fff !important;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
              text-align: center;
              border: 1px solid #0D1333;
              box-shadow: 0 2px 8px rgba(26,35,126,0.10);
              letter-spacing: 0.5px;
              font-size: 1.08em;
            }
            .button:hover {
              background-color: #3949AB;
              color: #fff !important;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">🦋 titliAI</h1>
              <p class="subtitle">Your Learning Journey Continues</p>
            </div>
            
            <h2 class="success-text">Congratulations ${userName}!</h2>
            <p>Your enrollment in <strong>${courseTitle}</strong> has been confirmed! We're excited to have you join this course and can't wait to see your progress.</p>
            
            <div class="enrollment-details">
              <h3 style="color: #4F46E5; margin-top: 0;">Enrollment Details</h3>
              <p><strong>Course:</strong> ${courseTitle}</p>
              <p><strong>Amount Paid:</strong> ₹${coursePrice}</p>
              <p><strong>Payment ID:</strong> ${paymentId}</p>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Enrollment Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <h3 style="color: #4F46E5;">What's Next?</h3>
            <ul>
              <li>📚 Access your course materials</li>
              <li>🎯 Start with the first lesson</li>
              <li>📝 Complete assignments and quizzes</li>
              <li>🏆 Earn your certificate</li>
            </ul>

            <p>Ready to start learning? Click the button below to access your course:</p>
            <div style="text-align: center;">
              <a href="https://mumee-ai.web.app/dashboard" class="button">Access Your ${courseTitle}</a>
            </div>
            
            <p>If you have any questions about the course content or need technical support, our team is here to help. You can reach us at <strong>support@titliai.com</strong>.</p>
            
            <div class="footer">
              <p>Best regards,<br><strong>The titliAI Team</strong></p>
              <p>This is an automated message, please do not reply directly to this email.</p>
              <p>To unsubscribe, click here: <a href="https://mumee-ai.web.app/unsubscribe">Unsubscribe</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail(email, subject, html);
    res.json({ message: 'Enrollment email sent successfully' });
  } catch (error) {
    console.error('Error sending enrollment email:', error);
    res.status(500).json({ 
      error: 'Failed to send enrollment email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 