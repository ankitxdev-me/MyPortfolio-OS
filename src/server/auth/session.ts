import crypto from 'node:crypto';
import { appConfig } from '../config/app.config';
import { env } from '../config/env';

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  rememberMe: boolean;
  createdAt: Date;
  user?: SessionUser;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface SessionTokenPayload {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  exp: number;
  rem: boolean;
  iat: number;
}

export const SESSION_COOKIE_NAME = 'portfolio_os_session';
const DEFAULT_SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const REMEMBER_ME_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const globalForSession = globalThis as unknown as {
  __portfolio_os_sessions_map__?: Map<string, Session>;
  __portfolio_os_revoked_tokens__?: Set<string>;
};

if (!globalForSession.__portfolio_os_sessions_map__) {
  globalForSession.__portfolio_os_sessions_map__ = new Map<string, Session>();
}
if (!globalForSession.__portfolio_os_revoked_tokens__) {
  globalForSession.__portfolio_os_revoked_tokens__ = new Set<string>();
}

function getSigningSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    env.ADMIN_PASSWORD ||
    process.env.ADMIN_PASSWORD ||
    'portfolio-os-super-secret-signing-key-default-2026'
  );
}

class SessionStore {
  private get sessions(): Map<string, Session> {
    return globalForSession.__portfolio_os_sessions_map__!;
  }

  private get revokedTokens(): Set<string> {
    return globalForSession.__portfolio_os_revoked_tokens__!;
  }

  public generateSessionToken(): string {
    const bytes = crypto.randomBytes(32);
    return bytes.toString('hex');
  }

  public hashSessionToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  public createSession(
    userId: string,
    rememberMe = false,
    userOverride?: Partial<SessionUser>
  ): { session: Session; token: string } {
    const duration = rememberMe ? REMEMBER_ME_EXPIRY_MS : DEFAULT_SESSION_EXPIRY_MS;
    const now = Date.now();
    const expiresAtMs = now + duration;
    const expiresAt = new Date(expiresAtMs);

    const user: SessionUser = {
      id: userId,
      email: (userOverride?.email || env.ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@portfolio.os').toLowerCase().trim(),
      name: userOverride?.name || env.ADMIN_NAME || process.env.ADMIN_NAME || 'Ankit Gupta',
      role: (userOverride?.role as 'admin') || 'admin',
    };

    // Create a stateless signed token payload (HMAC-SHA256)
    // This guarantees the session works across any serverless Lambda instance without losing state on cold-starts
    const payload: SessionTokenPayload = {
      uid: userId,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: expiresAtMs,
      rem: rememberMe,
      iat: now,
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
      .createHmac('sha256', getSigningSecret())
      .update(encodedPayload)
      .digest('base64url');

    const token = `${encodedPayload}.${signature}`;

    const session: Session = {
      id: token,
      userId,
      expiresAt,
      rememberMe,
      createdAt: new Date(now),
      user,
    };

    // Keep in-memory cache as well
    const sessionId = this.hashSessionToken(token);
    this.sessions.set(sessionId, session);

    return { session, token };
  }

  public getSession(token: string): Session | null {
    if (!token || typeof token !== 'string') return null;

    if (this.revokedTokens.has(token)) {
      return null;
    }

    // Check signed token format (base64url.signature)
    if (token.includes('.')) {
      const parts = token.split('.');
      if (parts.length === 2) {
        const [encodedPayload, signature] = parts;
        const expectedSig = crypto
          .createHmac('sha256', getSigningSecret())
          .update(encodedPayload)
          .digest('base64url');

        try {
          const sigBuf = Buffer.from(signature);
          const expBuf = Buffer.from(expectedSig);
          if (sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)) {
            const payload: SessionTokenPayload = JSON.parse(
              Buffer.from(encodedPayload, 'base64url').toString('utf8')
            );

            if (Date.now() >= payload.exp) {
              return null; // Expired
            }

            const session: Session = {
              id: token,
              userId: payload.uid,
              expiresAt: new Date(payload.exp),
              rememberMe: payload.rem,
              createdAt: new Date(payload.iat),
              user: {
                id: payload.uid,
                email: payload.email,
                name: payload.name,
                role: payload.role,
              },
            };

            return session;
          }
        } catch {
          // Fall through to legacy check
        }
      }
    }

    // Fallback legacy in-memory session check
    const sessionId = this.hashSessionToken(token);
    const session = this.sessions.get(sessionId);

    if (!session) return null;

    if (Date.now() >= session.expiresAt.getTime()) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  public renewSession(token: string): Session | null {
    const session = this.getSession(token);
    if (!session) return null;

    // For signed tokens, simply return the valid session
    return session;
  }

  public revokeSession(token: string): boolean {
    if (!token) return false;
    this.revokedTokens.add(token);
    const sessionId = this.hashSessionToken(token);
    this.sessions.delete(sessionId);
    return true;
  }

  public revokeAllUserSessions(userId: string): void {
    for (const [id, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.sessions.delete(id);
      }
    }
  }

  public buildSessionCookieOptions(expiresAt: Date) {
    return {
      httpOnly: true,
      secure: appConfig.isProd,
      sameSite: 'lax' as const,
      path: '/',
      expires: expiresAt,
    };
  }
}

export const sessionStore = new SessionStore();
