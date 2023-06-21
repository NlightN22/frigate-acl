import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Camera } from './camera.schema';
import { Server } from 'src/servers/server.schema';
import { UpdateRolesDto } from './update.roles.dto';
import { Role } from 'src/roles/role.schema';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class CamerasService {
  private readonly logger = new Logger(CamerasService.name)

  constructor(
    @InjectModel(Camera.name) private readonly cameraModel: Model<Camera>,
    private readonly rolesService: RolesService
  ) { }

  async findAll(roleId?: string) {
    let query
    if (roleId) query = { accessRoles: roleId }
    const res: Camera[] = await this.cameraModel.find(query).exec()
    return res
  }

  async findOne(id: string) {
    return await this.cameraModel.findById(id)
  }

  async updateCameraAccess(updateCamerasDto: UpdateRolesDto) {
    let res: Camera | null = null
    try {
      await this.cameraModel.findByIdAndUpdate(updateCamerasDto.cameraId, { $addToSet: { accessRoles: updateCamerasDto.accessRolesId } })
      res = await this.cameraModel.findById(updateCamerasDto.cameraId)
      this.logger.debug(`Update camera ${res}`)
      return res
    } catch (e) {
      this.logger.error(e)
      return res
    }
  }

  async setRole(cameraId: string, roleId: string, operation: 'delete' | 'add') {
    let res
    try {
      switch (operation) {
        case 'add': {
          const isRoleExist = await this.rolesService.findOne(roleId)
          if (isRoleExist) {
            res = await this.cameraModel.findByIdAndUpdate(cameraId, { $addToSet: { accessRoles: [roleId] } }, {returnDocument: "after"} )
          } else {
            res = "Role does not exist"
          }
          break
        }
        case 'delete': {
          res = await this.cameraModel.findByIdAndUpdate(cameraId, { $pull: { accessRoles: roleId } }, {returnDocument: "after"})
          break
        }
      }
    } catch (e) {
      this.logger.error(e)
    }
    return res
  }

  async findByRole(roleId: string) {
    return await this.cameraModel.find({accessRoles: roleId}).exec()
  }

  async findByRoles(roles: string[]) {
    let allowedCameras: Camera[] = []
    for (const jwtRole of roles) {
        const dbRole = await this.rolesService.findByName(jwtRole)
        if (dbRole) {
            const roleid = dbRole._id.toString();
            const roleCameras: Camera[] = await this.findByRole(roleid)
            if (roleCameras) {
                allowedCameras = allowedCameras.concat(roleCameras);
            }
        }
    }
    return allowedCameras
  }

  async deleteRole(cameraId: string, roleId: string) {
    let res
    try {
      const isRoleExist = await this.rolesService.findOne(roleId)
      if (isRoleExist) {
      }
    } catch (e) {
      this.logger.error(e)
    }
  }

  async createOrUpdate(server: string, cameraName: string) {
    const filter = { name: cameraName, server: server }
    const update = { name: cameraName, server: server }
    const updatedCamera: Camera = await this.cameraModel.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true // Make this update into an upsert
    })
    return updatedCamera
  }

  async dropNonExisting(server: string, newCameraNamesList: string[]) {
    const { deletedCount } = await this.cameraModel.find({ name: { $nin: newCameraNamesList } }).deleteMany().exec()
    this.logger.log(`Delete non existing cameras: ${deletedCount}`)
  }

}
