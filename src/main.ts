import { NestFactory, NestApplication } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication & NestApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
    }),
  );

  // Serve static files
  app.useStaticAssets(path.join(__dirname, '../uploads'));

  app.enableCors();
  await app.listen(process.env.PORT || 8000);
  console.log(`${process.env.APP_NAME} listening on port ${process.env.PORT}`);
}
bootstrap();