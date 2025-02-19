import { Module } from '@nestjs/common';
import { ShortenedUrlsService } from './shortened_urls.service';
import { ShortenedUrlsController } from './shortened_urls.controller';
import { PrismaService } from 'src/prisma.service';
import { CreateShortenedUrlUseCase } from './usecases/create-shortened-url.usecase';
import { DeleteShortenedUrlUseCase } from './usecases/delete-shortened-url.usecase';
import { FindAllShortenedUrlsUseCase } from './usecases/find-all-shortened-urls.usecase';
import { FindOneShortenedUrlsUseCase } from './usecases/find-one-shortened-url-usecase';

@Module({
  controllers: [ShortenedUrlsController],
  providers: [
    ShortenedUrlsService,
    PrismaService,
    CreateShortenedUrlUseCase,
    DeleteShortenedUrlUseCase,
    FindAllShortenedUrlsUseCase,
    FindOneShortenedUrlsUseCase,
  ],
})
export class ShortenedUrlsModule {}
