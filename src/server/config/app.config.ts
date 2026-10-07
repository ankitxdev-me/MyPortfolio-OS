import { env } from './env';
import { API_ROUTES } from './constants';

export const appConfig = {
  name: 'Portfolio OS',
  version: '1.0.0',
  description: 'Operating System & CMS for Ankit Gupta Portfolio',
  env: env.NODE_ENV,
  isDev: env.NODE_ENV === 'development',
  isProd: env.NODE_ENV === 'production',
  port: env.PORT,
  apiPrefix: API_ROUTES.BASE,
  
  cors: {
    origin: env.NODE_ENV === 'production' ? ['https://portfolio-os.vercel.app'] : ['*'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },

  features: {
    authEnabled: false,
    databaseConnected: false,
    cloudinaryUploadsEnabled: false,
  },
} as const;

export type AppConfig = typeof appConfig;
