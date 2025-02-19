import { Module } from '@nestjs/common';
import { ShortenedUrlsService } from './shortened_urls.service';
import { ShortenedUrlsController } from './shortened_urls.controller';
import { PrismaService } from 'src/prisma.service';
import { CreateShortenedUrlUseCase } from './usecases/create-shortened-url.usecase';

@Module({
  controllers: [ShortenedUrlsController],
  providers: [ShortenedUrlsService, PrismaService, CreateShortenedUrlUseCase],
})
export class ShortenedUrlsModule {}
