import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, Logger, ValidationPipe, Session, UseGuards } from '@nestjs/common';
import { CamerasService } from './cameras.service';
import { BASE_API_URL } from 'src/baseurl.const';
import { FindIdParams } from 'src/common/find.id.params';
import { UpdateRolesDto } from './update.roles.dto';
import { CameraDto } from './camera.dto';
import { SetRoleDto } from './add.role.dto';
import { AdminGuard } from '../common/admin/admin.guard';

@Controller(`${BASE_API_URL}cameras`)
export class CamerasController {
  private readonly logger = new Logger(CamerasController.name)
  constructor(private readonly camerasService: CamerasService) { }

  @Get()
  findAll(@Query() cameraDto: CameraDto) {
    return this.camerasService.findAll(cameraDto.role_id)
  }

  @Get(':id')
  findOne(@Param() { id }: FindIdParams) {
    return this.camerasService.findOne(id);
  }

  @Put()
  @UseGuards(AdminGuard)
  setRole(@Body() setRoleDto: SetRoleDto) {
    return this.camerasService.setRole(setRoleDto.cameraId, setRoleDto.accessRoleId, setRoleDto.operation)
  }
}
