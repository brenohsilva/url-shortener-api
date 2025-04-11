import { Test, TestingModule } from '@nestjs/testing';
import { RedirectShortenedUrlUseCase } from '../redirect-shortener-url.usecase';
import { ShortenedUrlsService } from '../../shortener-urls.service';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

describe('RedirectShortenedUrlUseCase', () => {
  let useCase: RedirectShortenedUrlUseCase;
  let shortenedUrlsService: ShortenedUrlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedirectShortenedUrlUseCase,
        {
          provide: ShortenedUrlsService,
          useValue: {
            findByShortCode: jest.fn(),
            updateClicks: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<RedirectShortenedUrlUseCase>(
      RedirectShortenedUrlUseCase,
    );
    shortenedUrlsService =
      module.get<ShortenedUrlsService>(ShortenedUrlsService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should redirect to the original URL and update clicks', async () => {
      const shortCode = 'abc123';
      const originalUrl = 'https://example.com';
      const mockResponse = { redirect: jest.fn() } as unknown as Response;

      jest.spyOn(shortenedUrlsService, 'findByShortCode').mockResolvedValue({
        id: '123',
        users_id: 'user_456',
        short_code: 'abc123',
        original_url: 'https://example.com',
        shorten_url: 'https://short.ly/abc123',
        clicks: 0,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null, //
      });
      jest.spyOn(shortenedUrlsService, 'updateClicks').mockResolvedValue({
        id: '123',
        users_id: 'user_456',
        short_code: 'abc123',
        original_url: 'https://example.com',
        shorten_url: 'https://short.ly/abc123',
        clicks: 0,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null, //
      });

      await useCase.execute(shortCode, mockResponse);

      expect(shortenedUrlsService.findByShortCode).toHaveBeenCalledWith(
        shortCode,
      );
      expect(shortenedUrlsService.updateClicks).toHaveBeenCalledWith('123');
      expect(mockResponse.redirect).toHaveBeenCalledWith(originalUrl);
    });

    it('should throw NotFoundException if URL is not found', async () => {
      const shortCode = 'abc123';
      const mockResponse = { redirect: jest.fn() } as unknown as Response;

      jest
        .spyOn(shortenedUrlsService, 'findByShortCode')
        .mockResolvedValue(null);

      await expect(useCase.execute(shortCode, mockResponse)).rejects.toThrow(
        new NotFoundException(
          'Erro ao redirecionar a url. Tente novamente mais tarde.',
        ),
      );
    });

    it('should throw HttpException if an error occurs', async () => {
      const shortCode = 'abc123';
      const mockResponse = { redirect: jest.fn() } as unknown as Response;

      jest
        .spyOn(shortenedUrlsService, 'findByShortCode')
        .mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute(shortCode, mockResponse)).rejects.toThrow(
        new HttpException(
          'Erro ao redirecionar a url. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
