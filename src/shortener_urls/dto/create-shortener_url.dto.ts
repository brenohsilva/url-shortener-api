/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShortenerUrlDto {
  @ApiProperty({ example: '145', description: 'Id do usuário'})
  @IsOptional()
  @IsNumber()
  usersId?: number;

  @ApiProperty({ example: '675', description: 'Id do workspace'})
  @IsOptional()
  @IsNumber()
  worskpacesId?: number;

  @ApiProperty({example: 'KJumIA', description: 'Codigo de encurtamento'})
  @IsNotEmpty()
  @IsString()
  shortCode: string;

  @ApiProperty({example: 'https://teddydigital.io', description: 'Url para ser encurtada'})
  @IsNotEmpty()
  @IsString()
  originUrl: string;

  @ApiProperty({example: 'http://localhost:3000/KJumIA', description: 'Url encurtada'})
  @IsNotEmpty()
  @IsString()
  shortenUrl: string;

  @IsOptional()
  @IsDate()
  expiresAt?: Date;
}
