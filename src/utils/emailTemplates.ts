/**
 * Email templates for the application
 */

export const getEnrollmentEmailTemplate = (
  courseTitle: string,
  token: string,
  userName: string
) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
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
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
          }
          .content {
            padding: 20px;
            background-color: #f9fafb;
            border-radius: 5px;
            margin-top: 20px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9em;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Welcome to ${courseTitle}!</h1>
        </div>
        <div class="content">
          <p>Dear ${userName},</p>
          <p>Thank you for enrolling in ${courseTitle}. We're excited to have you join our learning community!</p>
          <p>To complete your enrollment and access the course materials, please click the button below:</p>
          <p style="text-align: center;">
            <a href="${window.location.origin}/dashboard?course=${courseTitle}&token=${token}" class="button">
              Access Course
            </a>
          </p>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p>${window.location.origin}/dashboard?course=${courseTitle}&token=${token}</p>
          <p>This link will expire in 24 hours for security reasons.</p>
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          <p>Best regards,<br>The Mumee AI Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} Mumee AI. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  // In a real application, you would use an email service like SendGrid, Mailgun, etc.
  // For testing purposes, we'll just log the email details
  console.log('Sending email:', {
    to,
    subject,
    html
  });

  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real application, you would use:
  // const transporter = nodemailer.createTransport({...});
  // await transporter.sendMail({ to, subject, html });
}; 