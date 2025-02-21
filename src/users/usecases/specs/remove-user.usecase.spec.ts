import { Test, TestingModule } from '@nestjs/testing';
import { RemoveUserUseCase } from '../remove-user.usecase';
import { UsersService } from '../../users.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('RemoveUserUseCase', () => {
  let useCase: RemoveUserUseCase;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveUserUseCase,
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<RemoveUserUseCase>(RemoveUserUseCase);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should remove a user and return success response', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      jest.spyOn(usersService, 'findOneById').mockResolvedValue(mockUser);
      jest.spyOn(usersService, 'remove').mockResolvedValue({
        ...mockUser,
        deleted_at: new Date(),
      });

      const result = await useCase.execute('123');

      expect(usersService.findOneById).toHaveBeenCalledWith('123');
      expect(usersService.remove).toHaveBeenCalledWith('123', expect.any(Date));
      expect(result).toEqual({
        success: true,
        data: 'Usuário removido com sucesso',
      });
    });

    it('should throw HttpException when user is not found', async () => {
      jest.spyOn(usersService, 'findOneById').mockResolvedValue(null);

      await expect(useCase.execute('123')).rejects.toThrow(
        new HttpException(
          'Erro ao remover o usuário. Tente novamente mais tarde.',
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should throw HttpException when an error occurs', async () => {
      jest
        .spyOn(usersService, 'findOneById')
        .mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute('123')).rejects.toThrow(
        new HttpException(
          'Erro ao remover o usuário. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
