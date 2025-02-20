import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            users: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const mockResult = {
        id: '123',
        ...createUserDto,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      jest.spyOn(prisma.users, 'create').mockResolvedValue(mockResult);

      const result = await service.create(createUserDto);

      expect(prisma.users.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockResult = [
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

      jest.spyOn(prisma.users, 'findMany').mockResolvedValue(mockResult);

      const result = await service.findAll();

      expect(prisma.users.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const mockResult = {
        id: '123',
        email,
        name: 'Test User',
        password: 'password123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      jest.spyOn(prisma.users, 'findUnique').mockResolvedValue(mockResult);

      const result = await service.findOne(email);

      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: {
          email,
        },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = '123';
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
      };

      const mockResult = {
        id,
        email: 'test@example.com',
        name: 'Updated User',
        password: 'password123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      jest.spyOn(prisma.users, 'update').mockResolvedValue(mockResult);

      const result = await service.update(id, updateUserDto);

      expect(prisma.users.update).toHaveBeenCalledWith({
        where: {
          id,
        },
        data: updateUserDto,
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('should mark a user as deleted', async () => {
      const id = '123';
      const deletedDate = new Date();
      const mockResult = {
        id,
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: deletedDate,
      };

      jest.spyOn(prisma.users, 'update').mockResolvedValue(mockResult);

      const result = await service.remove(id, deletedDate);

      expect(prisma.users.update).toHaveBeenCalledWith({
        where: {
          id,
        },
        data: {
          deleted_at: deletedDate,
        },
      });
      expect(result).toEqual(mockResult);
    });
  });
});
