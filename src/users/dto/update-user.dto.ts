import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Jane Doe', description: 'Nome do usuário' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'jane.doe@example.com',
    description: 'E-mail do usuário',
  })
  @IsEmail()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    example: '654321',
    description: 'Senha do usuário',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
