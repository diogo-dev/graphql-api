import { IsString, MaxLength, IsNotEmpty, IsUUID } from "class-validator";

export class CreateCommentDTO {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  content: string;

  @IsUUID()
  postId: string;

  @IsUUID()
  userId: string;
}
