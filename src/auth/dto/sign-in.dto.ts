import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'joe.doe@hotmail.com', description: 'e-mail' })
  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @ApiProperty({ example: '123456', description: 'senha' })
  @IsNotEmpty({ message: 'A senha é obrigatório' })
  password: string;
}
