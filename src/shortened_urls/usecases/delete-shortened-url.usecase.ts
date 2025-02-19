import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShortenedUrlsService } from '../shortened_urls.service';

@Injectable()
export class DeleteShortenedUrlUseCase {
  constructor(private readonly shortendUrlService: ShortenedUrlsService) {}
  async execute(id: string) {
    try {
      const url = await this.shortendUrlService.findOne(id);
      if (!url) {
        throw new HttpException(
          'Erro ao encontrar a url. Url não encontrada.',
          HttpStatus.NOT_FOUND,
        );
      }
      const now = new Date();
      const response = await this.shortendUrlService.remove(id, now);

      if (response) {
        return {
          success: true,
          data: 'Url deletada com sucesso',
        };
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro ao trazer o usuário. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
