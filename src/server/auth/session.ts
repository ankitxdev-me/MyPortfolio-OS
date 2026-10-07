import crypto from 'node:crypto';
import { appConfig } from '../config/app.config';

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  rememberMe: boolean;
  createdAt: Date;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

export const SESSION_COOKIE_NAME = 'portfolio_os_session';
const DEFAULT_SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const REMEMBER_ME_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const globalForSession = globalThis as unknown as {
  __portfolio_os_sessions_map__?: Map<string, Session>;
};

if (!globalForSession.__portfolio_os_sessions_map__) {
  globalForSession.__portfolio_os_sessions_map__ = new Map<string, Session>();
}

class SessionStore {
  private get sessions(): Map<string, Session> {
    return globalForSession.__portfolio_os_sessions_map__!;
  }

  public generateSessionToken(): string {
    const bytes = crypto.randomBytes(32);
    return bytes.toString('hex');
  }

  public hashSessionToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  public createSession(userId: string, rememberMe = false): { session: Session; token: string } {
    const token = this.generateSessionToken();
    const sessionId = this.hashSessionToken(token);
    const duration = rememberMe ? REMEMBER_ME_EXPIRY_MS : DEFAULT_SESSION_EXPIRY_MS;
    const expiresAt = new Date(Date.now() + duration);

    const session: Session = {
      id: sessionId,
      userId,
      expiresAt,
      rememberMe,
      createdAt: new Date(),
    };

    this.sessions.set(sessionId, session);
    return { session, token };
  }

  public getSession(token: string): Session | null {
    if (!token) return null;
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

    const duration = session.rememberMe ? REMEMBER_ME_EXPIRY_MS : DEFAULT_SESSION_EXPIRY_MS;
    session.expiresAt = new Date(Date.now() + duration);
    this.sessions.set(session.id, session);
    return session;
  }

  public revokeSession(token: string): boolean {
    if (!token) return false;
    const sessionId = this.hashSessionToken(token);
    return this.sessions.delete(sessionId);
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
