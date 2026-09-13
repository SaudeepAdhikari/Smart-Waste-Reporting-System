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
  nodeEnv: string;
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

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

export const config = registerAs('app', (): AppConfig => {
  const mongoUri = requireEnv('MONGODB_URI');

  const jwtSecret = requireEnv('JWT_SECRET');
  const jwtExpiresIn = requireEnv('JWT_EXPIRES_IN');

  const corsOrigin = requireEnv('CORS_ORIGIN');

  const nodeEnv = process.env.NODE_ENV ?? 'development';

  return {
    port: coerceNumber(process.env.PORT, 5000),
    nodeEnv,
    mongo: { uri: mongoUri },
    jwt: { secret: jwtSecret, expiresIn: jwtExpiresIn },
    cors: { origin: corsOrigin },
  };
});

export function getConfig(): AppConfig {
  return config();
}
