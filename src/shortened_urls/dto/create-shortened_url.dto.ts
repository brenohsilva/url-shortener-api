import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShortenedUrlDto {
  @ApiProperty({
    example: 'cbcc38ca-b3d5-411a-b355-511514c26edb',
    description: 'Id do usuário',
  })
  @IsString()
  users_id?: string;
  @ApiProperty({
    example: 'KJumIA',
    description: 'Codigo de encurtamento',
  })
  @IsString()
  short_code: string;
  @ApiProperty({
    example: 'https://teddydigital.io',
    description: 'Url para ser encurtada',
  })
  @IsString()
  original_url: string;
  @ApiProperty({
    example: 'http://localhost:3000/KJumIA',
    description: 'Url encurtada',
  })
  shorten_url: string;
}

export class ShortenedUrlBodyDto {
  @ApiProperty({
    example: 'https://teddydigital.io',
    description: 'Url para ser encurtada',
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}
