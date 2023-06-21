import { Controller, Get, Logger, Redirect, Session, UseGuards } from '@nestjs/common';
import { SSOAuthGuard } from './sso.guard';
import { User } from 'src/common/user/user.decorator';
import { UserGuard } from 'src/common/user/user.guard';
import { getJWTRoles } from 'src/utils/jwt.token';

@Controller('auth')
export class AuthController {
    constructor(
    ) {
        console.log('AuthController created');
    }
    @Get('login')
    @UseGuards(SSOAuthGuard)
    login() {
        return
    }

    @Get('callback')
    @UseGuards(SSOAuthGuard)
    @Redirect('/')
    async callback(@User() user: any, @Session() session: Record<string, any>) {
        session.user = user;
        return user;
    }

    @Get('test')
    @UseGuards(UserGuard)
    test(@Session() session: Record<string, any>) {
        const roles = getJWTRoles(session.user.access_token)
        return `Test page.\nSession information:${JSON.stringify(roles)}`;
    }
}

