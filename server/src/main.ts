import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('app.nodeEnv') ?? 'development';
  const corsOrigin = configService.get<string>('app.cors.origin') ?? '*';

  // Configure CORS
  // In development, allow multiple local frontend origins
  // In production, only allow the specific configured origin
  let corsOptions: { origin: string | string[]; credentials: boolean };

  if (nodeEnv === 'production') {
    corsOptions = {
      origin: corsOrigin,
      credentials: true,
    };
  } else {
    // Development: allow common local frontend ports
    corsOptions = {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        corsOrigin,
      ],
      credentials: true,
    };
  }

  app.enableCors(corsOptions);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = configService.get<number>('app.port') ?? 5000;
  await app.listen(port);
  Logger.log(`API server running on http://localhost:${port}/api/v1`);
}

bootstrap().catch((error) => {
  Logger.error('Failed to start server', error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
