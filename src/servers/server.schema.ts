import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString, IsUrl } from "class-validator";
import { HydratedDocument } from "mongoose";

export type ServerDocument = HydratedDocument<Server>

@Schema()
export class Server {

    @IsUrl()
    @Prop({required: true})
    uri: string
    @IsString()
    @Prop()
    description: string
}


export const ServerSchema = SchemaFactory.createForClass(Server)

// ServerSchema.post('findOneAndDelete', async server => {
//     const logger = new Logger(Server.name)
//     const cameraModel = new Model<Camera>
//     try {
//         await cameraModel.deleteMany({server:server})
//     } catch (e) {
//         logger.error(e)
//     }
//     logger.log('Delete server:', server)
// })