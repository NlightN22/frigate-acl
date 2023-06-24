import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Camera } from './camera.schema';
import { RolesService } from '../roles/roles.service';

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

  // async updateCameraAccess(updateCamerasDto: UpdateRolesDto) {
  //   let res: Camera | null = null
  //   try {
  //     await this.cameraModel.findByIdAndUpdate(updateCamerasDto.cameraId, { $addToSet: { accessRoles: updateCamerasDto.accessRolesId } })
  //     res = await this.cameraModel.findById(updateCamerasDto.cameraId)
  //     this.logger.debug(`Update camera ${res}`)
  //     return res
  //   } catch (e) {
  //     this.logger.error(e)
  //     return res
  //   }
  // }

  async setRole(cameraId: string, roleId: string, operation: 'delete' | 'add') {
    let res
    try {
      switch (operation) {
        case 'add': {
          const isRoleExist = await this.rolesService.findOne(roleId)
          if (isRoleExist) {
            res = await this.cameraModel.findByIdAndUpdate(cameraId, { $addToSet: { accessRoles: roleId } }, { returnDocument: "after" })
          } else {
            res = "Role does not exist"
          }
          break
        }
        case 'delete': {
          res = await this.cameraModel.findByIdAndUpdate(cameraId, { $pull: { accessRoles: roleId } }, { returnDocument: "after" })
          break
        }
      }
    } catch (e) {
      this.logger.error(e)
    }
    return res
  }

  async findByRole(authId: string) {
    return await this.cameraModel.find({ accessRoles: authId }).exec()
  }

  async findByRoles(roles: string[]) {
    let allowedCameras: Camera[] = []
    for (const jwtRole of roles) {
      const dbRole = await this.rolesService.findByName(jwtRole)
      if (dbRole) {
        const roleid = dbRole.authId.toString();
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
    if (deletedCount !== 0) this.logger.log(`Delete non existing cameras: ${deletedCount}`)
  }

  async dropNonExistingRoles() {
    const roles = await this.rolesService.findAll()
    if (roles) {
      const rolesAuthIds = roles.map(role => role.authId)
      const nonExistingCameras = await this.cameraModel
        .find({
          $and: [
            { accessRoles: { $nin: rolesAuthIds } },
            { accessRoles: { $size: !0 } }
          ]
        })
        .exec()
      const nonExistingRoles = nonExistingCameras.flatMap(camera => camera.accessRoles)
      let deletedCount = 0
      nonExistingCameras.forEach(async camera => {
        nonExistingRoles.forEach(async role => {
          this.setRole(camera.id, role, "delete")
          deletedCount += 1
        })
      })
      if (deletedCount !== 0) this.logger.log(`Delete non existing roles from cameras: ${deletedCount}`)
    }
  }
}
