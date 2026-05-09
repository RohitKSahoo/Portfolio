import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, subject, honeypot } = req.body;

  // Honeypot check
  if (honeypot) {
    return res.status(400).json({ error: 'Spam detected' });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (message.length < 10) {
    return res.status(400).json({ error: 'Message too short (min 10 characters)' });
  }
  
  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message too long (max 1000 characters)' });
  }

  if (!process.env.RESEND_EMAIL_API) {
    return res.status(500).json({ error: 'Server configuration error: Missing API key.' });
  }

  const resend = new Resend(process.env.RESEND_EMAIL_API);

  try {
    const data = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Resend free tier requires this or a verified domain
      to: 'rohitsahoo2704@gmail.com', // <-- REPLACE THIS WITH YOUR REAL EMAIL
      subject: subject || `New Message from ${name}`,
      html: `
        <h3>New Message from Portfolio</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
