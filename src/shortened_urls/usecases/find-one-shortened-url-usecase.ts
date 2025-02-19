/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShortenedUrlsService } from '../shortened_urls.service';
import { JwtService } from '@nestjs/jwt';
import { JwtToken } from 'src/utils/token';

@Injectable()
export class FindOneShortenedUrlsUseCase {
  constructor(
    private readonly shortendUrlService: ShortenedUrlsService,
    private readonly jwtService: JwtService,
  ) {}
  async execute(id: string, request: Request) {
    try {
      const authorizationHeader = request.headers['authorization'];

      if (!authorizationHeader) {
        throw new HttpException(
          'Erro ao gerar a url. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const accessToken = JwtToken(authorizationHeader);
      const user = await this.jwtService.decode(accessToken.trim());
      const userId: string = user.sub;
      const url = await this.shortendUrlService.findOne(id, userId);

      if (!url) {
        return {
          success: true,
          data: 'Nenhuma url encontrada',
        };
      }
      return {
        success: true,
        data: url,
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
