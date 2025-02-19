import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShortenedUrlsService } from '../shortened_urls.service';
import { generateUniqueCode } from 'src/utils/generate-unique-code';
import { CreateShortenedUrlDto } from '../dto/create-shortened_url.dto';

@Injectable()
export class CreateShortenedUrlUseCase {
  constructor(private readonly shortendUrlService: ShortenedUrlsService) {}
  async execute(original_url: string, request?: Request) {
    try {
      const url = original_url;
      const shortCode = generateUniqueCode();

      if (!request) {
        const data: CreateShortenedUrlDto = {
          original_url: url,
          short_code: shortCode,
        };

        const response = await this.shortendUrlService.create(data);
        if (response) {
          return { shortUrl: `https://localhost:3000/${shortCode}` };
        }
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro ao gerar a url. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
