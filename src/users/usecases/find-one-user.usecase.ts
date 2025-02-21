import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class FindOneUserUseCase {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new Logger(FindOneUserUseCase.name);

  async execute(id: string) {
    try {
      const response = await this.usersService.findOneById(id);
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
      this.logger.error(error);
      throw new HttpException(
        'Erro ao trazer o usuário. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
