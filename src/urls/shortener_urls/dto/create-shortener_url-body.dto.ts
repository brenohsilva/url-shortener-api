import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ShortenerUrlBodyDto {
  @ApiProperty({
    example: 'https://teddydigital.io',
    description: 'Url para ser encurtada',
  })
  @IsString()
  @IsNotEmpty()
  origin_url: string;

  @IsString()
  @MaxLength(6)
  @MinLength(6)
  @IsOptional()
  short_code?: string;

  @IsString()
  @IsOptional()
  comments?: string;

  @IsOptional()
  tags?: CreateTagBodyDto[];
}

export class CreateTagBodyDto {
  name: string;
}
