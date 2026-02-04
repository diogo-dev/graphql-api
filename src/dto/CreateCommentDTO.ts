import { IsString, MaxLength, IsNotEmpty } from "class-validator";

export class CreateCommentDTO {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  postId: string;
}