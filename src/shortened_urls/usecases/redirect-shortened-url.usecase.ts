import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ShortenedUrlsService } from '../shortened_urls.service';
import { Response } from 'express';
import { ensureUrlHasProtocol } from '../../utils/ensured-has-protocol';
@Injectable()
export class RedirectShortenedUrlUseCase {
  constructor(private readonly shortendUrlService: ShortenedUrlsService) {}
  private readonly logger = new Logger(RedirectShortenedUrlUseCase.name);
  async execute(shortCode: string, res: Response) {
    try {
      const url = await this.shortendUrlService.findByShortCode(shortCode);
      if (!url) {
        throw new NotFoundException('URL não encontrada');
      }
      const originalUrl = ensureUrlHasProtocol(url.original_url);
      await this.shortendUrlService.updateClicks(url.id);
      return res.redirect(originalUrl);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Erro ao redirecionar a url. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
