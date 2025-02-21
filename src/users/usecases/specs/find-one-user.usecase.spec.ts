import { Test, TestingModule } from '@nestjs/testing';
import { FindOneUserUseCase } from '../find-one-user.usecase';
import { UsersService } from '../../users.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('FindOneUserUseCase', () => {
  let useCase: FindOneUserUseCase;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOneUserUseCase,
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindOneUserUseCase>(FindOneUserUseCase);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a user with success response', async () => {
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

      const result = await useCase.execute('123');

      expect(usersService.findOneById).toHaveBeenCalledWith('123');
      expect(result).toEqual({
        success: true,
        data: mockUser,
      });
    });

    it('should throw HttpException when user is not found', async () => {
      jest.spyOn(usersService, 'findOneById').mockResolvedValue(null);

      await expect(useCase.execute('123')).rejects.toThrow(
        new HttpException(
          'Erro ao trazer o usuário. Tente novamente mais tarde.',
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should throw HttpException when usersService.findOneById fails', async () => {
      jest
        .spyOn(usersService, 'findOneById')
        .mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute('123')).rejects.toThrow(
        new HttpException(
          'Erro ao trazer o usuário. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
