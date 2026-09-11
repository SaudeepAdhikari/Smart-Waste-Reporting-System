import { registerAs } from '@nestjs/config';

export interface MongoConfig {
  uri: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface CorsConfig {
  origin: string;
}

export interface AppConfig {
  port: number;
  mongo: MongoConfig;
  jwt: JwtConfig;
  cors: CorsConfig;
}

function coerceNumber(value: string | undefined, fallback: number): number {
  if (value === undefined || value === '') {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const config = registerAs('app', (): AppConfig => {
  const mongoUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/smart-waste';

  const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

  return {
    port: coerceNumber(process.env.PORT, 5000),
    mongo: { uri: mongoUri },
    jwt: { secret: jwtSecret, expiresIn: jwtExpiresIn },
    cors: { origin: corsOrigin },
  };
});

export function getConfig(): AppConfig {
  return config();
}
