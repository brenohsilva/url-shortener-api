import { Injectable } from '@nestjs/common';
import { CreateShortenedUrlDto } from './dto/create-shortened_url.dto';
import { UpdateShortenedUrlDto } from './dto/update-shortened_url.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ShortenedUrlsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createShortenedUrlDto: CreateShortenedUrlDto) {
    return await this.prisma.shortened_urls.create({
      data: createShortenedUrlDto,
    });
  }

  async findAll() {
    return await this.prisma.shortened_urls.findMany({
      where: {
        deleted_at: null,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.shortened_urls.findUnique({
      where: {
        id,
        deleted_at: null,
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

  async updateClicks(id: string, updateShortenedUrlDto: UpdateShortenedUrlDto) {
    return await this.prisma.shortened_urls.update({
      where: {
        id,
      },
      data: {
        clicks: updateShortenedUrlDto.clicks,
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
