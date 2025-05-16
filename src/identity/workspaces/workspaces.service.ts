import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { JwtToken } from 'src/utils/token';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/dto/user-response.dto';
import { AlreadyExistsError } from 'src/common/errors/already-exists.error';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { CreateWorkspaceBodyDto } from './dto/create-workspace-body.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async create(
    request: Request,
    createWorkspaceBodyDto: CreateWorkspaceBodyDto,
  ) {
    const accessToken = JwtToken(request);
    const user: UserDto = await this.jwtService.decode(accessToken.trim());
    const userId: string = user.sub;

    const { workspace, slug } = createWorkspaceBodyDto;

    const workspaceResponse = await this.prismaService.workspaces.findFirst({
      where: {
        owner_id: Number(userId),
        name: workspace,
        OR: [
          {
            owner_id: Number(userId),
            slug,
          },
        ],
      },
    });

    if (workspaceResponse) {
      throw new AlreadyExistsError('workspace', 'name', workspace || slug);
    }

    const createWorkspace: CreateWorkspaceDto = {
      owner_id: Number(userId),
      slug,
      name: workspace,
    };

    return await this.prismaService.workspaces.create({
      data: createWorkspace,
    });
  }

  async findAll(request: Request) {
    const accessToken = JwtToken(request);
    const user: UserDto = await this.jwtService.decode(accessToken.trim());
    const userId: string = user.sub;
    return await this.prismaService.workspaces.findMany({
      where: {
        owner_id: Number(userId),
      },
    });
  }

  async findOne(request: Request, id: string) {
    const accessToken = JwtToken(request);
    const user: UserDto = await this.jwtService.decode(accessToken.trim());
    const userId: string = user.sub;

    const workspace = await this.prismaService.workspaces.findFirst({
      where: {
        id,
        owner_id: Number(userId),
      },
    });

    if (!workspace) {
      throw new NotFoundError('workspace', 'id', id);
    }
  }

  async update(
    request: Request,
    id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    const accessToken = JwtToken(request);
    const user: UserDto = await this.jwtService.decode(accessToken.trim());
    const userId: string = user.sub;

    const workspace = await this.prismaService.workspaces.findFirst({
      where: {
        id,
        owner_id: Number(userId),
      },
    });

    if (!workspace) {
      throw new NotFoundError('workspace', 'user id', userId);
    }

    const { name, slug } = updateWorkspaceDto;

    const data: UpdateWorkspaceDto = {};
    if (name) data.name = name;
    if (slug) data.slug = slug;

    return await this.prismaService.workspaces.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(request: Request, id: string) {
    const accessToken = JwtToken(request);
    const user: UserDto = await this.jwtService.decode(accessToken.trim());
    const userId: string = user.sub;

    const workspace = await this.prismaService.workspaces.findFirst({
      where: {
        id,
        owner_id: Number(userId),
      },
    });

    if (!workspace) {
      throw new NotFoundError('workspace', 'id', id);
    }

    return this.prismaService.workspaces.delete({
      where: {
        id,
      },
    });
  }
}
