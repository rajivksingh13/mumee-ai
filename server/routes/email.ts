import express from 'express';
import { sendEmail } from '../utils/emailService';

const router = express.Router();

// General email endpoint
router.post('/send', async (req, res) => {
  try {
    const { to, subject, html, headers } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await sendEmail(to, subject, html, headers);
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

    const subject = 'Welcome to mumeeAI - Your Account is Ready!';
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
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .content {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
            }
            .account-type {
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #4F46E5;
            }
          </style>
        </head>
        <body>
          <div class="content">
            <div class="header">
              <h1 style="color: #4F46E5; margin: 0;">🎉 Welcome to mumeeAI!</h1>
              <p style="color: #666; margin-top: 5px;">Your Learning Journey Starts Here</p>
            </div>
            
            <h2 style="color: #4F46E5; margin-top: 0;">Hello ${userName}!</h2>
            <p>Thank you for joining mumeeAI! We're excited to have you as part of our learning community.</p>
            
            <div class="account-type">
              <h3 style="color: #4F46E5; margin-top: 0;">Your Account Details</h3>
              <p><strong>Account Type:</strong> ${accountType.charAt(0).toUpperCase() + accountType.slice(1)}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <h3 style="color: #4F46E5;">What's Next?</h3>
            <ul>
              <li>Explore our course catalog</li>
              <li>Complete your profile</li>
              <li>Start your first course</li>
              <li>Join our community discussions</li>
            </ul>

            <p>Ready to start learning? Click the button below to access your dashboard:</p>
            <div style="text-align: center;">
              <a href="https://mumee-ai.web.app/dashboard" class="button">Access Your Dashboard</a>
            </div>
            
            <h3 style="color: #4F46E5;">Getting Started Tips</h3>
            <ol>
              <li><strong>Browse Courses:</strong> Check out our available courses in your dashboard</li>
              <li><strong>Set Goals:</strong> Define your learning objectives</li>
              <li><strong>Track Progress:</strong> Monitor your learning journey</li>
              <li><strong>Connect:</strong> Engage with other learners</li>
            </ol>
            
            <p>If you have any questions or need assistance, our support team is here to help. You can reach us at support@mumeeai.com.</p>
            
            <div class="footer">
              <p>Best regards,<br>The mumeeAI Team</p>
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
    res.status(500).json({ error: 'Failed to send welcome email' });
  }
});

export default router; 