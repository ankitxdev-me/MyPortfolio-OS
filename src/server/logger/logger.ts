import { appConfig } from '../config/app.config';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  }

  public debug(message: string, ...args: unknown[]): void {
    if (appConfig.isDev) {
      console.debug(this.formatMessage('debug', message), ...args);
    }
  }

  public info(message: string, ...args: unknown[]): void {
    console.info(this.formatMessage('info', message), ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    console.warn(this.formatMessage('warn', message), ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    console.error(this.formatMessage('error', message), ...args);
  }

  public request(method: string, url: string, statusCode: number, durationMs: number): void {
    const logLine = `${method} ${url} ${statusCode} - ${durationMs.toFixed(2)}ms`;
    if (statusCode >= 500) {
      this.error(`HTTP Req Fail: ${logLine}`);
    } else if (statusCode >= 400) {
      this.warn(`HTTP Req Warn: ${logLine}`);
    } else {
      this.info(`HTTP Req: ${logLine}`);
    }
  }
}

export const logger = new Logger();
