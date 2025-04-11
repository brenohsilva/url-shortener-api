import { Module } from '@nestjs/common';
import { ShortenerUrlsService } from './shortener-urls.service';
import { ShortenedUrlsController } from './shortener-urls.controller';
import { CreateShortenerUrlUseCase } from './usecases/create-shortener-url.usecase';

@Module({
  controllers: [ShortenedUrlsController],
  providers: [ShortenerUrlsService, CreateShortenerUrlUseCase],
})
export class ShortenedUrlsModule {}
