import { AuditLogModel } from '../db/models/AuditLogModel';
import { logger } from '../logger/logger';

export interface LogAuditOptions {
  action: string;
  actor: string;
  resource: string;
  ipAddress?: string;
  userAgent?: string;
  status?: 'SUCCESS' | 'FAILURE';
  details?: Record<string, unknown>;
}

export class AuditService {
  /**
   * Logs security or administrative action to database and logger
   */
  public async log(options: LogAuditOptions): Promise<void> {
    try {
      logger.info(`AUDIT: [${options.action}] by ${options.actor} on ${options.resource}`);
      await AuditLogModel.create({
        action: options.action,
        actor: options.actor,
        resource: options.resource,
        ipAddress: options.ipAddress || '127.0.0.1',
        userAgent: options.userAgent || 'system',
        status: options.status || 'SUCCESS',
        details: options.details || {},
      });
    } catch (error) {
      logger.error('Failed to write AuditLog entry to MongoDB', { error });
    }
  }

  /**
   * Queries audit logs for admin review
   */
  public async getLogs(limit = 50, page = 1) {
    try {
      const skip = (page - 1) * limit;
      const logs = await AuditLogModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec();
      const total = await AuditLogModel.countDocuments();
      return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
    } catch (e) {
      return { logs: [], total: 0, page: 1, limit, totalPages: 0 };
    }
  }
}

export const auditService = new AuditService();
