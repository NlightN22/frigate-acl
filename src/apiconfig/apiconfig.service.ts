import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { CONFIG_PATH } from '../api.path';
import { isString } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { CamerasService } from '../cameras/cameras.service';
import { RolesService } from '../roles/roles.service';
import { objForEach } from '../utils/parseojects';

@Injectable()
export class ApiconfigService {
    private readonly logger = new Logger(ApiconfigService.name)

    private updateTime = 5000
    private sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly cameraService: CamerasService,
        private readonly rolesService: RolesService,
    ) {
        this.updateServerConfig()
    }

    async findAll(jwtRoles: string[]) {
        let res = ''
        const server = this.configService.get<string>('FRIGATE_LOCAL_SERVER')
        if (server && jwtRoles) {
            const data = await this.fetchServerConfig(server)
            return this.handleServerConfig(data, jwtRoles)
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
        while (true) {
        if (server) {
            const data = await this.fetchServerConfig(server)
            if (data) {
                const cameras: any[] = data.cameras
                const camerasNames = this.parseCamerasNames(cameras)
                // this.logger.log(`From server ${server} get next cameras:\n\t${camerasNames.join('\n\t')}`)
                if (camerasNames) {
                    this.updateCameras(server, camerasNames)
                }
            }
        }
        await this.sleep(this.updateTime)
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
        this.cameraService.dropNonExistingRoles()
    }

}
