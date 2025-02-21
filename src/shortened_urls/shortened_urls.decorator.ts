import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ShortenedUrlBodyDto } from './dto/create-shortened_url.dto';
import { UpdateShortenedUrlDto } from './dto/update-shortened_url.dto';

export function ApiCreateShortenedUrl() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    ApiOperation({ summary: 'Criar um URL encurtado' })(
      target,
      key,
      descriptor,
    );
    ApiBody({ type: ShortenedUrlBodyDto })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({
      status: 201,
      description: 'URL encurtado criado com sucesso',
    })(target, key, descriptor);
    ApiResponse({ status: 400, description: 'Erro ao criar URL encurtado' })(
      target,
      key,
      descriptor,
    );
  };
}

export function ApiFindAllShortenedUrls() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    ApiOperation({ summary: 'Buscar todas as URLs encurtadas' })(
      target,
      key,
      descriptor,
    );
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({ status: 200, description: 'Lista de URLs encurtadas' })(
      target,
      key,
      descriptor,
    );
    ApiResponse({ status: 401, description: 'Não autorizado' })(
      target,
      key,
      descriptor,
    );
  };
}

export function ApiFindOneShortenedUrl() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    ApiOperation({ summary: 'Buscar um URL encurtado pelo ID' })(
      target,
      key,
      descriptor,
    );
    ApiParam({ name: 'id', type: String, description: 'ID do URL encurtado' })(
      target,
      key,
      descriptor,
    );
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({ status: 200, description: 'URL encurtado encontrado' })(
      target,
      key,
      descriptor,
    );
    ApiResponse({ status: 404, description: 'URL encurtado não encontrado' })(
      target,
      key,
      descriptor,
    );
  };
}

export function ApiUpdateShortenedUrl() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    ApiOperation({ summary: 'Atualizar um URL encurtado' })(
      target,
      key,
      descriptor,
    );
    ApiParam({ name: 'id', type: String, description: 'ID do URL encurtado' })(
      target,
      key,
      descriptor,
    );
    ApiBody({ type: UpdateShortenedUrlDto })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({
      status: 200,
      description: 'URL encurtado atualizado com sucesso',
    })(target, key, descriptor);
    ApiResponse({ status: 400, description: 'Erro na atualização do URL' })(
      target,
      key,
      descriptor,
    );
    ApiResponse({ status: 404, description: 'URL encurtado não encontrado' })(
      target,
      key,
      descriptor,
    );
  };
}

export function ApiDeleteShortenedUrl() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    ApiOperation({ summary: 'Excluir um URL encurtado' })(
      target,
      key,
      descriptor,
    );
    ApiParam({ name: 'id', type: String, description: 'ID do URL encurtado' })(
      target,
      key,
      descriptor,
    );
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({
      status: 200,
      description: 'URL encurtado excluído com sucesso',
    })(target, key, descriptor);
    ApiResponse({ status: 404, description: 'URL encurtado não encontrado' })(
      target,
      key,
      descriptor,
    );
  };
}
