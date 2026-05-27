import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Enable CORS so the frontend dev server can call this API.
  // FRONTEND_URL can be a comma-separated list, default to http://localhost:5173
  const allowed = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');
  app.enableCors({ origin: allowed, credentials: true });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
