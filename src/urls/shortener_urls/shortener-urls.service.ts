/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtToken } from 'src/utils/token';
import { UserDto } from 'src/identity/users/dto/user-response.dto';

import { CreateShortenerUrlDto } from './dto/create-shortener_url.dto';
import { UpdateShortenerUrlDto } from './dto/update-shortener_url.dto';
import { AlreadyExistsError } from 'src/common/errors/already-exists.error';

import { subHours, format, subDays } from 'date-fns';
import { IQuery } from 'src/interfaces/query-interface';

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
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
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

  async findUrlsClicks(request: Request, queries: IQuery) {
    const { groupBy = 'hour', tag } = queries;
    const accessToken = JwtToken(request);
    const user: UserDto = await this.jwtService.decode(accessToken.trim());
    const userId: string = user.sub;

    let dateFrom: Date;
    let range: string[] = [];

    if (groupBy === 'hour') {
      dateFrom = subHours(new Date(), 24);
      range = Array.from({ length: 24 }, (_, i) => {
        const date = subHours(new Date(), i);
        return format(date, 'yyyy-MM-dd HH:00:00');
      }).reverse();
    } else if (groupBy === 'day') {
      dateFrom = subDays(new Date(), 7);
      range = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), i);
        return format(date, 'yyyy-MM-dd');
      }).reverse();
    } else {
      throw new BadRequestException('Invalid groupBy parameter');
    }

    const shortenerUrlsFilter: any = {
      users_id: Number(userId),
      deleted_at: null,
    };

    if (tag) {
      shortenerUrlsFilter.tags = {
        some: {
          name: {
            equals: tag,
            mode: 'insensitive',
          },
        },
      };
    }

    const clicks = await this.prisma.clicks.findMany({
      where: {
        created_at: {
          gte: dateFrom,
        },
        shortenerUrls: shortenerUrlsFilter,
      },
      select: {
        created_at: true,
      },
    });

    const clicksByGroup: { [key: string]: number } = {};

    clicks.forEach((click) => {
      let key: string;
      if (groupBy === 'hour') {
        key = format(click.created_at, 'yyyy-MM-dd HH:00:00');
      } else {
        key = format(click.created_at, 'yyyy-MM-dd');
      }
      clicksByGroup[key] = (clicksByGroup[key] || 0) + 1;
    });

    const result = range.map((item) => {
      let formattedLabel: string = '';

      if (groupBy === 'hour') {
        formattedLabel = format(new Date(item), 'hh:mmaaa');
      } else if (groupBy === 'day') {
        formattedLabel = format(new Date(item), 'yyyy-MM-dd');
      }

      return {
        time: formattedLabel,
        clicks: clicksByGroup[item] || 0,
      };
    });

    return result;
  }

  async update(
    id: number,
    updateShortenerUrlDto: UpdateShortenerUrlDto,
    request: Request,
  ) {
    const accessToken = JwtToken(request);
    const user: UserDto = await this.jwtService.decode(accessToken.trim());
    const userId: string = user.sub;

    const url = await this.prisma.shortenerUrls.findUnique({
      where: {
        id,
      },
      include: { tags: true },
    });

    if (!url) {
      throw new AlreadyExistsError('url', 'id', id);
    }

    const updatedUrl = await this.prisma.shortenerUrls.update({
      where: {
        id,
      },
      data: {
        origin_url: updateShortenerUrlDto.origin_url,
        comments: updateShortenerUrlDto.comments || null,
      },
    });

    if (updateShortenerUrlDto.tags) {
      const tagNames = updateShortenerUrlDto.tags.map((t) => t.name);
      // Busca todas as tags atuais associadas à URL
      const currentTagNames = url?.tags.map((t) => t.name) || [];

      // Determina quais tags remover e quais adicionar
      const tagsToRemove = url.tags.filter((t) => !tagNames.includes(t.name));
      const tagsToAdd = tagNames.filter(
        (name) => !currentTagNames.includes(name),
      );

      // Remove as tags não desejadas
      if (tagsToRemove.length > 0) {
        await this.prisma.shortenerUrls.update({
          where: { id },
          data: {
            tags: {
              disconnect: tagsToRemove.map((tag) => ({ id: tag.id })),
            },
          },
        });
      }

      // Adiciona novas tags (criando se necessário)
      for (const name of tagsToAdd) {
        let tag = await this.prisma.tags.findUnique({ where: { name } });

        if (!tag) {
          tag = await this.prisma.tags.create({
            data: { name, users_id: Number(userId) },
          });
        }

        await this.prisma.shortenerUrls.update({
          where: { id },
          data: {
            tags: {
              connect: { id: tag.id },
            },
          },
        });
      }
    }

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
