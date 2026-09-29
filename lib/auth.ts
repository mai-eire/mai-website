// Authentication for the newsroom back office.
//
// Deliberately self-contained (bcrypt hash in our own User table + a signed,
// httpOnly session cookie) rather than tied to a hosting provider's auth
// service, so it travels with the app if the database moves.
//
// This replaces the previous hardcoded admin@example.com / password123 check.
// Accounts are created with `npm run create-admin`.

import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './prisma';

const COOKIE_NAME = 'mai_session';
const SESSION_DAYS = 7;

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

// A missing secret must stop the app rather than silently fall back to a
// default - a guessable signing key means anyone can mint an admin session.
const getSecret = (): Uint8Array => {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'AUTH_SECRET is missing or too short (needs 32+ characters). ' +
        'Generate one with: openssl rand -base64 32'
    );
  }
  return new TextEncoder().encode(secret);
};

// --- passwords --------------------------------------------------------------

export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, 12);

export const verifyPassword = (plain: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plain, hash);

// --- cookies ----------------------------------------------------------------

const parseCookies = (header: string | undefined): Record<string, string> => {
  const out: Record<string, string> = {};
  (header || '').split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx < 0) return;
    const key = part.slice(0, idx).trim();
    if (key) out[key] = decodeURIComponent(part.slice(idx + 1).trim());
  });
  return out;
};

const serializeCookie = (value: string, maxAgeSeconds: number): string => {
  const attrs = [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly', // not readable from JavaScript, so XSS cannot lift the session
    'SameSite=Lax', // survives normal navigation, blocks cross-site form posts
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (process.env.NODE_ENV === 'production') attrs.push('Secure');
  return attrs.join('; ');
};

// --- sessions ---------------------------------------------------------------

export const createSession = async (
  res: NextApiResponse,
  user: SessionUser
): Promise<void> => {
  const token = await new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());

  res.setHeader('Set-Cookie', serializeCookie(token, SESSION_DAYS * 24 * 60 * 60));
};

export const destroySession = (res: NextApiResponse): void => {
  res.setHeader('Set-Cookie', serializeCookie('', 0));
};

// Reads the session from any request (API route or getServerSideProps).
// Returns null rather than throwing, so callers decide what an anonymous
// visitor should see.
export const getSessionUser = async (req: {
  headers: { cookie?: string };
}): Promise<SessionUser | null> => {
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub) return null;

    // The token is only a claim about who they were when they logged in.
    // Check the account still exists so a deleted editor's outstanding
    // cookie stops working immediately instead of at expiry.
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return null;

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } catch {
    // Expired, tampered with, or signed by an old secret - all mean "no session".
    return null;
  }
};

// --- route guards -----------------------------------------------------------

type Handler = (
  req: NextApiRequest,
  res: NextApiResponse,
  user: SessionUser
) => unknown | Promise<unknown>;

// Wraps an API route so it only runs for a signed-in user.
export const withAuth =
  (handler: Handler) => async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Not signed in' });
    return handler(req, res, user);
  };

// For getServerSideProps on an admin page: bounce anonymous visitors to the
// login form, remembering where they were headed.
export const requireUser = async (ctx: {
  req: { headers: { cookie?: string } };
  resolvedUrl?: string;
}): Promise<{ user: SessionUser } | { redirect: any }> => {
  const user = await getSessionUser(ctx.req);
  if (!user) {
    const next = ctx.resolvedUrl ? `?next=${encodeURIComponent(ctx.resolvedUrl)}` : '';
    return { redirect: { destination: `/admin/login${next}`, permanent: false } };
  }
  return { user };
};
