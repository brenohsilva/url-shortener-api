import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { UpdateUserUseCase } from './usecases/update-user.usecase';
import { FindAllUsersUseCase } from './usecases/find-all-users.usecase';
import { RemoveUserUseCase } from './usecases/remove-user.usecase';
import { FindOneUserUseCase } from './usecases/find-one-user.usecase';
import {
  ApiCreateUser,
  ApiDeleteUser,
  ApiFindAllUsers,
  ApiFindOneUser,
  ApiUpdateUser,
} from './users.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUSerUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findAllUsersUSeCase: FindAllUsersUseCase,
    private readonly findOneUserUserUseCase: FindOneUserUseCase,
    private readonly removeUserUseCase: RemoveUserUseCase,
  ) {}

  @Post()
  @ApiCreateUser()
  create(@Body() createUserDto: CreateUserDto) {
    return this.createUSerUseCase.execute(createUserDto);
  }

  @Get('/all')
  @ApiFindAllUsers()
  @UseGuards(AuthGuard)
  findAll() {
    return this.findAllUsersUSeCase.execute();
  }

  @Get(':id')
  @ApiFindOneUser()
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.findOneUserUserUseCase.execute(id);
  }

  @Patch(':id')
  @ApiUpdateUser()
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute(id, updateUserDto);
  }

  @Delete(':id')
  @ApiDeleteUser()
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.removeUserUseCase.execute(id);
  }
}
