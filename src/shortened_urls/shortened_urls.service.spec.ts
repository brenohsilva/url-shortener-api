import { Test, TestingModule } from '@nestjs/testing';
import { ShortenedUrlsService } from './shortened_urls.service';

describe('ShortenedUrlsService', () => {
  let service: ShortenedUrlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortenedUrlsService],
    }).compile();

    service = module.get<ShortenedUrlsService>(ShortenedUrlsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
