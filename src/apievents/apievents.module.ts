import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApieventsService } from './apievents.service';
import { ApieventsController } from './apievents.controller';
import { CamerasModule } from '../cameras/cameras.module';

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
