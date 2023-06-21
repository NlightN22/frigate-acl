import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString, IsUUID } from "class-validator";
import mongoose from "mongoose";
import { type } from "os";
import { Camera } from "src/cameras/camera.schema";

@Schema()
export class Role {

    @IsUUID()
    @Prop({required: true})
    authId: string

    @IsString()
    @Prop()
    name: string
}

export const RoleSchema = SchemaFactory.createForClass(Role)