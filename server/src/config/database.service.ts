import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  async onModuleInit(): Promise<void> {
    const uri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI;

    if (!uri) {
      const error = new Error('MONGODB_URI is not configured');
      this.logger.error('MONGODB_URI is not configured. Database connection failed.');
      throw error;
    }

    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 20,
      });
      this.logger.log(`Connected to MongoDB at ${uri}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Unable to connect to MongoDB at ${uri}: ${message}`);
      throw new Error(`MongoDB connection failed: ${message}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await mongoose.disconnect();
      this.logger.log('Disconnected from MongoDB');
    } catch {
      // ignore
    }
  }
}
