/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new Logger(UpdateUserUseCase.name);

  async execute(id: string, data: UpdateUserDto) {
    try {
      const user = await this.usersService.findOneById(id);
      if (!user) {
        throw new HttpException(
          'Erro ao trazer o usuário. Usuário não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedData = { ...data };

      if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        updatedData.password = hashedPassword;
      } else {
        delete updatedData.password;
      }

      const updateResponse = await this.usersService.update(id, updatedData);

      return {
        success: true,
        data: updateResponse,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Erro ao atualizar o usuário. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
