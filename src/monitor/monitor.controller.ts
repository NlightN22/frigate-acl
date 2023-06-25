import { Controller, Get } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { BASE_API_URL } from '../baseurl.const';

@Controller(`${BASE_API_URL}monitor`)
export class MonitorController {
    constructor(private readonly monitorService: MonitorService) {}

    @Get()
    getAll() {
        return this.monitorService.getFullHealthState()
    }
}
