/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    return await this.prisma.users.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return await this.prisma.users.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.users.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.users.update({
      where: {
        id,
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
