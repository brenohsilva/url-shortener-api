import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly usersService: UsersService) {}

  async execute(data: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const userDataWithHashedPassword = {
        ...data,
        password: hashedPassword,
      };

      const response = await this.usersService.create(
        userDataWithHashedPassword,
      );

      if (response) {
        return {
          success: true,
          data: response,
        };
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro ao criar o usuário. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
