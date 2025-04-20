import { Test, TestingModule } from '@nestjs/testing';
import { ShortenedUrlsService } from './shortener-urls.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateShortenedUrlDto } from './dto/create-shortener_url.dto';
import { UpdateShortenedUrlDto } from './dto/update-shortener_url.dto';

describe('ShortenedUrlsService', () => {
  let service: ShortenedUrlsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShortenedUrlsService,
        {
          provide: PrismaService,
          useValue: {
            shortened_urls: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ShortenedUrlsService>(ShortenedUrlsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a shortened URL', async () => {
      const createShortenedUrlDto: CreateShortenedUrlDto = {
        users_id: 'user_123',
        short_code: 'abc123',
        original_url: 'https://example.com',
        shorten_url: 'https://short.ly/abc123',
      };

      const mockResult = {
        id: '123',
        users_id: 'user_123',
        short_code: 'abc123',
        original_url: 'https://example.com',
        shorten_url: 'https://short.ly/abc123',
        clicks: 0,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      jest.spyOn(prisma.shortened_urls, 'create').mockResolvedValue(mockResult);

      const result = await service.create(createShortenedUrlDto);

      expect(prisma.shortened_urls.create).toHaveBeenCalledWith({
        data: createShortenedUrlDto,
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should return all shortened URLs for a user', async () => {
      const users_id = 'user_123';
      const mockResult = [
        {
          id: '123',
          users_id,
          short_code: 'abc123',
          original_url: 'https://example.com',
          shorten_url: 'https://short.ly/abc123',
          clicks: 0,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ];

      jest
        .spyOn(prisma.shortened_urls, 'findMany')
        .mockResolvedValue(mockResult);

      const result = await service.findAll(users_id);

      expect(prisma.shortened_urls.findMany).toHaveBeenCalledWith({
        where: {
          users_id,
          deleted_at: null,
        },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should return a shortened URL by id and user id', async () => {
      const id = '123';
      const users_id = 'user_123';
      const mockResult = {
        id,
        users_id,
        short_code: 'abc123',
        original_url: 'https://example.com',
        shorten_url: 'https://short.ly/abc123',
        clicks: 0,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      jest
        .spyOn(prisma.shortened_urls, 'findUnique')
        .mockResolvedValue(mockResult);

      const result = await service.findOne(id, users_id);

      expect(prisma.shortened_urls.findUnique).toHaveBeenCalledWith({
        where: {
          id,
          users_id,
          deleted_at: null,
        },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('findByShortCode', () => {
    it('should return a shortened URL by short code', async () => {
      const shortCode = 'abc123';
      const mockResult = {
        id: '123',
        users_id: 'user_123',
        short_code: shortCode,
        original_url: 'https://example.com',
        shorten_url: 'https://short.ly/abc123',
        clicks: 0,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      jest
        .spyOn(prisma.shortened_urls, 'findUnique')
        .mockResolvedValue(mockResult);

      const result = await service.findByShortCode(shortCode);

      expect(prisma.shortened_urls.findUnique).toHaveBeenCalledWith({
        where: {
          short_code: shortCode,
          deleted_at: null, 
        },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('should update a shortened URL', async () => {
      const id = '123';
      const updateShortenedUrlDto: UpdateShortenedUrlDto = {
        original_url: 'https://newexample.com',
      };

      const mockResult = {
        id,
        users_id: 'user_123',
        short_code: 'abc123',
        original_url: updateShortenedUrlDto.original_url,
        shorten_url: 'https://short.ly/abc123',
        clicks: 0,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      jest.spyOn(prisma.shortened_urls, 'update').mockResolvedValue(mockResult);

      const result = await service.update(id, updateShortenedUrlDto);

      expect(prisma.shortened_urls.update).toHaveBeenCalledWith({
        where: {
          id,
        },
        data: {
          original_url: updateShortenedUrlDto.original_url,
        },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateClicks', () => {
    it('should increment the click count of a shortened URL', async () => {
      const id = '123';
      const mockResult = {
        id,
        users_id: 'user_123',
        short_code: 'abc123',
        original_url: 'https://example.com',
        shorten_url: 'https://short.ly/abc123',
        clicks: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      jest.spyOn(prisma.shortened_urls, 'update').mockResolvedValue(mockResult);

      const result = await service.updateClicks(id);

      expect(prisma.shortened_urls.update).toHaveBeenCalledWith({
        where: {
          id,
        },
        data: {
          clicks: {
            increment: 1,
          },
        },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('should mark a shortened URL as deleted', async () => {
      const id = '123';
      const deletedDate = new Date();
      const mockResult = {
        id,
        users_id: 'user_123',
        short_code: 'abc123',
        original_url: 'https://example.com',
        shorten_url: 'https://short.ly/abc123',
        clicks: 0,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: deletedDate,
      };

      jest.spyOn(prisma.shortened_urls, 'update').mockResolvedValue(mockResult);

      const result = await service.remove(id, deletedDate);

      expect(prisma.shortened_urls.update).toHaveBeenCalledWith({
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
