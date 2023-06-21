import { ArrayContains, ArrayUnique, IsArray, IsMongoId } from "class-validator";

export class UpdateRolesDto {
    @IsMongoId()
    cameraId: string
    @IsArray()
    @ArrayUnique()
    accessRolesId: string[]
}