import { IsMongoId, IsOptional } from "class-validator";

export class CameraDto {
    @IsMongoId()
    @IsOptional()
    role_id?: string
}