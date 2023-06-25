import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { AuthFilter } from './common/auth.filter';
import { frontendURL, hostURL, mongoDbUrl, port, wsFrontendURL } from './common/env.const';


async function bootstrap() {

  console.debug(`[MAIN] \thostURL: ${hostURL.toString()}`)
  console.debug(`[MAIN] \tfrontendURL: ${frontendURL.toString()}`)
  console.debug(`[MAIN] \twsFrontendURL: ${wsFrontendURL.toString()}`)
  console.debug(`[MAIN] \tmongoDbUrl: ${mongoDbUrl.toString()}`)

  const app = await NestFactory.create(AppModule,)
  
  const corsAllowed: string[] = [hostURL.toString(), frontendURL.toString(), wsFrontendURL.toString()].map(cors => cors.replace(/\/$/, '') ) 
  console.debug(`[MAIN] CORS enabled hosts: ${corsAllowed.join(', ')}`)

  app.enableCors({
    origin: corsAllowed,
    credentials: true
  })
  app.useGlobalPipes(new ValidationPipe())
  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
    })
  )

  // app.useGlobalFilters(new AuthFilter()); // enable filter to autoredirect at login page every query
  await app.listen(port) 
}
bootstrap();
