import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ServersService } from 'src/servers/servers.service';
import { CONFIG_PATH } from '../api.path';
import { objForEach } from 'src/utils/parseojects';
import { isString } from 'class-validator';
import { CamerasService } from 'src/cameras/cameras.service';
import { RolesService } from 'src/roles/roles.service';
import { ConfigService } from '@nestjs/config';
import { jwtRoleMock } from 'src/test/user.jwt.mock';

@Injectable()
export class ApiconfigService {
    private readonly logger = new Logger(ApiconfigService.name)

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly cameraService: CamerasService,
        private readonly rolesService: RolesService,
    ) {
        this.updateServerConfig()
    }

    async findAll() {
        let res = ''
        const server = this.configService.get<string>('FRIGATE_LOCAL_SERVER')
        const roles = jwtRoleMock.realm_access.roles // todo change to jwt roles
        if (server) {
            const data = await this.fetchServerConfig(server)
            return this.handleServerConfig(data, roles)
        }
        return res
    }

    private async handleServerConfig(data: any, userRoles: string[]) {
        if (data) {

            const allowedCameras = await this.cameraService.findByRoles(userRoles)

            const allowedCamerasNames = allowedCameras.map(camera => camera.name)
            let handledConfig = this.dropNonExistCameras(data, allowedCamerasNames)
            handledConfig = this.setBirdsEyeRole(handledConfig, userRoles)
            return handledConfig
        }
    }

    private async setBirdsEyeRole(configData, userRoles: string[]) {
        const birdsEyeRoleName = this.configService.get<string>('BIRDS_ROLE')
        if (birdsEyeRoleName) {
            const birdseyeRoleDb = await this.rolesService.findByName(birdsEyeRoleName)
            if (birdseyeRoleDb) {
                if (userRoles.includes(birdseyeRoleDb.name)) {
                    configData.birdseye.enabled = true
                    this.logger.debug(`set birdseye to true`)
                    return configData
                } 
            }
        }
        configData.birdseye.enabled = false
        this.logger.debug(`set birdseye to false`)
        return configData
    }

    private dropNonExistCameras(configData, cameraNames: string[]) {
        if (configData) {
            objForEach(configData.cameras, (name, v) => {
                if (typeof name === 'string' && !cameraNames.includes(name)) {
                    this.logger.debug(`Delete camera from response: ${name}`)
                    delete configData.cameras[name]
                }
            })
        }
        return configData
    }

    // todo implemets multiserver
    // private async updateAllConfigs() {
    //     const servers: Server[] = await this.serverService.findAll()
    //     servers.map(async server => {
    //         const data = await this.fetchServerConfig(server)
    //         if (data) {
    //             const cameras: any[] = data.cameras
    //             const camerasNames = this.parseCamerasNames(cameras)
    //             this.logger.log(`From server ${server.description} get next cameras:\n\t${camerasNames.join('\n\t')}`)
    //             if (camerasNames) {
    //                 this.updateCameras(server, camerasNames)
    //             }
    //         }
    //     })
    // }

    private async updateServerConfig() {
        const server = this.configService.get<string>('FRIGATE_LOCAL_SERVER')
        if (server) {
            const data = await this.fetchServerConfig(server)
            if (data) {
                const cameras: any[] = data.cameras
                const camerasNames = this.parseCamerasNames(cameras)
                this.logger.log(`From server ${server} get next cameras:\n\t${camerasNames.join('\n\t')}`)
                if (camerasNames) {
                    this.updateCameras(server, camerasNames)
                }
            }
        }
    }

    private async fetchServerConfig(server: string) {
        const data = await this.httpService.axiosRef.get(server + CONFIG_PATH)
            .then(res => {
                return res.data
            })
            .catch((e) => {
                this.logger.error(e)
            })
        return data
    }

    private parseCamerasNames(cameras: any) {
        let camerasNames: string[] = []
        objForEach(cameras, (name, v) => {
            if (isString(name)) {
                camerasNames.push(name)
            }
        })
        return camerasNames
    }

    private updateCameras(server: string, camerasNames: string[]) {
        camerasNames.forEach(name => {
            this.cameraService.createOrUpdate(server, name)
        })
        this.cameraService.dropNonExisting(server, camerasNames)
    }

}
