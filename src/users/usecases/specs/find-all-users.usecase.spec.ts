import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FindAllUsersUseCase } from '../find-all-users.usecase';
import { UsersService } from '../../users.service';

describe('FindAllUsersUseCase', () => {
  let useCase: FindAllUsersUseCase;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllUsersUseCase,
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindAllUsersUseCase>(FindAllUsersUseCase);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return users with success response', async () => {
      const mockUsers = [
        {
          id: '123',
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123',
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ];

      jest.spyOn(usersService, 'findAll').mockResolvedValue(mockUsers);

      const result = await useCase.execute();

      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        data: mockUsers,
      });
    });

    it('should throw HttpException when usersService.findAll fails', async () => {
      jest
        .spyOn(usersService, 'findAll')
        .mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute()).rejects.toThrow(
        new HttpException(
          'Erro ao trazer os usuários. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
