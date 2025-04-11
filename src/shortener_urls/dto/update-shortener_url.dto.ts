import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateShortenerUrlDto {
  @ApiProperty({
    example: 'https://teddydigital.io',
    description: 'Url Original',
  })
  @IsString()
  @IsNotEmpty()
  originiUrl: string;
  clicks?: number;
}
