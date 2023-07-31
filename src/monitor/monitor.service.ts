import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { frigateLocalServer } from '../common/env.const';
import { objForEach } from '../utils/parseojects';

@Injectable()
export class MonitorService {

    private readonly logger = new Logger(MonitorService.name)

    constructor (private readonly httpService: HttpService,) {}

    async getFullHealthState() {
        const data = await this.fetchServerStats(frigateLocalServer.toString().replace(/\/$/, ''))
        if (data) {
            const camerasIsWorkList: any[] = []
            objForEach(data, (name , value) => {
                // console.debug(value)
                if (value.hasOwnProperty('camera_fps')) {
                    const isWork =  value.camera_fps !== 0
                    const item = {name: name, isWork: isWork}
                    camerasIsWorkList.push(item)
                }
            })
            return camerasIsWorkList
        }
        return false
    }

    private async fetchServerStats(server: string) {
        const statsPath = '/api/stats'
        const data = await this.httpService.axiosRef.get(server + statsPath)
            .then(res => {
                return res.data
            })
            .catch((e) => {
                this.logger.error(e)
            })
        return data
    }
}
