import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { AlreadyExistsError } from './errors/already-exists.error';
import { NotFoundError } from './errors/not-found.error';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const user = await this.prisma.users.findFirst({
      where: { email },
    });

    if (user) {
      throw new AlreadyExistsError('user', 'email', email);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    return await this.prisma.users.findMany({
      where: {
        deleted_at: null,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!user) {
      throw new NotFoundError('user', 'id', id);
    }

    return user;
  }

  async findOneByEmail(email: string) {
    return await this.prisma.users.findUnique({
      where: {
        email,
        deleted_at: null,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { name, email, password } = updateUserDto;

    const user = await this.prisma.users.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!user) {
      throw new NotFoundError('user', 'id', id);
    }

    const data: UpdateUserDto = { name, email };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      data.password = hashedPassword;
    }

    return await this.prisma.users.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const deletedDate: Date = new Date();

    const user = await this.prisma.users.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!user) {
      throw new NotFoundError('user', 'id', id);
    }

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
