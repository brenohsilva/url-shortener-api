/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class FindAllUsersUseCase {
  constructor(private readonly usersService: UsersService) {}
  async execute() {
    try {
      const response = await this.usersService.findAll();
      if (response) {
        return {
          success: true,
          data: response,
        };
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro ao trazer os usuários. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
