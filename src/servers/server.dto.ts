import { IsMongoId, IsUrl } from "class-validator"

export class GetServerDto {
    @IsMongoId()
    id: string
}