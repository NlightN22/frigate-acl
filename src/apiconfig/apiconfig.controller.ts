import { Controller, Get } from '@nestjs/common';
import { FRIGATE_API_URL } from 'src/baseurl.const';
import { ApiconfigService } from './apiconfig.service';

@Controller(`${FRIGATE_API_URL}config`)
export class ApiconfigController {
    constructor(
        private configService: ApiconfigService
    ) {}

    @Get()
    async findAll() {
        return this.configService.findAll()
    }

}
