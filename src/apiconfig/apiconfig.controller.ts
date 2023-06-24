import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { ApiconfigService } from './apiconfig.service';
import { FRIGATE_API_URL } from '../baseurl.const';
import { UserGuard } from '../common/user/user.guard';
import { getJWTRoles } from '../utils/jwt.token';

@Controller(`${FRIGATE_API_URL}config`)
export class ApiconfigController {
    constructor(
        private configService: ApiconfigService
    ) { }

    @Get()
    @UseGuards(UserGuard)
    async findAll(@Session() session: any) {
        const jwtRoles = getJWTRoles(session.user?.access_token)
        return this.configService.findAll(jwtRoles)
    }
}
