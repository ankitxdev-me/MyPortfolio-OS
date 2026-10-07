import type { z } from 'zod';
import type { envSchema } from '../config/env';

export type EnvConfig = z.infer<typeof envSchema>;
