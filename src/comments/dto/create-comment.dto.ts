import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @Length(1, 30)
  postId!: string;

  @IsString()
  @Length(2, 500)
  content!: string;
}
