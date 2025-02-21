import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ example: 'Jane Doe', description: 'Nome do usuário' })
  name?: string;

  @ApiPropertyOptional({
    example: 'jane.doe@example.com',
    description: 'E-mail do usuário',
  })
  email?: string;

  @ApiPropertyOptional({
    example: '654321',
    description: 'Senha do usuário',
    minLength: 6,
  })
  password?: string;
}
