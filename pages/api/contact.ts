import { NextApiRequest, NextApiResponse } from 'next';
import { getDepartment } from '../../data/departments';

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, department, category, subject, message } =
    req.body || {};

  if (!name || !email || !category || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (department !== undefined && typeof department !== 'string') {
    return res.status(400).json({ error: 'Invalid department.' });
  }
  if (typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('BREVO_API_KEY is not configured.');
    return res.status(500).json({ error: 'Email service is not configured.' });
  }

  // The verified sender in Brevo (Senders & Domains). Reply-To is set to the
  // visitor so replies reach them.
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'info@mai.ie';
  const fromName = process.env.CONTACT_FROM_NAME || 'MAI Website';

  // Destination inbox is looked up from the department id (data/departments.js)
  // so the client can only pick from the known list, never supply an address.
  // CONTACT_TO_EMAIL is the fallback for a missing/unknown department and
  // CONTACT_OVERRIDE_EMAIL, when set, captures every submission (local/staging).
  const dept = department ? getDepartment(department) : null;
  const departmentLabel = dept ? dept.label : 'General';
  const toEmail =
    process.env.CONTACT_OVERRIDE_EMAIL ||
    (dept ? dept.email : process.env.CONTACT_TO_EMAIL || 'info@mai.ie');

  const safeName = escapeHtml(String(name));
  const safeEmail = escapeHtml(String(email));
  const safeDepartment = escapeHtml(departmentLabel);
  const safeCategory = escapeHtml(String(category));
  const safeSubject = escapeHtml(String(subject));
  const safeMessage = escapeHtml(String(message)).replace(/\n/g, '<br />');

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: fromName, email: fromEmail },
        to: [{ email: toEmail }],
        replyTo: { email: String(email), name: String(name) },
        subject: `[${departmentLabel} / ${category}] New contact message: ${subject}`,
        htmlContent: `
          <h2>New contact form submission</h2>
          <p><strong>Department:</strong> ${safeDepartment}</p>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Category:</strong> ${safeCategory}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        `,
      }),
    });

    if (response.status === 201 || response.ok) {
      return res.status(200).json({ success: true });
    }

    const data = await response.json().catch(() => ({}));
    console.error('Brevo contact email failed:', response.status, data);
    return res.status(502).json({
      error: 'Unable to send your message right now. Please try again later.',
    });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return res.status(500).json({
      error: 'Something went wrong. Please try again later.',
    });
  }
}
