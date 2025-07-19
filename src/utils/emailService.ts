// Get the API URL based on environment
const API_URL = import.meta.env.PROD 
  ? 'https://mumee-ai-backend.onrender.com/api/email/send'
  : 'http://localhost:3000/api/email/send';

/**
 * Sends an enrollment confirmation email to the user
 * @param email User's email address
 * @param courseTitle Title of the enrolled course
 * @param coursePrice Price of the enrolled course
 * @param paymentId Payment ID for the enrolled course
 * @param orderId Order ID for the enrolled course
 * @param userName User's display name
 * @returns Promise that resolves when the email is sent
 */
export const sendEnrollmentEmail = async (
  email: string,
  courseTitle: string,
  coursePrice: number,
  paymentId: string,
  orderId: string,
  userName: string
): Promise<void> => {
  const subject = 'Course Enrollment Confirmation - mumeeAI';
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
        </style>
      </head>
      <body>
        <div class="content">
          <div class="header">
            <h1 style="color: #4F46E5; margin: 0;">mumeeAI</h1>
            <p style="color: #666; margin-top: 5px;">Your Learning Journey Starts Here</p>
          </div>
          
          <h2 style="color: #4F46E5; margin-top: 0;">Course Enrollment Confirmation</h2>
          <p>Dear ${userName},</p>
          <p>Thank you for enrolling in our course! We're excited to have you join our learning community.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4F46E5; margin-top: 0;">Enrollment Details</h3>
            <p><strong>Course Title:</strong> ${courseTitle}</p>
            <p><strong>Amount Paid:</strong> ₹${coursePrice}</p>
            <p><strong>Payment ID:</strong> ${paymentId}</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
          </div>

          <p>You can now access your course content by logging into your dashboard:</p>
          <div style="text-align: center;">
            <a href="${import.meta.env.PROD ? 'https://mumeeai.com/dashboard' : 'http://localhost:5173/dashboard'}" class="button">Access Your Dashboard</a>
          </div>
          
          <p>If you have any questions or need assistance, our support team is here to help. You can reach us at support@mumeeai.com.</p>
          
          <div class="footer">
            <p>Best regards,<br>The mumeeAI Team</p>
            <p>This is an automated message, please do not reply directly to this email.</p>
            <p>To unsubscribe, click here: <a href="${import.meta.env.PROD ? 'https://mumeeai.com/unsubscribe' : 'http://localhost:5173/unsubscribe'}">Unsubscribe</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject,
        html,
        headers: {
          'X-Mailer': 'mumeeAI',
          'List-Unsubscribe': `<mailto:support@mumeeai.com>, <${import.meta.env.PROD ? 'https://mumeeai.com/unsubscribe' : 'http://localhost:5173/unsubscribe'}>`,
          'Precedence': 'normal'
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    console.log('Enrollment email sent successfully');
  } catch (error) {
    console.error('Error sending enrollment email:', error);
    throw error;
  }
}; 