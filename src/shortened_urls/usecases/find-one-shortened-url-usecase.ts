/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ShortenedUrlsService } from '../shortened_urls.service';
import { JwtService } from '@nestjs/jwt';
import { JwtToken } from '../../utils/token';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class FindOneShortenedUrlsUseCase {
  constructor(
    private readonly shortendUrlService: ShortenedUrlsService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(FindOneShortenedUrlsUseCase.name);
  async execute(id: string, request: Request) {
    try {
      const authorizationHeader = request.headers['authorization'];

      if (!authorizationHeader) {
        throw new HttpException(
          'Erro ao buscar a url. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const accessToken = JwtToken(String(authorizationHeader));
      const user: UserDto = await this.jwtService.decode(accessToken.trim());
      const userId: string = user.sub;
      const url = await this.shortendUrlService.findOne(id, userId);

      if (!url) {
        return {
          success: true,
          data: 'url não encontrada',
        };
      }
      return {
        success: true,
        data: url,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Erro ao buscar a url. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
