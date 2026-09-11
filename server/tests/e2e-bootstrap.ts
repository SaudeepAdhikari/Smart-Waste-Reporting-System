import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';

async function main() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log(`[e2e] In-memory MongoDB URI: ${uri}`);
  process.env.MONGODB_URI = uri;

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: '*', credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = configService.get<number>('app.port') ?? 5050;
  process.env.PORT = String(port);
  console.log(`[e2e] E2E test server starting on http://localhost:${port}`);
  await app.listen(port);

  console.log('[e2e] Ready. Press Ctrl+C to stop.');
}

main().catch((error) => {
  console.error('[e2e] Failed to start', error);
  process.exit(1);
});
