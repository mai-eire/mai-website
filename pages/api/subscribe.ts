import { NextApiRequest, NextApiResponse } from 'next';

// Simple email format check
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('BREVO_API_KEY is not configured.');
    return res.status(500).json({ error: 'Newsletter service is not configured.' });
  }

  // Optional: add the contact to a specific Brevo list
  const listId = process.env.BREVO_LIST_ID
    ? parseInt(process.env.BREVO_LIST_ID, 10)
    : undefined;

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: listId ? [listId] : undefined,
        updateEnabled: true, // update the contact if it already exists
      }),
    });

    // 201 = created, 204 = updated (existing contact)
    if (response.status === 201 || response.status === 204) {
      return res.status(200).json({ success: true });
    }

    const data = await response.json().catch(() => ({}));

    // Contact already exists and could not be updated into the list
    if (data?.code === 'duplicate_parameter') {
      return res.status(200).json({ success: true });
    }

    console.error('Brevo subscribe failed:', response.status, data);
    return res.status(502).json({
      error: 'Unable to subscribe at this time. Please try again later.',
    });
  } catch (error) {
    console.error('Error subscribing to Brevo:', error);
    return res.status(500).json({
      error: 'Something went wrong. Please try again later.',
    });
  }
}
