import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { UpdateUserUseCase } from './usecases/update-user.usecase';
import { FindAllUsersUseCase } from './usecases/find-all-users.usecase';
import { RemoveUserUseCase } from './usecases/remove-user.usecase';
import { FindOneUserUseCase } from './usecases/find-one-user.usecase';

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
  create(@Body() createUserDto: CreateUserDto) {
    return this.createUSerUseCase.execute(createUserDto);
  }

  @Get()
  findAll() {
    return this.findAllUsersUSeCase.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneUserUserUseCase.execute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeUserUseCase.execute(id);
  }
}
