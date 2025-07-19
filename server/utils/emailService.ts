import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: true // Enable proper TLS verification
  }
});

export const sendEmail = async (to: string, subject: string, html: string, headers?: Record<string, string>) => {
  try {
    // Create plain text version from HTML
    const plainText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    const mailOptions = {
      from: {
        name: 'mumeeAI',
        address: process.env.EMAIL_USER || ''
      },
      to,
      subject,
      text: plainText, // Add plain text version
      html,
      headers: {
        'X-Mailer': 'mumeeAI',
        'List-Unsubscribe': '<mailto:support@mumeeai.com>, <https://mumeeai.com/unsubscribe>',
        'Precedence': 'normal', // Change from bulk to normal
        'X-Priority': '1', // High priority
        'X-MSMail-Priority': 'High',
        ...headers
      },
      dkim: {
        domainName: 'mumeeai.com',
        keySelector: 'default',
        privateKey: process.env.DKIM_PRIVATE_KEY || ''
      }
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}; 