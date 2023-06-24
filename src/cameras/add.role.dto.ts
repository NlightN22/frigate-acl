import { IsMongoId, IsUUID } from "class-validator"

export class SetRoleDto {
    @IsMongoId()
    cameraId: string
    @IsUUID()
    accessRoleId: string
    operation: "delete" | "add"
}