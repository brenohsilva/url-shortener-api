/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ShortenedUrlsService } from '../shortened_urls.service';
import { generateUniqueCode } from '../../utils/generate-unique-code';
import {
  CreateShortenedUrlDto,
  ShortenedUrlBodyDto,
} from '../dto/create-shortened_url.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtToken } from '../../utils/token';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class CreateShortenedUrlUseCase {
  constructor(
    private readonly shortenedUrlService: ShortenedUrlsService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(CreateShortenedUrlUseCase.name);

  async execute(data: ShortenedUrlBodyDto, request: Request) {
    try {
      const { url } = data;
      const shortCode = generateUniqueCode();
      let userId: string | null = null;
      const authorizationHeader = request.headers['authorization'];
      if (authorizationHeader) {
        const accessToken = JwtToken(String(authorizationHeader));
        const user: UserDto = await this.jwtService.decode(accessToken.trim());
        userId = user?.sub || null;
      }
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

      const shortUrl = `${baseUrl}/${shortCode}`;

      const newData: CreateShortenedUrlDto = userId
        ? {
            users_id: userId,
            original_url: url,
            short_code: shortCode,
            shorten_url: shortUrl,
          }
        : { original_url: url, short_code: shortCode, shorten_url: shortUrl };

      const response = await this.shortenedUrlService.create(newData);

      if (response) {
        return { shortUrl: shortUrl };
      }
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Erro ao gerar a url. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
