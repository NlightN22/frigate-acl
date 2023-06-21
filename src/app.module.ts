import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServersModule } from './servers/servers.module';
import { ApiconfigModule } from './apiconfig/apiconfig.module';
import { CamerasModule } from './cameras/cameras.module';
import { RolesModule } from './roles/roles.module';
import { ProxyMiddleware } from './http-proxy/http-proxy.middleware';
import { ApieventsModule } from './apievents/apievents.module';
import { CONFIG_PATH, EVENTS_PATH } from './api.path';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (
        {
          uri: configService.get<string>('MONGODB_URI'),
        }),
    }),
    ServersModule,
    ApiconfigModule,
    CamerasModule,
    RolesModule,
    ApieventsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProxyMiddleware)
      .exclude(
        '/', 'acl/(.*)', 'auth/(.*)', CONFIG_PATH, EVENTS_PATH
      )
      // .forRoutes({ path: '*', method: RequestMethod.ALL})
      .forRoutes('live/(.*)', 'api/(.*)')
  }
}

// export class AppModule {}
