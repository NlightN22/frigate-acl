import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Camera {
    @Prop({required: true})
    name: string

    @Prop()
    server: string

    @Prop()
    accessRoles: string[]
}
export const CameraSchema = SchemaFactory.createForClass(Camera)
