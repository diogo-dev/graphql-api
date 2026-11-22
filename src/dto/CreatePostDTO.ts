import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreatePostDTO {

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsUUID()
  userId: string;
}
