import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserDto } from 'src/identity/users/dto/user-response.dto';
import { UpdateShortenedUrlUseCase } from '../update-shortened-url.usecase';
import { ShortenedUrlsService } from '../../shortener-urls.service';
import { UpdateShortenedUrlDto } from 'src/shortened_urls/dto/update-shortened_url.dto';

describe('UpdateShortenedUrlUseCase', () => {
  let updateShortenedUrlUseCase: UpdateShortenedUrlUseCase;
  let shortenedUrlsService: ShortenedUrlsService;
  let jwtService: JwtService;

  beforeEach(() => {
    shortenedUrlsService = {
      findOne: jest.fn(),
      update: jest.fn(),
    } as unknown as ShortenedUrlsService;

    jwtService = {
      decode: jest.fn(),
    } as unknown as JwtService;

    updateShortenedUrlUseCase = new UpdateShortenedUrlUseCase(
      shortenedUrlsService,
      jwtService,
    );
  });

  it('deve atualizar uma URL encurtada com sucesso', async () => {
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
    const updateData: UpdateShortenedUrlDto = {
      original_url: 'https://new-url.com',
    };

    jest
      .spyOn(jwtService, 'decode')
      .mockReturnValue({ sub: userId } as UserDto);
    jest.spyOn(shortenedUrlsService, 'findOne').mockResolvedValue(mockUrl);
    jest.spyOn(shortenedUrlsService, 'update').mockResolvedValue(mockUrl);

    const result = await updateShortenedUrlUseCase.execute(
      id,
      mockRequest,
      updateData,
    );

    expect(result).toEqual({
      success: true,
      data: 'Url atualizada com sucesso',
    });
    expect(shortenedUrlsService.findOne).toHaveBeenCalledWith(id, userId);
    expect(shortenedUrlsService.update).toHaveBeenCalledWith(id, updateData);
  });

  it('deve lançar um erro se o authorizationHeader estiver ausente', async () => {
    const id = '123';
    const updateData: UpdateShortenedUrlDto = {
      original_url: 'https://new-url.com',
    };
    const mockRequest = {
      headers: {},
    } as unknown as Request;

    await expect(
      updateShortenedUrlUseCase.execute(id, mockRequest, updateData),
    ).rejects.toThrow(
      new HttpException(
        'Erro ao atualizar a url. Tente novamente mais tarde.',
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
    const updateData: UpdateShortenedUrlDto = {
      original_url: 'https://new-url.com',
    };

    jest
      .spyOn(jwtService, 'decode')
      .mockReturnValue({ sub: userId } as UserDto);
    jest.spyOn(shortenedUrlsService, 'findOne').mockResolvedValue(null);

    await expect(
      updateShortenedUrlUseCase.execute(id, mockRequest, updateData),
    ).rejects.toThrow(
      new HttpException(
        'Erro ao atualizar a url. Tente novamente mais tarde.',
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('deve lançar um erro genérico ao falhar a atualização', async () => {
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
    const updateData: UpdateShortenedUrlDto = {
      original_url: 'https://new-url.com',
    };

    jest
      .spyOn(jwtService, 'decode')
      .mockReturnValue({ sub: userId } as UserDto);
    jest.spyOn(shortenedUrlsService, 'findOne').mockResolvedValue(mockUrl);
    jest
      .spyOn(shortenedUrlsService, 'update')
      .mockRejectedValue(new Error('Erro inesperado'));

    await expect(
      updateShortenedUrlUseCase.execute(id, mockRequest, updateData),
    ).rejects.toThrow(
      new HttpException(
        'Erro ao atualizar a url. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
