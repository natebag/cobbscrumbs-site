import { cookies } from 'next/headers';

const ADMIN_SESSION_COOKIE = 'cobbscrumbs_admin_session';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'default-secret-change-me';

export async function createSession(): Promise<string> {
  const token = Buffer.from(`${Date.now()}-${SESSION_SECRET}`).toString('base64');
  return token;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value || null;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}
