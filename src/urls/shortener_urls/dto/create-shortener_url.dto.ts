/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateTagBodyDto } from './create-shortener_url-body.dto';


export class CreateShortenerUrlDto {
  @ApiProperty({ example: '145', description: 'Id do usuário'})
  @IsOptional()
  @IsNumber()
  users_id?: number;

  @ApiProperty({ example: '675', description: 'Id do workspace'})
  @IsOptional()
  @IsNumber()
  workspaces_id?: string;

  @ApiProperty({example: 'KJumIA', description: 'Codigo de encurtamento'})
  @IsNotEmpty()
  @IsString()
  short_code: string;

  @ApiProperty({example: 'https://teddydigital.io', description: 'Url para ser encurtada'})
  @IsNotEmpty()
  @IsString()
  origin_url: string;

  @ApiProperty({example: 'http://localhost:3000/KJumIA', description: 'Url encurtada'})
  @IsNotEmpty()
  @IsString()
  shorten_url: string;

  @ApiProperty({example: 'Comentários sobre a URL', description: 'Comentários sobre a URL'})
  @IsString()
  comments?: string | null;

  @ApiProperty({example: ['tag1', 'tag2'], description: 'Tags associadas à URL'})
  @IsString({ each: true })
  tags?: CreateTagBodyDto[] | null;

  @IsOptional()
  @IsDate()
  expires_at?: Date;
}
