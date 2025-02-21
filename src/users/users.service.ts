import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    return await this.prisma.users.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return await this.prisma.users.findMany({
      where: {
        deleted_at: null,
      },
    });
  }

  async findOne(email: string) {
    return await this.prisma.users.findUnique({
      where: {
        email,
        deleted_at: null,
      },
    });
  }

  async findOneById(id: string) {
    return await this.prisma.users.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.users.update({
      where: {
        id,
        deleted_at: null,
      },
      data: updateUserDto,
    });
  }

  async remove(id: string, deletedDate: Date) {
    return await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        deleted_at: deletedDate,
      },
    });
  }
}
