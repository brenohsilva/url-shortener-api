import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ShortenerUrlBodyDto {
  @ApiProperty({
    example: 'https://teddydigital.io',
    description: 'Url para ser encurtada',
  })
  @IsString()
  @IsNotEmpty()
  originUrl: string;
}
