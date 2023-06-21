import { IsMongoId } from "class-validator"

export class SetRoleDto {
    @IsMongoId()
    cameraId: string
    @IsMongoId()
    accessRoleId: string
    operation: "delete" | "add"
}