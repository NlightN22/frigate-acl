import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString, IsUUID } from "class-validator";

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