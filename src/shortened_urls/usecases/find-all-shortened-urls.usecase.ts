/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShortenedUrlsService } from '../shortened_urls.service';
import { JwtToken } from 'src/utils/token';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class FindAllShortenedUrlsUseCase {
  constructor(
    private readonly shortendUrlService: ShortenedUrlsService,
    private readonly jwtService: JwtService,
  ) {}
  async execute(request: Request) {
    try {
      const authorizationHeader = request.headers['authorization'];
      if (!authorizationHeader) {
        throw new HttpException(
          'Erro ao gerar a url. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const accessToken = JwtToken(String(authorizationHeader));
      const user = await this.jwtService.decode(accessToken.trim());
      const userId: string = user.sub;
      const urls = await this.shortendUrlService.findAll(userId);
      if (!urls || urls.length == 0) {
        return {
          success: true,
          data: 'Nenhuma url encontrada',
        };
      }
      return {
        success: true,
        data: urls,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro ao gerar a url. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
