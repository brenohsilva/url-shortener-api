/* eslint-disable @typescript-eslint/await-thenable */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserAlreadyExistsErrorFilter } from './identity/users/filters/user-already-exists.filter';
import { UserNotFoundErrorFilter } from './identity/users/filters/user-not-found.filter';
import { otelSDK } from './tracing';

async function bootstrap() {
  
  await otelSDK.start();

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalFilters(
    new UserAlreadyExistsErrorFilter(),
    new UserNotFoundErrorFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('URL Shortener')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
