/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { generateUniqueCode } from '../../utils/generate-unique-code';
import { JwtService } from '@nestjs/jwt';
import { JwtToken } from '../../utils/token';
import { UserDto } from 'src/identity/users/dto/user-response.dto';

import { CreateShortenerUrlDto } from '../dto/create-shortener_url.dto';
import { ShortenerUrlsService } from '../shortener-urls.service';
import { ShortenerUrlBodyDto } from '../dto/shortener-url-body.dto';

@Injectable()
export class CreateShortenerUrlUseCase {
  constructor(
    private readonly shortenedUrlService: ShortenerUrlsService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(CreateShortenerUrlUseCase.name);

  async execute(data: ShortenerUrlBodyDto, request: Request) {
    try {
      const { originUrl } = data;
      const shortCode = generateUniqueCode();
      let userId: string | null = null;
      const accessToken = JwtToken(request);
      const user: UserDto = await this.jwtService.decode(accessToken.trim());
      userId = user?.sub || null;

      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

      const shortenUrl = `${baseUrl}/${shortCode}`;

      const newData: CreateShortenerUrlDto = userId
        ? {
            usersId: Number(userId),
            worskpacesId: Number(1),
            originUrl: originUrl,
            shortCode: shortCode,
            shortenUrl: shortenUrl,
          }
        : {
            originUrl: originUrl,
            shortCode: shortCode,
            shortenUrl: shortenUrl,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000),
          };

      const response = await this.shortenedUrlService.create(newData);

      if (response) {
        return { shortenUrl: shortenUrl };
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
