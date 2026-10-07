import { z } from 'zod';
import fs from 'node:fs';
import path from 'node:path';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4321),
  
  // Database Configuration — strictly loaded from .env (no hardcoded URLs)
  MONGODB_URI: z.string().min(1, 'MONGODB_URI must be defined in your .env file'),
  MONGODB_DB_NAME: z.string().default('portfolio_os'),
  
  // Authentication & Sessions
  AUTH_SECRET: z.string().min(1).default('portfolio_os_jwt_secret_dev_fallback_change_in_prod'),
  AUTH_EXPIRES_IN: z.string().default('7d'),
  
  // Administrator Credentials — loaded directly from .env
  ADMIN_EMAIL: z.string().email().optional().default('admin@portfolio.os'),
  ADMIN_PASSWORD: z.string().optional().default(''),
  ADMIN_NAME: z.string().optional().default('Portfolio Administrator'),
  
  // Contact & Portfolio Owner Information
  CONTACT_EMAIL: z.string().email().optional().default('contact@portfolio.dev'),
  AUTHOR_EMAIL: z.string().email().optional().default('contact@portfolio.dev'),
  
  // GitHub Integration
  GITHUB_TOKEN: z.string().optional().default(''),
  
  // Cloudinary Storage Config
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),
  
  // Analytics Feature Flags
  ANALYTICS_ENABLED: z.coerce.boolean().default(false),
});

export type EnvConfigSchema = z.infer<typeof envSchema>;

function parseDotEnvFile(): Record<string, string> {
  const envMap: Record<string, string> = {};
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=');
          if (idx !== -1) {
            const key = trimmed.substring(0, idx).trim();
            const val = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
            envMap[key] = val;
          }
        }
      }
    }
  } catch {
    // If fs reading is unavailable in browser or edge runtime, ignore
  }
  return envMap;
}

function loadEnvironmentConfig(): EnvConfigSchema {
  const metaEnv = typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env : {};
  const procEnv = typeof process !== 'undefined' && process.env ? process.env : {};
  const dotEnv = parseDotEnvFile();
  
  // Merge in order of priority: procEnv > dotEnv > metaEnv
  const merged = {
    ...metaEnv,
    ...dotEnv,
    ...procEnv,
  };

  // Allow JWT_SECRET to satisfy AUTH_SECRET if defined
  const resolvedAuthSecret = merged.AUTH_SECRET || merged.JWT_SECRET;
  if (resolvedAuthSecret) {
    merged.AUTH_SECRET = resolvedAuthSecret;
  }

  const result = envSchema.safeParse(merged);

  if (!result.success) {
    console.error('❌ Environment configuration validation failed:', result.error.format());
    throw new Error('Invalid environment configuration: MONGODB_URI is required in .env');
  }

  return result.data;
}

export const env: EnvConfigSchema = loadEnvironmentConfig();
