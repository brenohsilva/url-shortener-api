/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly usersService: UsersService) {}
  async execute(id: string, data: UpdateUserDto) {
    try {
      const response = await this.usersService.findOne(id);
      if (!response) {
        throw new HttpException(
          'Erro ao trazer o usuário. Usuário não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      const updateResponse = await this.usersService.update(id, data);

      return {
        success: true,
        data: updateResponse,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro ao atualzar o usuário. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
