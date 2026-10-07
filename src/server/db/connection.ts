import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../logger/logger';

interface DatabaseHealth {
  connected: boolean;
  readyState: number;
  host?: string;
  name?: string;
  pingMs?: number;
}

class DatabaseConnectionManager {
  private isConnected = false;

  public async connect(): Promise<typeof mongoose> {
    if (this.isConnected && mongoose.connection.readyState === 1) {
      return mongoose;
    }

    try {
      const uri = env.MONGODB_URI;
      if (!uri || uri.includes('build_placeholder') || uri.includes('<username>')) {
        logger.warn('Database connection skipped: Running with placeholder MongoDB URI.');
        return mongoose;
      }
      const opts: mongoose.ConnectOptions = {
        maxPoolSize: 10,
        minPoolSize: 2,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
        family: 4,
        dbName: 'portfolio_os',
      };

      mongoose.set('strictQuery', true);

      // Event listeners
      mongoose.connection.on('connected', () => {
        this.isConnected = true;
        logger.info('MongoDB Atlas connected successfully');
      });

      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        this.isConnected = false;
        logger.warn('MongoDB disconnected');
      });

      await mongoose.connect(uri, opts);
      this.isConnected = true;
      return mongoose;
    } catch (error) {
      logger.error('Failed to connect to MongoDB Atlas:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('MongoDB connection closed gracefully');
    } catch (error) {
      logger.error('Error during MongoDB disconnect:', error);
    }
  }

  public async checkHealth(): Promise<DatabaseHealth> {
    const readyState = mongoose.connection.readyState;
    const connected = readyState === 1;

    let pingMs: number | undefined;
    if (connected && mongoose.connection.db) {
      const start = performance.now();
      await mongoose.connection.db.admin().ping();
      pingMs = Math.round(performance.now() - start);
    }

    return {
      connected,
      readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      pingMs,
    };
  }
}

export const dbManager = new DatabaseConnectionManager();
export const connectDB = () => dbManager.connect();
