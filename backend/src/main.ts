import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  const raw =
    config.get<string>('CORS_ORIGIN') ?? 'http://localhost:5173';
  const origins = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const fallback = 'http://localhost:5173';
  const origin =
    origins.length === 0
      ? fallback
      : origins.length === 1
        ? origins[0]
        : origins;
  app.enableCors({ origin, credentials: true });
  const port = config.get<number>('PORT') ?? 3333;

  // Raiz sem prefixo: o restante da API está em /api/*
  app.getHttpAdapter().get('/', (_req, res) => {
    res.status(200).json({
      ok: true,
      service: 'futpro-api',
      apiBase: '/api',
      hint: 'O frontend roda em http://localhost:5173. Ex.: POST /api/auth/login',
    });
  });

  await app.listen(port);
}
bootstrap();
