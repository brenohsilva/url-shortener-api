import { Module } from '@nestjs/common';
import { ShortenedUrlsService } from './shortened_urls.service';
import { ShortenedUrlsController } from './shortened_urls.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ShortenedUrlsController],
  providers: [ShortenedUrlsService, PrismaService],
})
export class ShortenedUrlsModule {}
