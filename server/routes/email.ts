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
    console.log('🎯 Welcome email endpoint called at:', new Date().toISOString());
    console.log('📨 Request headers:', req.headers);
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    const { email, userName, accountType } = req.body;

    console.log('🔍 Extracted data:', { email, userName, accountType });

    if (!email || !userName) {
      console.log('❌ Missing required fields:', { email, userName });
      return res.status(400).json({ error: 'Email and userName are required' });
    }

    console.log('✅ Validation passed, sending welcome email to:', email);
    console.log('👤 User details:', { userName, accountType });

    const subject = 'Welcome to mumeeAI - Your Account is Ready!';
    console.log('📧 Email subject:', subject);
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to mumeeAI</title>
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
            .welcome-text {
              font-size: 1.2em;
              color: #4F46E5;
              margin-bottom: 20px;
            }
            .account-details {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #4F46E5;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
              text-align: center;
            }
            .button:hover {
              background-color: #4338ca;
            }
            .tips {
              background-color: #e8f4fd;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
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
              <h1 class="logo">🎉 mumeeAI</h1>
              <p class="subtitle">Your Learning Journey Starts Here</p>
            </div>
            
            <h2 class="welcome-text">Hello ${userName}!</h2>
            <p>Thank you for joining mumeeAI! We're excited to have you as part of our learning community. Your account has been successfully created and you're ready to start your learning journey.</p>
            
            <div class="account-details">
              <h3 style="color: #4F46E5; margin-top: 0;">Your Account Details</h3>
              <p><strong>Account Type:</strong> ${accountType}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <h3 style="color: #4F46E5;">What's Next?</h3>
            <ul>
              <li>📚 Explore our course catalog</li>
              <li>👤 Complete your profile</li>
              <li>🎯 Start your first course</li>
              <li>💬 Join our community discussions</li>
            </ul>

            <p>Ready to start learning? Click the button below to access your dashboard:</p>
            <div style="text-align: center;">
              <a href="https://mumee-ai.web.app/dashboard" class="button">Access Your Dashboard</a>
            </div>
            
            <div class="tips">
              <h3 style="color: #4F46E5;">Getting Started Tips</h3>
              <ol>
                <li><strong>Browse Courses:</strong> Check out our available courses in your dashboard</li>
                <li><strong>Set Goals:</strong> Define your learning objectives</li>
                <li><strong>Track Progress:</strong> Monitor your learning journey</li>
                <li><strong>Connect:</strong> Engage with other learners</li>
              </ol>
            </div>
            
            <p>If you have any questions or need assistance, our support team is here to help. You can reach us at <strong>support@mumeeai.com</strong>.</p>
            
            <div class="footer">
              <p>Best regards,<br><strong>The mumeeAI Team</strong></p>
              <p>This is an automated message, please do not reply directly to this email.</p>
              <p>To unsubscribe, click here: <a href="https://mumee-ai.web.app/unsubscribe">Unsubscribe</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log('📧 HTML email template generated, length:', html.length);
    console.log('🚀 Calling sendEmail function...');
    
    await sendEmail(email, subject, html);
    console.log('✅ Email sent successfully via sendEmail function');
    
    console.log('📤 Sending success response to client');
    res.json({ message: 'Welcome email sent successfully' });
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ 
      error: 'Failed to send welcome email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enrollment email endpoint
router.post('/enrollment', async (req, res) => {
  try {
    console.log('🎓 Enrollment email endpoint called at:', new Date().toISOString());
    console.log('📨 Request headers:', req.headers);
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    const { email, courseTitle, coursePrice, paymentId, orderId, userName } = req.body;

    console.log('🔍 Extracted data:', { email, courseTitle, coursePrice, paymentId, orderId, userName });

    if (!email || !courseTitle || !userName) {
      console.log('❌ Missing required fields:', { email, courseTitle, userName });
      return res.status(400).json({ error: 'Email, courseTitle, and userName are required' });
    }

    console.log('✅ Validation passed, sending enrollment email to:', email);
    console.log('📚 Course details:', { courseTitle, coursePrice, paymentId, orderId });

    const subject = `Welcome to ${courseTitle} - Enrollment Confirmed!`;
    console.log('📧 Email subject:', subject);
    
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
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
              text-align: center;
            }
            .button:hover {
              background-color: #4338ca;
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
              <h1 class="logo">🎓 mumeeAI</h1>
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
              <a href="https://mumee-ai.web.app/dashboard" class="button">Access Your Course</a>
            </div>
            
            <p>If you have any questions about the course content or need technical support, our team is here to help. You can reach us at <strong>support@mumeeai.com</strong>.</p>
            
            <div class="footer">
              <p>Best regards,<br><strong>The mumeeAI Team</strong></p>
              <p>This is an automated message, please do not reply directly to this email.</p>
              <p>To unsubscribe, click here: <a href="https://mumee-ai.web.app/unsubscribe">Unsubscribe</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log('📧 HTML email template generated, length:', html.length);
    console.log('🚀 Calling sendEmail function...');
    
    await sendEmail(email, subject, html);
    console.log('✅ Enrollment email sent successfully via sendEmail function');
    
    console.log('📤 Sending success response to client');
    res.json({ message: 'Enrollment email sent successfully' });
  } catch (error) {
    console.error('❌ Error sending enrollment email:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ 
      error: 'Failed to send enrollment email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 