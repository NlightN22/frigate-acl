import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApieventsService } from './apievents.service';
import { ApieventsController } from './apievents.controller';
import { RolesModule } from 'src/roles/roles.module';
import { CamerasModule } from 'src/cameras/cameras.module';
import { ServersModule } from 'src/servers/servers.module';

@Module({
    imports: [
        HttpModule.register({
            timeout: 30000,
            maxRedirects: 1
        }),
        CamerasModule,
    ],
    providers: [ApieventsService],
    controllers: [ApieventsController]
})

export class ApieventsModule { }
