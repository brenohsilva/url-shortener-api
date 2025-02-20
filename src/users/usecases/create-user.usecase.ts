import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly usersService: UsersService) {}

  private readonly logger = new Logger(CreateUserUseCase.name);

  async execute(data: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const userDataWithHashedPassword = {
        ...data,
        password: hashedPassword,
      };

      const user = await this.usersService.create(userDataWithHashedPassword);

      if (user) {
        return {
          success: true,
          data: user,
        };
      }
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Erro ao criar o usuário. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
