import express from 'express';
import { sendEmail } from '../utils/emailService';

const router = express.Router();

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

export default router; 