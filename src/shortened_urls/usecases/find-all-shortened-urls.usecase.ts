import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShortenedUrlsService } from '../shortened_urls.service';

@Injectable()
export class FindAllShortenedUrlsUseCase {
  constructor(private readonly shortendUrlService: ShortenedUrlsService) {}
  async execute() {
    try {
      const urls = await this.shortendUrlService.findAll();
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
