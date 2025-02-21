import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Este e-mail já está cadastrado.');
      }

      this.logger.error(error);
      throw new HttpException(
        'Erro ao criar o usuário. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
