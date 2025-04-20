import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

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
  short_code?: string;

  @IsString()
  comments?: string;

  tags?: CreateTagBodyDto[];
}

export class CreateTagBodyDto {
  name: string;
}
