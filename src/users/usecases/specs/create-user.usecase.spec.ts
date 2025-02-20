import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '../create-user.usecase';
import { UsersService } from '../../users.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../dto/create-user.dto';

// Mock do bcrypt para corrigir o tipo
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a user with hashed password and return success response', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword123';
      const mockUser = {
        id: '123',
        ...createUserDto,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);

      const result = await useCase.execute(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);

      expect(usersService.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });

      // Verifica o resultado
      expect(result).toEqual({
        success: true,
        data: mockUser,
      });
    });

    it('should throw HttpException when an error occurs', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hashing error'));

      await expect(useCase.execute(createUserDto)).rejects.toThrow(
        new HttpException(
          'Erro ao criar o usuário. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
