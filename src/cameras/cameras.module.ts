import { Module } from '@nestjs/common';
import { CamerasService } from './cameras.service';
import { CamerasController } from './cameras.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Camera, CameraSchema } from './camera.schema';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Camera.name, schema: CameraSchema }]),
    RolesModule
  ],
  controllers: [CamerasController],
  providers: [CamerasService],
  exports: [CamerasService, MongooseModule]
})
export class CamerasModule {}
