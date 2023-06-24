import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import { BASE_API_URL } from '../baseurl.const';

@Controller(`${BASE_API_URL}roles`)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

   // asdas
  @Get()
  findAll() {
    return this.rolesService.findAll()
  }
}
