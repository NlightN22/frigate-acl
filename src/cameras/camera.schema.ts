import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Role } from "src/roles/role.schema";
import { Server } from "src/servers/server.schema";

@Schema()
export class Camera {
    @Prop({required: true})
    name: string

    @Prop()
    server: string

    @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: Role.name}] })
    accessRoles: Role[]
}
export const CameraSchema = SchemaFactory.createForClass(Camera)
