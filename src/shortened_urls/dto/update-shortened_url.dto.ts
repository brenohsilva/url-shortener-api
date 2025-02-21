import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateShortenedUrlDto {
  @ApiProperty({
    example: 'https://teddydigital.io',
    description: 'Url Original',
  })
  @IsString()
  @IsNotEmpty()
  original_url: string;
  clicks?: number;
}
