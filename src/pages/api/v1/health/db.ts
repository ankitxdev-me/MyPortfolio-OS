import type { APIRoute } from 'astro';
import mongoose from 'mongoose';
import { dbManager } from '@/server/db/connection';

export const GET: APIRoute = async () => {
  const startTime = Date.now();
  let connected = false;
  let latencyMs = -1;

  try {
    await dbManager.connect();
    connected = mongoose.connection.readyState === 1;
    latencyMs = Date.now() - startTime;
  } catch (e) {
    connected = false;
  }

  const health = {
    status: connected ? 'HEALTHY' : 'UNHEALTHY',
    connected,
    readyState: mongoose.connection.readyState,
    latencyMs,
    host: mongoose.connection.host || 'localhost',
    databaseName: mongoose.connection.name || 'portfolio_os',
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(health), {
    status: connected ? 200 : 503,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
};
