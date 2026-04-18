import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — must be called before app.listen()
  // In production on Vercel (same-origin via experimentalServices), allow the deployment URL.
  // In dev, allow localhost:5173.
  const allowedOrigin = process.env.ALLOWED_ORIGIN
    ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? true : allowedOrigin,
    credentials: true,
  });

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Backend running on http://localhost:${process.env.PORT ?? 3001}`);
}

bootstrap();
