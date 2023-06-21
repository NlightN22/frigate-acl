import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { IsJWT, IsPositive, IsString, IsUrl } from 'class-validator';
import { setDefaultResultOrder } from 'dns';
import { urlencoded } from 'express';
import { verifyJWT } from 'src/utils/jwt.token';
import { Role } from './role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CamerasService } from 'src/cameras/cameras.service';
import { birdseyeRole } from './built-in.roles';


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

    @IsUrl()
    private authServer = 'https://oauth.komponent-m.ru:8443/'
    private request = {
        client_id: 'frigate-cli',
        username: 'frigate-admin@komponent-m.ru',
        password: 'aXYNm2jD',
        grant_type: 'password',
        client_secret: 'uCs4L5wtZBecGbMq7a2jebmB7sN9ZVsn'
    }


    private authenticate: Authenticate

    private readonly logger = new Logger(RolesService.name)

    constructor(
        @InjectModel(Role.name) private readonly roleModel: Model<Role>,
        private readonly httpService: HttpService,
    ) {
        this.updateAllRoles()
    }


    async findAll() {
        return this.roleModel.find().exec()
    }

    async findOne(id: string) {
        return await this.roleModel.findById(id)
    }

    async findByName(name: string) {
        return await this.roleModel.findOne({name: name}).exec()
    }

    private async updateAllRoles() {
        if (!this.authenticate) await this.fetchAccessToken()
        if (this.authenticate.access_token) {
            if (verifyJWT(this.authenticate.access_token)) {
                const data = await this.fetchRoles(this.authenticate.access_token)
                const roles: Role[] = this.parseInputDto(data)
                this.updateRolesDB(roles)
            } else if (verifyJWT(this.authenticate.refresh_token)) {
                this.logger.log(this.authenticate.refresh_token)
                // TODO add update refresh token
                this.fetchAccessToken()
            } else {
                this.fetchAccessToken()
            }
        }
    }

    private parseInputDto(data): Role[] {
        let roles: Role[] = []
        if (data) {
            data.map(role => {
                roles.push({ authId: role.id, name: role.name,})
            })
        }
        return roles
    }

    private async fetchAccessToken() {
        const authPath = '/realms/frigate-realm/protocol/openid-connect/token'
        const url = this.authServer + authPath
        const req = new URLSearchParams(this.request).toString()
        if (req) {
            const data = await this.httpService.axiosRef.post(url, req)
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
        const url = this.authServer + rolesPath
        const data = await this.httpService.axiosRef.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            return res.data
        }).catch((e) => {
            this.logger.error(e)
        })
        return data
    }

    private async updateRolesDB(roles: Role[]) {
        roles.map(role => {
            this.createOrUpdate(role)
        })
        this.dropNonExisting(roles)
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
            this.logger.log(`Delete non existing roles: ${deletedCount}`)
        } catch (e) {
            this.logger.error(e)
        }
    }
}
