/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';

import { FindAllShortenedUrlsUseCase } from '../find-all-shortened-urls.usecase';
import { ShortenedUrlsService } from '../../shortener-urls.service';

describe('FindAllShortenedUrlsUseCase', () => {
  let useCase: FindAllShortenedUrlsUseCase;
  let shortenedUrlsService: ShortenedUrlsService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllShortenedUrlsUseCase,
        {
          provide: ShortenedUrlsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            decode: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindAllShortenedUrlsUseCase>(
      FindAllShortenedUrlsUseCase,
    );
    shortenedUrlsService =
      module.get<ShortenedUrlsService>(ShortenedUrlsService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('deve retornar todas as URLs encurtadas para um usuário autenticado', async () => {
    const mockRequest = {
      headers: { authorization: 'Bearer token' },
    } as any;

    const mockUser = { sub: '123' };
    const mockUrls = [
      {
        id: '1',
        users_id: '123',
        short_code: 'xyz123',
        original_url: 'http://example.com',
        shorten_url: 'http://short.ly/xyz123',
        clicks: 0,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ];

    jest.spyOn(jwtService, 'decode').mockReturnValue(mockUser);
    jest.spyOn(shortenedUrlsService, 'findAll').mockResolvedValue(mockUrls);

    const result = await useCase.execute(mockRequest);

    expect(result).toEqual({ success: true, data: mockUrls });
    expect(shortenedUrlsService.findAll).toHaveBeenCalledWith('123');
  });

  it('deve retornar "Nenhuma url encontrada" quando não houver URLs encurtadas', async () => {
    const mockRequest = {
      headers: { authorization: 'Bearer token' },
    } as any;

    const mockUser = { sub: '123' };

    jest.spyOn(jwtService, 'decode').mockReturnValue(mockUser);
    jest.spyOn(shortenedUrlsService, 'findAll').mockResolvedValue([]);

    const result = await useCase.execute(mockRequest);

    expect(result).toEqual({ success: true, data: 'Nenhuma url encontrada' });
  });

  it('deve lançar um erro 500 quando o cabeçalho de autorização estiver ausente', async () => {
    const mockRequest = { headers: {} } as any;

    await expect(useCase.execute(mockRequest)).rejects.toThrow(
      new HttpException(
        'Erro ao buscar as urls. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });

  it('deve lançar um erro ao buscar as URLs se ocorrer uma falha interna', async () => {
    const mockRequest = {
      headers: { authorization: 'Bearer token' },
    } as any;

    const mockUser = { sub: '123' };

    jest.spyOn(jwtService, 'decode').mockReturnValue(mockUser);
    jest
      .spyOn(shortenedUrlsService, 'findAll')
      .mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute(mockRequest)).rejects.toThrow(
      new HttpException(
        'Erro ao buscar as urls. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
