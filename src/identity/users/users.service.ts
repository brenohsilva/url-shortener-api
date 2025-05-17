import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { AlreadyExistsError } from 'src/common/errors/already-exists.error';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { JwtToken } from 'src/utils/token';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
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
    return await this.prisma.users.findMany({});
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
    const user = await this.prisma.users.findUnique({
      where: {
        email,
        deleted_at: null,
      },
    });

    if (!user) {
      throw new NotFoundError('user', 'id', email);
    }

    return user;
  }

  async findMyProfile(request: Request) {
    const accessToken = JwtToken(request);
    const user: UserDto = await this.jwtService.decode(accessToken.trim());
    const userId: string = user.sub;

    const userData = await this.prisma.users.findUnique({
      where: {
        id: Number(userId),
        deleted_at: null,
      },
      select: {
        name: true,
        email: true,
        workspaces: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!userData) {
      throw new NotFoundError('user', 'id', userId);
    }

    return userData;
  }

  async findUserTags(request: Request) {
    const accessToken = JwtToken(request);
    const user: UserDto = await this.jwtService.decode(accessToken.trim());
    const userId: string = user.sub;

    const tags = await this.prisma.tags.findMany({
      where: {
        users_id: Number(userId),
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!tags) {
      throw new NotFoundError('user', 'id', userId);
    }

    return tags;
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

    if (email) {
      const userWithEmail = await this.prisma.users.findFirst({
        where: {
          email,
          deleted_at: null,
        },
      });

      if (userWithEmail && userWithEmail.id !== id) {
        throw new AlreadyExistsError('user', 'email', email);
      }
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
    const deletedDate = new Date();

    const user = await this.prisma.users.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        workspaces: true,
        shortenerUrls: true,
        tags: true,
      },
    });

    if (!user) {
      throw new NotFoundError('user', 'id', id);
    }

    await this.prisma.shortenerUrls.updateMany({
      where: {
        users_id: id,
      },
      data: {
        deleted_at: deletedDate,
      },
    });

    const workspaceIds = user.workspaces.map((ws) => ws.id);

    await this.prisma.workspaces.updateMany({
      where: {
        owner_id: id,
      },
      data: {
        deleted_at: deletedDate,
      },
    });

    if (workspaceIds.length > 0) {
      await this.prisma.shortenerUrls.updateMany({
        where: {
          workspaces_id: { in: workspaceIds },
        },
        data: {
          deleted_at: deletedDate,
        },
      });
    }

    await this.prisma.tags.deleteMany({
      where: {
        users_id: id,
      },
    });

    await this.prisma.users.update({
      where: { id },
      data: {
        deleted_at: deletedDate,
      },
    });

    return { message: 'User and related data deleted successfully' };
  }
}
