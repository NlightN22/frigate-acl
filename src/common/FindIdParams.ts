import { IsMongoId } from "class-validator";

export class FindIdParams {

  @IsMongoId()
  id: string;

}
