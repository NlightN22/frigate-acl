import { Injectable, Logger } from '@nestjs/common';
import { Server } from './server.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Camera } from '../cameras/camera.schema';

@Injectable()
export class ServersService {
  private readonly logger = new Logger(ServersService.name)

  constructor(
    @InjectModel('Server') private readonly serverModel: Model<Server>,
    @InjectModel(Camera.name) private readonly cameraModel: Model<Camera>,
  ) {}


  async create(createServerDto: Server): Promise<Server> {
    const createdServer = new this.serverModel(createServerDto);
    return createdServer.save();
  }

  async findAll(): Promise<Server[]> {
    return this.serverModel.find().exec();
  }

  async findOne(id: string) {
    return await this.serverModel.findById(id)
  }

  async update(id: string): Promise<Server | string> {
    const res = await this.serverModel.findByIdAndUpdate(id, {returnDocument: "after"})
    return res || ''
  }

  async remove(id: string): Promise<Server | string> {
    try {
      await this.cameraModel.deleteMany({ server: id })
      const res = await this.serverModel.findByIdAndDelete(id)
      return res || ''
    }
    catch (error) {
      this.logger.error(error)
      return ''
    }
  }
}
