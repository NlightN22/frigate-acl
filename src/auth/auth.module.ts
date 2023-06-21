import { Module } from '@nestjs/common';
import { CLIENT, PASSPORT } from './auth.constants';
import { Issuer, Strategy } from 'openid-client';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as passport from 'passport';

@Module({
    imports: [ConfigModule],
    providers: [
      {
        provide: CLIENT,
        useFactory: async (configService: ConfigService) => {
          const oneLoginIssuer = await Issuer.discover('https://oauth.komponent-m.ru:8443/realms/frigate-realm/.well-known/openid-configuration');
          return new oneLoginIssuer.Client({
            'client_id': configService.get<string>('AUTH_CLIENT_ID') || '',
            'client_secret': configService.get<string>('AUTH_CLIENT_SECRET'),
            'redirect_uris': ['http://localhost:3000/auth/callback'],
            'response_types': ['code'],
          });
        },
        inject: [ConfigService]
      },
      {
        provide: PASSPORT,
        useFactory: (client) => {
          passport.use(
            'sso',
            new Strategy({ client }, (tokenSet, userinfo, done) => {
              // console.log('tokenset', tokenSet);
              // console.log('access_token', tokenSet.access_token);
              // console.log('id_token', tokenSet.id_token);
              // console.log('claims', tokenSet.claims);
              // console.log('userinfo', userinfo);
              return done(null, tokenSet);
              // return done(null, userinfo);
            })
          )
          return passport;
        },
        inject: [CLIENT]
      }
    ],
    controllers: [AuthController]
  })
  export class AuthModule {
  
  }
