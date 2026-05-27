import { IsString, Length } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @Length(2, 500)
  content!: string;
}
