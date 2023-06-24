import { Controller, Get, Query, Session } from '@nestjs/common';
import { ApieventsService } from './apievents.service';
import { FRIGATE_API_URL } from '../baseurl.const';
import { getJWTRoles } from '../utils/jwt.token';

@Controller(`${FRIGATE_API_URL}events`)
export class ApieventsController {

    constructor(
        private eventsService: ApieventsService
    ) { }

        @Get()
        findAll(@Query() params, @Session() session: any) {
            const jwtRoles = getJWTRoles(session.user?.access_token)
            return this.eventsService.findAll(params, jwtRoles)
        }

}
