import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { ShortenedUrlsService } from '../../shortened_urls.service';
import { DeleteShortenedUrlUseCase } from '../delete-shortened-url.usecase';

describe('DeleteShortenedUrlUseCase', () => {
  let deleteShortenedUrlUseCase: DeleteShortenedUrlUseCase;
  let shortenedUrlsService: ShortenedUrlsService;
  let jwtService: JwtService;

  beforeEach(() => {
    shortenedUrlsService = {
      findOne: jest.fn(),
      remove: jest.fn(),
    } as unknown as ShortenedUrlsService;

    jwtService = {
      decode: jest.fn(),
    } as unknown as JwtService;

    deleteShortenedUrlUseCase = new DeleteShortenedUrlUseCase(
      shortenedUrlsService,
      jwtService,
    );
  });

  it('deve deletar uma URL encurtada com sucesso', async () => {
    const id = '123';
    const userId = 'user_123';
    const mockUrl = {
      id: '123',
      users_id: 'user_456',
      short_code: 'abc123',
      original_url: 'https://example.com',
      shorten_url: 'https://short.ly/abc123',
      clicks: 0,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };
    const mockRequest = {
      headers: {
        authorization: 'Bearer token123',
      },
    } as unknown as Request;

    jest
      .spyOn(jwtService, 'decode')
      .mockReturnValue({ sub: userId } as UserDto);
    jest.spyOn(shortenedUrlsService, 'findOne').mockResolvedValue(mockUrl);
    jest.spyOn(shortenedUrlsService, 'remove').mockResolvedValue(mockUrl);

    const result = await deleteShortenedUrlUseCase.execute(id, mockRequest);

    expect(result).toEqual({
      success: true,
      data: 'Url deletada com sucesso',
    });
    expect(shortenedUrlsService.findOne).toHaveBeenCalledWith(id, userId);
    expect(shortenedUrlsService.remove).toHaveBeenCalledWith(
      '123',
      expect.any(Date),
    );
  });

  it('deve lançar um erro se o authorizationHeader estiver ausente', async () => {
    const id = '123';
    const mockRequest = {
      headers: {},
    } as unknown as Request;

    await expect(
      deleteShortenedUrlUseCase.execute(id, mockRequest),
    ).rejects.toThrow(
      new HttpException(
        'Erro ao remover a url. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });

  it('deve lançar um erro se a URL não for encontrada', async () => {
    const id = '123';
    const userId = 'user_123';
    const mockRequest = {
      headers: {
        authorization: 'Bearer token123',
      },
    } as unknown as Request;

    jest
      .spyOn(jwtService, 'decode')
      .mockReturnValue({ sub: userId } as UserDto);
    jest.spyOn(shortenedUrlsService, 'findOne').mockResolvedValue(null);

    await expect(
      deleteShortenedUrlUseCase.execute(id, mockRequest),
    ).rejects.toThrow(
      new HttpException(
        'Erro ao remover a url. Tente novamente mais tarde.',
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('deve lançar um erro genérico ao falhar a remoção', async () => {
    const id = '123';
    const userId = 'user_123';
    const mockUrl = {
      id: '123',
      users_id: 'user_456',
      short_code: 'abc123',
      original_url: 'https://example.com',
      shorten_url: 'https://short.ly/abc123',
      clicks: 0,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };
    const mockRequest = {
      headers: {
        authorization: 'Bearer token123',
      },
    } as unknown as Request;

    jest
      .spyOn(jwtService, 'decode')
      .mockReturnValue({ sub: userId } as UserDto);
    jest.spyOn(shortenedUrlsService, 'findOne').mockResolvedValue(mockUrl);
    jest
      .spyOn(shortenedUrlsService, 'remove')
      .mockRejectedValue(new Error('Erro inesperado'));

    await expect(
      deleteShortenedUrlUseCase.execute(id, mockRequest),
    ).rejects.toThrow(
      new HttpException(
        'Erro ao remover a url. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
