import { IsString } from 'class-validator'
import { UserRO } from 'src/user/user.dto';
export class IdeaDTO {
  @IsString()
  readonly idea: string;
  @IsString()
  readonly description: string;
}

export class IdeaRO {
  id?: string;
  updated: Date;
  created: Date;
  idea: string;
  description: string;
  author: UserRO;
}