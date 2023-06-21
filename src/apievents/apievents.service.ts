import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EVENTS_PATH } from 'src/api.path';
import { CamerasService } from 'src/cameras/cameras.service';
import { jwtRoleMock } from 'src/test/user.jwt.mock';

@Injectable()
export class ApieventsService {
    private readonly logger = new Logger(ApieventsService.name)

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly cameraService: CamerasService,
    ) { }

    async findAll(params) {
        let res = ''
        const server =  this.configService.get<string>('FRIGATE_LOCAL_SERVER')
        const roles = jwtRoleMock.realm_access.roles // todo change to jwt roles
        if (server) {
            await this.handleRequestParams(params, roles)
            const data = await this.fetchServerEvents(server, params)
            return data
        }
        return res
    }

    private async handleRequestParams(params, roles: string[]) {
        const allowedCameras = await this.cameraService.findByRoles(roles)
        const allowedCamerasNames = allowedCameras.map(camera => camera.name)

        if (params.cameras.includes('all')) {
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
