/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtToken } from 'src/utils/token';
import { UserDto } from 'src/identity/users/dto/user-response.dto';
import { AlreadyExistsError } from 'src/identity/users/errors/already-exists.error';
import { CreateShortenerUrlDto } from './dto/create-shortener_url.dto';
import { UpdateShortenerUrlDto } from './dto/update-shortener_url.dto';

@Injectable()
export class ShortenerUrlsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async create(createShortenerUrlDto: CreateShortenerUrlDto) {
    return await this.prisma.shortenerUrls.create({
      data: createShortenerUrlDto,
    });
  }

  async findAll(request: Request) {
    const accessToken = JwtToken(request);
    const user: UserDto = await this.jwtService.decode(accessToken.trim());
    const userId: string = user.sub;

    const urls = await this.prisma.shortenerUrls.findMany({
      where: {
        userId: Number(userId),
        deleted_at: null,
      },
    });

    return {data: urls};
  }

  async findOne(id: number, request: Request) {
    const accessToken = JwtToken(request);
    const user: UserDto = await this.jwtService.decode(accessToken.trim());
    const userId: string = user.sub;

    const url = await this.prisma.shortenerUrls.findUnique({
      where: {
        id,
        userId: Number(userId),
        deleted_at: null,
      },
    });

    if (!url) {
      throw new AlreadyExistsError('url', 'id', id);
    }

    return {data: url}
  }

  async findByShortCode(shortCode: string) {
    return await this.prisma.shortenerUrls.findUnique({
      where: {
        shortCode: shortCode,
        deleted_at: null,
      },
    });
  }

  async update(id: number, updateShortenerUrlDto: UpdateShortenerUrlDto) {

    const url = await this.prisma.shortenerUrls.findUnique({
      where: {
        id
      }
    })

    if (!url) {
      throw new AlreadyExistsError('url', 'id', id);
    }

    const updatedUrl = await this.prisma.shortenerUrls.update({
      where: {
        id,
      },
      data: {
        originUrl: updateShortenerUrlDto.originiUrl,
      },
    });

    return {
      data: updatedUrl
    }
  }

  async updateClicks(id: number) {
    return await this.prisma.shortenerUrls.update({
      where: {
        id,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });
  }

  async remove(id: number) {

    const url = await this.prisma.shortenerUrls.findUnique({
      where: {
        id
      }
    })

    if (!url) {
      throw new AlreadyExistsError('url', 'id', id);
    }
    const deletedDate = new Date()
    const deletedUrl = await this.prisma.shortenerUrls.update({
      where: {
        id,
      },
      data: {
        deleted_at: deletedDate,
      },
    });

    if (deletedUrl) {
      return {message: "Url deleted successfully"}
    }
  }
}
