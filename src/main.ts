import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
    })
  );
  app.enableCors();
  await app.listen(process.env.PORT || 8000);
  console.log(`${process.env.APP_NAME} listening on port ${process.env.PORT}`);
}
bootstrap();
