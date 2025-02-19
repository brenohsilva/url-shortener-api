/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShortenedUrlsService } from '../shortened_urls.service';
import { JwtToken } from 'src/utils/token';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DeleteShortenedUrlUseCase {
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
        throw new HttpException(
          'Erro ao encontrar a url. Url não encontrada.',
          HttpStatus.NOT_FOUND,
        );
      }
      const now = new Date();
      const response = await this.shortendUrlService.remove(url.id, now);

      if (response) {
        return {
          success: true,
          data: 'Url deletada com sucesso',
        };
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro ao remover a url. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
