import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserUseCase } from '../update-user.usecase';
import { UsersService } from '../../users.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from '../../dto/update-user.dto';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update a user and return success response', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
      };

      const updatedUser = {
        ...mockUser,
        name: 'Updated User',
      };

      jest.spyOn(usersService, 'findOneById').mockResolvedValue(mockUser);
      jest.spyOn(usersService, 'update').mockResolvedValue(updatedUser);

      const result = await useCase.execute('123', updateUserDto);

      expect(usersService.findOneById).toHaveBeenCalledWith('123');
      expect(usersService.update).toHaveBeenCalledWith('123', updateUserDto);
      expect(result).toEqual({
        success: true,
        data: updatedUser,
      });
    });

    it('should throw HttpException when user is not found', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
      };

      jest.spyOn(usersService, 'findOneById').mockResolvedValue(null);

      await expect(useCase.execute('123', updateUserDto)).rejects.toThrow(
        new HttpException(
          'Erro ao atualizar o usuário. Tente novamente mais tarde.',
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should throw HttpException when an error occurs', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
      };

      jest
        .spyOn(usersService, 'findOneById')
        .mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute('123', updateUserDto)).rejects.toThrow(
        new HttpException(
          'Erro ao atualizar o usuário. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
