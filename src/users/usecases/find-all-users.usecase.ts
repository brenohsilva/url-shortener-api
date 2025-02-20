import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class FindAllUsersUseCase {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new Logger(FindAllUsersUseCase.name);

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
      this.logger.error(error);
      throw new HttpException(
        'Erro ao trazer os usuários. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
