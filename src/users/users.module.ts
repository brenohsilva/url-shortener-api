import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { FindAllUsersUseCase } from './usecases/find-all-users.usecase';
import { UpdateUserUseCase } from './usecases/update-user.usecase';
import { FindOneUserUseCase } from './usecases/find-one-user.usecase';
import { RemoveUserUseCase } from './usecases/remove-user.usecase';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    CreateUserUseCase,
    FindAllUsersUseCase,
    FindOneUserUseCase,
    UpdateUserUseCase,
    RemoveUserUseCase,
  ],
})
export class UsersModule {}
