/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtToken } from 'src/utils/token';
import { UserDto } from 'src/identity/users/dto/user-response.dto';

import { CreateShortenerUrlDto } from './dto/create-shortener_url.dto';
import { UpdateShortenerUrlDto } from './dto/update-shortener_url.dto';
import { AlreadyExistsError } from 'src/common/errors/already-exists.error';

@Injectable()
export class ShortenerUrlsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async create(createShortenerUrlDto: CreateShortenerUrlDto) {
    const url = await this.prisma.shortenerUrls.create({
      data: {
        origin_url: createShortenerUrlDto.origin_url,
        short_code: createShortenerUrlDto.short_code,
        shorten_url: createShortenerUrlDto.shorten_url,
        comments: createShortenerUrlDto.comments || null,
        users_id: createShortenerUrlDto.users_id || null,
        workspaces_id: createShortenerUrlDto.workspaces_id || null,
        expires_at: createShortenerUrlDto.expires_at || null,
      },
    });

    if (createShortenerUrlDto.tags && createShortenerUrlDto.users_id) {
      for (const tag of createShortenerUrlDto.tags) {
        const existingTag = await this.prisma.tags.findUnique({
          where: { name: tag.name },
        });

        let tagId: number;

        if (existingTag) {
          tagId = existingTag.id;
        } else {
          const newTag = await this.prisma.tags.create({
            data: {
              name: tag.name,
              users_id: createShortenerUrlDto.users_id,
            },
          });
          tagId = newTag.id;
        }

        await this.prisma.shortenerUrls.update({
          where: { id: url.id },
          data: {
            tags: {
              connect: { id: tagId },
            },
          },
        });
      }
    }

    return { data: url };
  }

  async findAll(request: Request) {
    const accessToken = JwtToken(request);
    const user: UserDto = await this.jwtService.decode(accessToken.trim());
    const userId: string = user.sub;

    const urls = await this.prisma.shortenerUrls.findMany({
      where: {
        users_id: Number(userId),
        deleted_at: null,
      },
      include: {
        tags: true,
        _count: {
          select: {
            clicks: true,
          },
        },
      },
    });

    return urls;
  }

  async findOne(id: number, request: Request) {
    const accessToken = JwtToken(request);
    const user: UserDto = await this.jwtService.decode(accessToken.trim());
    const userId: string = user.sub;

    const url = await this.prisma.shortenerUrls.findUnique({
      where: {
        id,
        users_id: Number(userId),
        deleted_at: null,
      },
      include: {
        tags: true,
        clicks: true,
      },
    });

    if (!url) {
      throw new AlreadyExistsError('url', 'id', id);
    }

    return { data: url };
  }

  async findByShortCode(shortCode: string) {
    return await this.prisma.shortenerUrls.findUnique({
      where: {
        short_code: shortCode,
        deleted_at: null,
      },
    });
  }

  async update(id: number, updateShortenerUrlDto: UpdateShortenerUrlDto) {
    const url = await this.prisma.shortenerUrls.findUnique({
      where: {
        id,
      },
    });

    if (!url) {
      throw new AlreadyExistsError('url', 'id', id);
    }

    const updatedUrl = await this.prisma.shortenerUrls.update({
      where: {
        id,
      },
      data: {
        origin_url: updateShortenerUrlDto.originiUrl,
      },
    });

    return {
      data: updatedUrl,
    };
  }

  async updateClicks(id: number, date: string) {
    return await this.prisma.clicks.create({
      data: {
        shortenerUrls_id: id,
        created_at: new Date(date),
      },
    });
  }

  async remove(id: number) {
    const url = await this.prisma.shortenerUrls.findUnique({
      where: {
        id,
      },
    });

    if (!url) {
      throw new AlreadyExistsError('url', 'id', id);
    }
    const deletedDate = new Date();
    const deletedUrl = await this.prisma.shortenerUrls.update({
      where: {
        id,
      },
      data: {
        deleted_at: deletedDate,
      },
    });

    if (deletedUrl) {
      return { message: 'Url deleted successfully' };
    }
  }
}
