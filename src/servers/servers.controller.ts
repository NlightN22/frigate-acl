import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Server } from './server.schema';
import { ServersService } from './servers.service';
import { FindIdParams } from 'src/common/FindIdParams';
import { BASE_API_URL } from 'src/baseurl.const';

@Controller(`${BASE_API_URL}servers`)
export class ServersController {

    constructor(private serversService: ServersService) {}

    @Post()
    async create(@Body() createServerDto: Server) {
        return this.serversService.create(createServerDto)
    }

    @Get()
    async findAll(): Promise<Server[]> {
        return this.serversService.findAll()
    }

    @Get(':id')
    async findOne(@Param() {id}: FindIdParams) {
        return this.serversService.findOne(id)
    }

    @Put(':id')
    async update(@Param() {id}: FindIdParams): Promise<Server | string> {
        return this.serversService.update(id)
    }

    @Delete(':id')
    async remove(@Param() {id}: FindIdParams): Promise<Server | string>  {
        return this.serversService.remove(id)
    }

}
