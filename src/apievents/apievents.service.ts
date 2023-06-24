import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CamerasService } from '../cameras/cameras.service';
import { EVENTS_PATH } from '../api.path';

@Injectable()
export class ApieventsService {
    private readonly logger = new Logger(ApieventsService.name)

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly cameraService: CamerasService,
    ) { }

    async findAll(params, jwtRoles: string[]) {
        let res = ''
        const server =  this.configService.get<string>('FRIGATE_LOCAL_SERVER')
        if (server && jwtRoles) {
            await this.handleRequestParams(params, jwtRoles)
            const data = await this.fetchServerEvents(server, params)
            return data
        }
        return res
    }

    private async handleRequestParams(params, roles: string[]) {
        const allowedCameras = await this.cameraService.findByRoles(roles)
        const allowedCamerasNames = allowedCameras.map(camera => camera.name)

        if (params.cameras && params.cameras.includes('all')) {
            params.cameras = allowedCamerasNames.join(",")
        }
        return params
    }

    private async fetchServerEvents(server: string, params: string) {
        const data = await this.httpService.axiosRef.get(server + EVENTS_PATH, { params })
            .then(res => {
                return res.data
            })
            .catch((e) => {
                this.logger.error(e)
            })
        return data
    }
}
