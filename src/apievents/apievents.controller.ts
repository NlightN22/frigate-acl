import { Controller, Get, Query } from '@nestjs/common';
import { ApieventsService } from './apievents.service';
import { FRIGATE_API_URL } from 'src/baseurl.const';

@Controller(`${FRIGATE_API_URL}events`)
export class ApieventsController {

    constructor(
        private eventsService: ApieventsService
    ) { }

        @Get()
        findAll(@Query() params) {
            return this.eventsService.findAll(params)
        }

}
