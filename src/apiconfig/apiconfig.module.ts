import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiconfigService } from './apiconfig.service';
import { ApiconfigController } from './apiconfig.controller';
import { ServersModule } from '../servers/servers.module';
import { CamerasModule } from '../cameras/cameras.module';
import { RolesModule } from '../roles/roles.module';

@Module({
    imports: [
        HttpModule.register({
            timeout: 30000,
            maxRedirects: 1
        }),
        ServersModule,
        CamerasModule,
        RolesModule
    ],
    providers: [ApiconfigService],
    controllers: [ApiconfigController]
})
export class ApiconfigModule { }
