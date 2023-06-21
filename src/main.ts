import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { AuthFilter } from './common/auth.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true }) // cors: true disable cors
  app.useGlobalPipes(new ValidationPipe())
  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
    })
  )

  app.useGlobalFilters(new AuthFilter());
  await app.listen(3000);
}
bootstrap();
