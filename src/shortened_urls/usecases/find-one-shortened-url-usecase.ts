import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShortenedUrlsService } from '../shortened_urls.service';

@Injectable()
export class FindOneShortenedUrlsUseCase {
  constructor(private readonly shortendUrlService: ShortenedUrlsService) {}
  async execute(id: string) {
    try {
      const url = await this.shortendUrlService.findOne(id);
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
