import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export function ApiCreateUser() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    ApiOperation({ summary: 'Criar um novo usuário' })(target, key, descriptor);
    ApiBody({ type: CreateUserDto })(target, key, descriptor);
    ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })(
      target,
      key,
      descriptor,
    );
    ApiResponse({ status: 400, description: 'Erro na criação do usuário' })(
      target,
      key,
      descriptor,
    );
  };
}

export function ApiFindOneUser() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    ApiOperation({ summary: 'Buscar um usuário pelo ID' })(
      target,
      key,
      descriptor,
    );
    ApiParam({ name: 'id', type: String, description: 'ID do usuário' })(
      target,
      key,
      descriptor,
    );
    ApiResponse({ status: 200, description: 'Usuário encontrado' })(
      target,
      key,
      descriptor,
    );
    ApiResponse({ status: 404, description: 'Usuário não encontrado' })(
      target,
      key,
      descriptor,
    );
  };
}

export function ApiFindAllUsers() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    ApiOperation({ summary: 'Listar todos os usuários' })(
      target,
      key,
      descriptor,
    );
    ApiResponse({
      status: 200,
      description: 'Lista de usuários retornada com sucesso',
    })(target, key, descriptor);
  };
}

export function ApiUpdateUser() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    ApiOperation({ summary: 'Atualizar um usuário' })(target, key, descriptor);
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID do usuário a ser atualizado',
    })(target, key, descriptor);
    ApiBody({ type: UpdateUserDto })(target, key, descriptor);
    ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })(
      target,
      key,
      descriptor,
    );
    ApiResponse({ status: 400, description: 'Erro na atualização do usuário' })(
      target,
      key,
      descriptor,
    );
    ApiResponse({ status: 404, description: 'Usuário não encontrado' })(
      target,
      key,
      descriptor,
    );
  };
}

export function ApiDeleteUser() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    ApiOperation({ summary: 'Deletar um usuário' })(target, key, descriptor);
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID do usuário a ser deletado',
    })(target, key, descriptor);
    ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })(
      target,
      key,
      descriptor,
    );
    ApiResponse({ status: 404, description: 'Usuário não encontrado' })(
      target,
      key,
      descriptor,
    );
  };
}
