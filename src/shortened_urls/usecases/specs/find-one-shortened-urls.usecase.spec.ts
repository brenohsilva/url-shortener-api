import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { FindOneShortenedUrlsUseCase } from '../find-one-shortened-url-usecase';
import { ShortenedUrlsService } from '../../shortened_urls.service';

describe('FindOneShortenedUrlsUseCase', () => {
  let useCase: FindOneShortenedUrlsUseCase;
  let shortenedUrlsService: ShortenedUrlsService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOneShortenedUrlsUseCase,
        {
          provide: ShortenedUrlsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            decode: jest.fn(),
          },
        },
        Logger,
      ],
    }).compile();

    useCase = module.get<FindOneShortenedUrlsUseCase>(
      FindOneShortenedUrlsUseCase,
    );
    shortenedUrlsService =
      module.get<ShortenedUrlsService>(ShortenedUrlsService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('deve lançar erro 500 se o token de autorização estiver ausente', async () => {
    await expect(useCase.execute('1', { headers: {} } as any)).rejects.toThrow(
      new HttpException(
        'Erro ao buscar a url. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });

  it('deve retornar "url não encontrada" se a URL não existir', async () => {
    const requestMock = {
      headers: { authorization: 'Bearer fake-token' },
    } as any;

    jest.spyOn(jwtService, 'decode').mockReturnValue({ sub: '123' } as UserDto);
    jest.spyOn(shortenedUrlsService, 'findOne').mockResolvedValue(null);

    const result = await useCase.execute('1', requestMock);
    expect(result).toEqual({ success: true, data: 'url não encontrada' });
  });

  it('deve retornar a URL se ela for encontrada', async () => {
    const requestMock = {
      headers: { authorization: 'Bearer fake-token' },
    } as any;

    const fakeUrl = {
      id: '123',
      users_id: 'user_456',
      short_code: 'abc123',
      original_url: 'https://example.com',
      shorten_url: 'https://short.ly/abc123',
      clicks: 0,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null, //
    };

    jest.spyOn(shortenedUrlsService, 'findOne').mockResolvedValue(fakeUrl);

    jest.spyOn(jwtService, 'decode').mockReturnValue({ sub: '123' } as UserDto);
    jest.spyOn(shortenedUrlsService, 'findOne').mockResolvedValue(fakeUrl);

    const result = await useCase.execute('1', requestMock);
    expect(result).toEqual({ success: true, data: fakeUrl });
  });

  it('deve lançar erro 500 se ocorrer um erro interno', async () => {
    const requestMock = {
      headers: { authorization: 'Bearer fake-token' },
    } as any;

    jest.spyOn(jwtService, 'decode').mockImplementation(() => {
      throw new Error('Erro interno');
    });

    await expect(useCase.execute('1', requestMock)).rejects.toThrow(
      new HttpException(
        'Erro ao buscar a url. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
