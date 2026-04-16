import { createHmac } from 'crypto';

// Pure Node.js JWT implementation — no external dependencies
// Supports HS256 only (sufficient for this MVP)

function base64url(data: string | Buffer): string {
  const buf = typeof data === 'string' ? Buffer.from(data, 'utf8') : data;
  return buf.toString('base64url');
}

function base64urlDecode(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf8');
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export function signJwt(
  payload: Omit<JwtPayload, 'iat' | 'exp'>,
  secret: string,
  expiresInSeconds = 7 * 24 * 60 * 60, // 7 days
): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const body = base64url(
    JSON.stringify({ ...payload, iat: now, exp: now + expiresInSeconds }),
  );
  const signature = createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyJwt(token: string, secret: string): JwtPayload {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');

  const [header, body, signature] = parts;
  const expected = createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');

  if (signature !== expected) throw new Error('Invalid signature');

  const payload = JSON.parse(base64urlDecode(body)) as JwtPayload;
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  return payload;
}
