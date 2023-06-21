import { Module } from '@nestjs/common';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServerSchema } from './server.schema';
import { CamerasModule } from 'src/cameras/cameras.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Server', schema: ServerSchema }]),
        CamerasModule
],
    controllers: [ServersController],
    providers: [ServersService],
    exports: [MongooseModule, ServersService]
})
export class ServersModule{}
