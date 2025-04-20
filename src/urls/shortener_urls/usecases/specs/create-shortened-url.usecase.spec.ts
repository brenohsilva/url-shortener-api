import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import { ShortenedUrlsService } from '../../shortener-urls.service';
import { CreateShortenedUrlUseCase } from '../create-shortener-url.usecase';

type MockedShortenedUrlsService = Partial<
  Record<keyof ShortenedUrlsService, jest.Mock>
>;

describe('CreateShortenedUrlUseCase', () => {
  let useCase: CreateShortenedUrlUseCase;
  let shortenedUrlsService: MockedShortenedUrlsService;
  let jwtService: JwtService;

  beforeEach(async () => {
    shortenedUrlsService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateShortenedUrlUseCase,
        { provide: ShortenedUrlsService, useValue: shortenedUrlsService },
        { provide: JwtService, useValue: { decode: jest.fn() } },
      ],
    }).compile();

    useCase = module.get<CreateShortenedUrlUseCase>(CreateShortenedUrlUseCase);
    jwtService = module.get<JwtService>(JwtService);

    process.env.BASE_URL = 'http://localhost:4000';
  });

  it('deve criar uma URL encurtada com um usuário autenticado', async () => {
    const mockRequest = {
      headers: new Headers({
        authorization: 'Bearer token123',
      }),
    } as unknown as Request;

    jest.spyOn(jwtService, 'decode').mockReturnValue({ sub: 'user_123' });
    jest
      .spyOn(shortenedUrlsService, 'create')
      .mockResolvedValue({ shorten_url: 'http://localhost:3000/abc123' });

    const result = await useCase.execute(
      { url: 'https://example.com' },
      mockRequest,
    );
    expect(result!.shortUrl).toMatch(/^http:\/\/localhost:3000\/[a-zA-Z0-9]+$/);
  });

  it('deve criar uma URL encurtada sem usuário autenticado', async () => {
    const mockRequest = { headers: {} } as Request;
    jest
      .spyOn(shortenedUrlsService, 'create')
      .mockResolvedValue({ shorten_url: 'http://localhost:3000/xyz789' });

    const result = await useCase.execute(
      { url: 'https://example.com' },
      mockRequest,
    );
    expect(result!.shortUrl).toMatch(/^http:\/\/localhost:3000\/[a-zA-Z0-9]+$/);
  });

  it('deve lançar uma exceção ao ocorrer erro', async () => {
    const mockRequest = { headers: {} } as Request;
    jest
      .spyOn(shortenedUrlsService, 'create')
      .mockRejectedValue(new Error('Erro ao salvar no banco'));

    await expect(
      useCase.execute({ url: 'https://example.com' }, mockRequest),
    ).rejects.toThrow(HttpException);
  });
});
