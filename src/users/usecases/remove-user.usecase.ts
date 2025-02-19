/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class RemoveUserUseCase {
  constructor(private readonly usersService: UsersService) {}
  async execute(id: string) {
    try {
      const response = await this.usersService.findOne(id);
      if (!response) {
        throw new HttpException(
          'Erro ao trazer o usuário. Usuário não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }
      const now = new Date();
      await this.usersService.remove(id, now);

      return {
        success: true,
        data: 'Usuário removido com sucesso',
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
