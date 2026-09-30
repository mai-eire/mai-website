import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { createSession, verifyPassword } from '../../../lib/auth';

// A valid bcrypt hash, cost 12, of a random string that was discarded. See the
// comment at its use below - the point is that comparing against it costs the
// same as comparing against a real account's password.
const DUMMY_HASH = '$2b$12$zdjPGr5n2f/KQSuJESJaQuVlz/X/9AAMf4EgyAS/zjCp6vIXt6yVW';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: String(email).trim().toLowerCase() },
    });

    // One message for both "no such account" and "wrong password", and the
    // hash comparison runs either way, so the response neither says nor times
    // out differently for an email that exists.
    //
    // DUMMY_HASH must be a *real* bcrypt hash - 60 characters, of a string
    // nobody knows. Given anything malformed, bcrypt rejects it outright
    // instead of hashing, which returns in under a millisecond and hands an
    // attacker exactly the timing oracle this branch exists to close. The
    // previous value here was 65 characters and did that.
    const ok = user
      ? await verifyPassword(String(password), user.password)
      : await verifyPassword(String(password), DUMMY_HASH);

    if (!user || !ok) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    await createSession(res, {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return res.status(200).json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error: any) {
    console.error('Login failed:', error);
    // AUTH_SECRET being unset is a setup problem, not a bad password - say so
    // rather than letting it look like wrong credentials.
    if (String(error.message).includes('AUTH_SECRET')) {
      return res.status(500).json({ error: 'Server is not configured for sign-in yet.' });
    }
    return res.status(500).json({ error: 'Could not sign in' });
  }
}
