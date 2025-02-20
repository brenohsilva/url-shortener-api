import { Injectable } from '@nestjs/common';
import { CreateShortenedUrlDto } from './dto/create-shortened_url.dto';
import { UpdateShortenedUrlDto } from './dto/update-shortened_url.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ShortenedUrlsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createShortenedUrlDto: CreateShortenedUrlDto) {
    return await this.prisma.shortened_urls.create({
      data: createShortenedUrlDto,
    });
  }

  async findAll(users_id: string) {
    return await this.prisma.shortened_urls.findMany({
      where: {
        users_id,
        deleted_at: null,
      },
    });
  }

  async findOne(id: string, users_id: string) {
    return await this.prisma.shortened_urls.findUnique({
      where: {
        id,
        users_id,
        deleted_at: null,
      },
    });
  }

  async findByShortCode(shortCode: string) {
    return await this.prisma.shortened_urls.findUnique({
      where: {
        short_code: shortCode,
      },
    });
  }

  async update(id: string, updateShortenedUrlDto: UpdateShortenedUrlDto) {
    return await this.prisma.shortened_urls.update({
      where: {
        id,
      },
      data: {
        original_url: updateShortenedUrlDto.original_url,
      },
    });
  }

  async updateClicks(id: string) {
    return await this.prisma.shortened_urls.update({
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

  async remove(id: string, deletedDate: Date) {
    return await this.prisma.shortened_urls.update({
      where: {
        id,
      },
      data: {
        deleted_at: deletedDate,
      },
    });
  }
}
