import { PasswordHasher } from './password';
import { sessionStore, type SessionUser, SESSION_COOKIE_NAME } from './session';
import { UnauthorizedError } from '../errors/HttpError';
import { logger } from '../logger/logger';
import { PermissionManager, type Permission, type UserRole } from './permissions';
import { env } from '../config/env';

export interface AdminUserRecord extends SessionUser {
  passwordHash: string;
}

class AuthService {
  private _passwordHash: string | null = null;

  public getAdminUser(): SessionUser {
    return {
      id: 'admin_primary_user',
      email: (env.ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@portfolio.os').toLowerCase().trim(),
      name: env.ADMIN_NAME || process.env.ADMIN_NAME || 'Ankit Gupta',
      role: 'admin',
    };
  }

  /** Lazily generate (and cache) the PBKDF2 hash of the admin password from .env */
  private async getAdminHash(): Promise<string> {
    if (!this._passwordHash) {
      const adminPass = env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
      if (!adminPass) {
        logger.error('ADMIN_PASSWORD is not configured in .env');
        throw new UnauthorizedError('Administrator authentication is not configured in environment');
      }
      this._passwordHash = await PasswordHasher.hash(adminPass);
    }
    return this._passwordHash;
  }

  public async login(
    email: string,
    password: string,
    rememberMe = false
  ): Promise<{ user: SessionUser; token: string; expiresAt: Date; permissions: Permission[] }> {
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      throw new UnauthorizedError('Invalid email or password credentials');
    }

    const adminUser = this.getAdminUser();
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail !== adminUser.email) {
      logger.warn(`Login attempt failed: User email not found [${cleanEmail}]`);
      throw new UnauthorizedError('Invalid email or password credentials');
    }

    // Verify against the lazily generated admin password hash
    const hash = await this.getAdminHash();
    const isMatch = await PasswordHasher.verify(password, hash);

    if (!isMatch) {
      logger.warn(`Login attempt failed: Incorrect password for user [${cleanEmail}]`);
      throw new UnauthorizedError('Invalid email or password credentials');
    }

    const { session, token } = sessionStore.createSession(adminUser.id, rememberMe, adminUser);
    logger.info(`Login success: Administrator [${adminUser.email}] authenticated. Session ID: ${session.id.substring(0, 8)}...`);

    const permissions = PermissionManager.getPermissionsForRole(adminUser.role as UserRole);

    return {
      user: adminUser,
      token,
      expiresAt: session.expiresAt,
      permissions,
    };
  }

  public async validateSession(token: string): Promise<SessionUser | null> {
    if (!token || typeof token !== 'string' || !token.trim()) {
      return null;
    }

    const session = sessionStore.getSession(token);
    if (!session) return null;

    if (session.user) {
      return session.user;
    }

    const adminUser = this.getAdminUser();
    if (session.userId !== adminUser.id) return null;

    return adminUser;
  }

  public logout(token: string): void {
    if (token) {
      sessionStore.revokeSession(token);
    }
  }

  public getSessionTokenFromRequest(request: Request): string | null {
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(';').map((c) => c.trim());
    const sessionCookie = cookies.find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));
    if (!sessionCookie) return null;

    return sessionCookie.substring(SESSION_COOKIE_NAME.length + 1);
  }
}

export const authService = new AuthService();
