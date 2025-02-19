/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class FindOneUserUseCase {
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
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro ao trazer o usuário. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
