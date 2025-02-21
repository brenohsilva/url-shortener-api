import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, } from 'class-validator';

export class SignInDto {
  @ApiProperty()
  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'A senha é obrigatório' })
  password: string;
}
