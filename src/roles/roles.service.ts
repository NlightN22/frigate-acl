import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { IsJWT, IsPositive, IsString, IsUrl } from 'class-validator';
import { Role } from './role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { verifyJWT } from '../utils/jwt.token';


class Authenticate {
    @IsJWT()
    access_token: string
    @IsPositive()
    expires_in: number
    @IsPositive()
    refresh_expires_in: number
    @IsJWT()
    refresh_token: string
    @IsString()
    token_type: string
}

@Injectable()
export class RolesService {

    private authenticate?: Authenticate
    private updateTime = 5000
    private sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    private readonly logger = new Logger(RolesService.name)

    constructor(
        @InjectModel(Role.name) private readonly roleModel: Model<Role>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.updateAllRoles()
    }

    async findAll() {
        return this.roleModel.find().exec()
    }

    async findOne(authid: string) {
        return await this.roleModel.find({authid}).exec()
    }

    async findByName(name: string) {
        return await this.roleModel.findOne({ name: name }).exec()
    }

    private async updateAllRoles() {
        while (true) {
            if (!this.authenticate) await this.fetchAccessToken()
            if (this.authenticate?.access_token) {
                if (verifyJWT(this.authenticate.access_token)) {
                    const data = await this.fetchRoles(this.authenticate.access_token)
                    if (data) {
                        const roles: Role[] = this.parseInputDto(data)
                        this.updateRolesDB(roles)
                    }
                } else if (verifyJWT(this.authenticate.refresh_token)) {
                    this.logger.debug(this.authenticate.refresh_token)
                    // TODO add update refresh token
                    this.fetchAccessToken()
                } else {
                    this.fetchAccessToken()
                }
            }
            await this.sleep(this.updateTime)
        }
    }

    private parseInputDto(data): Role[] {
        let roles: Role[] = []
        if (data) {
            data.map(role => {
                roles.push({ authId: role.id, name: role.name, })
            })
        }
        return roles
    }

    private async fetchAccessToken() {
        const authPath = '/protocol/openid-connect/token'
        const url = this.configService.get<string>('AUTH_REALM_PATH') + authPath
        const request = {
            client_id: this.configService.get<string>('AUTH_CLIENT_ID') || '',
            username: this.configService.get<string>('AUTH_CLIENT_USERNAME') || '',
            password: this.configService.get<string>('AUTH_CLIENT_PASSWORD') || '',
            grant_type: 'password',
            client_secret: this.configService.get<string>('AUTH_CLIENT_SECRET') || ''
        }
        const reqXHTML = new URLSearchParams(request).toString()
        if (reqXHTML) {
            const data = await this.httpService.axiosRef.post(url, reqXHTML)
                .then(res => {
                    this.authenticate = res.data as Authenticate
                })
                .catch((e) => {
                    this.logger.error(e)
                })
        }
    }

    private async fetchRoles(token: string) {
        const rolesPath = '/admin/realms/frigate-realm/roles'
        const hostURL = new URL(this.configService.get<string>('AUTH_REALM_PATH') || '')
        const url = hostURL.protocol + '//' + hostURL.host + rolesPath
        const data = await this.httpService.axiosRef.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            return res.data
        }).catch((e) => {
            this.logger.error(e)
            this.authenticate = undefined
            return null
        })
        return data
    }

    private async updateRolesDB(roles: Role[]) {
        roles.map(role => {
            this.createOrUpdate(role)
        })
        if (roles) this.dropNonExisting(roles)
    }

    private async createOrUpdate(role: Role) {
        const filter = { authId: role.authId }
        const updatedCamera: Role = await this.roleModel.findOneAndUpdate(filter, role, {
            new: true,
            upsert: true // Make this update into an upsert
        })
        return updatedCamera
    }

    private async dropNonExisting(roles: Role[]) {
        try {
            const rolesID: string[] = roles.map(role => role.authId)
            const { deletedCount } = await this.roleModel.find({ authId: { $nin: rolesID } }).deleteMany().exec()
            if (deletedCount !== 0) this.logger.log(`Delete non existing roles: ${deletedCount}`)
        } catch (e) {
            this.logger.error(e)
        }
    }
}
