import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { AuthFilter } from './common/auth.filter';
import { frontendURL, hostURL, port, wsFrontendURL } from './common/env.const';


async function bootstrap() {
  const app = await NestFactory.create(AppModule,)

  console.debug(`hostURL: ${hostURL.toString()}`)
  console.debug(`frontendURL: ${frontendURL.toString()}`)
  console.debug(`wsFrontendURL: ${wsFrontendURL.toString()}`)

  app.enableCors({
    origin: [hostURL.toString(), frontendURL.toString(), wsFrontendURL.toString()],
    credentials: true
  })
  // app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
    })
  )

  // app.useGlobalFilters(new AuthFilter()); // enable filter to autoredirect at login page every query
  await app.listen(port);
}
bootstrap();
