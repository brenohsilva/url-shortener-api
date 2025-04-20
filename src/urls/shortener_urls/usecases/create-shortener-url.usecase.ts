/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { generateUniqueCode } from '../../../utils/generate-unique-code';
import { JwtService } from '@nestjs/jwt';
import { JwtToken } from '../../../utils/token';
import { UserDto } from 'src/identity/users/dto/user-response.dto';

import { CreateShortenerUrlDto } from '../dto/create-shortener_url.dto';
import { ShortenerUrlsService } from '../shortener-urls.service';
import { ShortenerUrlBodyDto } from '../dto/create-shortener_url-body.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundError } from 'src/common/errors/not-found.error';

@Injectable()
export class CreateShortenerUrlUseCase {
  constructor(
    private readonly shortenedUrlService: ShortenerUrlsService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  private readonly logger = new Logger(CreateShortenerUrlUseCase.name);

  async execute(data: ShortenerUrlBodyDto, request: Request) {
    try {
      const { origin_url, short_code, comments, tags } = data;
      const shortCode = short_code || generateUniqueCode();
      const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
      const shortenUrl = `${baseUrl}/${shortCode}`;

      const accessToken = JwtToken(request);
      const user: UserDto = await this.jwtService.decode(accessToken.trim());
      const userId = user?.sub ?? null;

      let workspacesId: string | undefined;

      if (userId) {
        const workspace = await this.prismaService.workspaces.findFirst({
          where: {
            slug: 'bcprodutos',
            deleted_at: null,
          },
        });

        if (!workspace) {
          throw new NotFoundError('workspace', 'id', 'bcprodutos');
        }

        workspacesId = workspace.id;
      }

      const newData: CreateShortenerUrlDto = {
        origin_url,
        short_code: shortCode,
        shorten_url: shortenUrl,
        ...(comments && { comments }),
        ...(tags && { tags }),
        ...(userId && { users_id: Number(userId) }),
        ...(workspacesId && { workspaces_id: workspacesId }),
        ...(!userId && { expires_at: new Date(Date.now() + 30 * 60 * 1000) }),
      };

      await this.shortenedUrlService.create(newData);

      return { shortenUrl: shortenUrl };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Erro ao gerar a url. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
