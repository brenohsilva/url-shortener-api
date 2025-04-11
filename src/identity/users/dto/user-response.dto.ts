import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: '123', description: 'ID do usuário' })
  sub: string;

  @ApiProperty({ example: 'John Doe', description: 'Nome do usuário' })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'E-mail do usuário',
  })
  email: string;

  @ApiProperty({ example: '123456', description: 'Senha do usuário' })
  password: string;

  @ApiProperty({
    example: '2024-02-20T12:00:00Z',
    description: 'Data de criação',
  })
  created_at: Date;

  @ApiProperty({
    example: '2024-02-21T12:00:00Z',
    description: 'Data de atualização',
  })
  updated_at: Date;

  @ApiProperty({
    example: null,
    description: 'Data de exclusão (caso deletado)',
  })
  deleted_at: Date | null;
}
