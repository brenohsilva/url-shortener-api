import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkspaceBodyDto {
  @IsString()
  @IsNotEmpty()
  workspace: string;
  @IsString()
  @IsNotEmpty()
  slug: string;
}
