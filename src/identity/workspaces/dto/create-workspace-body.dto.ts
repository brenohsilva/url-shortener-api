import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkspaceBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  slug: string;
}
