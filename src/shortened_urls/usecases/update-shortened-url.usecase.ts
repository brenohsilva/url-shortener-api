/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtToken } from 'src/utils/token';
import { ShortenedUrlsService } from '../shortened_urls.service';
import { UpdateShortenedUrlDto } from '../dto/update-shortened_url.dto';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class UpdateShortenedUrlUseCase {
  constructor(
    private readonly shortendUrlService: ShortenedUrlsService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(UpdateShortenedUrlUseCase.name);

  async execute(id: string, request: Request, data: UpdateShortenedUrlDto) {
    try {
      const authorizationHeader = request.headers['authorization'];

      if (!authorizationHeader) {
        throw new HttpException(
          'Erro ao gerar a url. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const accessToken = JwtToken(String(authorizationHeader));
      const user: UserDto = await this.jwtService.decode(accessToken.trim());
      const userId: string = user.sub;
      const url = await this.shortendUrlService.findOne(id, userId);
      if (!url) {
        throw new HttpException(
          'Erro ao encontrar a url. Url não encontrada.',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.shortendUrlService.update(id, data);
      return {
        success: true,
        data: 'Url atualizada com sucesso',
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Erro ao atualizar a url. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
