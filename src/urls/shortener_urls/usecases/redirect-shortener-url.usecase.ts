import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ShortenerUrlsService } from '../shortener-urls.service';
import { Response } from 'express';
import { ensureUrlHasProtocol } from '../../../utils/ensured-has-protocol';
import { formatDateToISOWithoutTimezone } from 'src/utils/format-date';
@Injectable()
export class RedirectShortenedUrlUseCase {
  constructor(private readonly shortendUrlService: ShortenerUrlsService) {}

  private readonly logger = new Logger(RedirectShortenedUrlUseCase.name);

  async execute(shortCode: string, res: Response) {
    try {
      const url = await this.shortendUrlService.findByShortCode(shortCode);
      if (!url) {
        throw new NotFoundException('URL não encontrada');
      }
      const originalUrl = ensureUrlHasProtocol(url.origin_url);

      const now = formatDateToISOWithoutTimezone(new Date());
      await this.shortendUrlService.updateClicks(url.id, now);

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
