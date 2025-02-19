import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShortenedUrlsService } from '../shortened_urls.service';
import { Response } from 'express';
@Injectable()
export class RedirectShortenedUrlUseCase {
  constructor(private readonly shortendUrlService: ShortenedUrlsService) {}
  async execute(shortCode: string, res: Response) {
    try {
      const url = await this.shortendUrlService.findByShortCode(shortCode);
      if (!url) {
        throw new NotFoundException('URL não encontrada');
      }
      await this.shortendUrlService.updateClicks(url.id);
      return res.redirect(url.original_url);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao gerar a url. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
