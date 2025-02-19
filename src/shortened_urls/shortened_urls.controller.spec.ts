import { Test, TestingModule } from '@nestjs/testing';
import { ShortenedUrlsController } from './shortened_urls.controller';
import { ShortenedUrlsService } from './shortened_urls.service';

describe('ShortenedUrlsController', () => {
  let controller: ShortenedUrlsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortenedUrlsController],
      providers: [ShortenedUrlsService],
    }).compile();

    controller = module.get<ShortenedUrlsController>(ShortenedUrlsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
