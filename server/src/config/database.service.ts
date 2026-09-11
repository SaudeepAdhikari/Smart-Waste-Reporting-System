import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  async onModuleInit(): Promise<void> {
    const uri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      'mongodb://127.0.0.1:27017/smart-waste';

    if (!uri) {
      this.logger.error(
        'MONGODB_URI is not configured. Database features will be unavailable.'
      );
      return;
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
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await mongoose.disconnect();
    } catch {
      // ignore
    }
  }
}
