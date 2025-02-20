import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Nome do usuário' })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'E-mail do usuário',
  })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha do usuário',
    minLength: 6,
  })
  password: string;
}
