import { Controller, Get, Session, UseGuards, Request, Res } from '@nestjs/common';
import { SSOAuthGuard } from './sso.guard';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { User } from '../common/user/user.decorator';
import { UserGuard } from '../common/user/user.guard';
import { getJWTRoles } from '../utils/jwt.token';
import { hostURL } from '../common/env.const';

@Controller('auth')
export class AuthController {
    frontEndURI: string
    authServer: string
    clientId: string

    constructor(
        private readonly configService: ConfigService
    ) {
        console.log('Сreated');
        this.frontEndURI = configService.get<string>('FRIGATE_FROTEND_SERVER') || ''
        this.authServer = configService.get<string>('AUTH_REALM_PATH') || ''
        this.clientId = configService.get<string>('AUTH_CLIENT_ID') || ''
    }
    @Get('login')
    @UseGuards(SSOAuthGuard)
    login() {
        return
    }

    @Get('callback')
    @UseGuards(SSOAuthGuard)
    async callback(@User() user: any, @Session() session: Record<string, any>, @Res() res: Response) {
        if (session) {
            session.user = user;
            return res.redirect(302, this.frontEndURI)
        } else {
            return this.login
        }
    }

    @Get('roles')
    @UseGuards(UserGuard)
    test(@Session() session: Record<string, any>) {
        let roles
        if (session.user?.access_token) {
            roles = getJWTRoles(session.user.access_token)
        }
        return roles
    }

    @Get('status')
    @UseGuards(UserGuard)
    status(@Session() session: Record<string, any>) {
        return session.user !== undefined
    }

    @Get('logout')
    @UseGuards(UserGuard)
    logout(@Session() session: Record<string, any>, @Request() req: any, @Res() res: Response) {
        try {
            if (session) {
                const logoutPath = '/protocol/openid-connect/logout'
                const loginPath = hostURL.toString() + '/auth/login'
                const params = `?client_id=${this.clientId}&post_logout_redirect_uri=${loginPath}`
                const url = this.authServer + logoutPath + params
                res.redirect(302, url)
                session.user = undefined
                return
            }
        } catch (err) {
            console.error(err)
            if (err) res.redirect(this.frontEndURI);
        }
        return
    }
}