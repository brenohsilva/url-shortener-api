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
    ApiResponse({
      status: 500,
      description: 'Erro ao gerar a URL. Tente novamente mais tarde.',
    })(target, key, descriptor);
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
    ApiResponse({
      status: 401,
      description: 'Erro ao trazer as urls. Tente novamente mais tarde.',
    })(target, key, descriptor);
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
    ApiResponse({
      status: 200,
      description: 'Erro ao buscar a URL. URL não encontrada.',
    })(target, key, descriptor);
    ApiResponse({
      status: 404,
      description: 'Erro ao buscar a URL. URL não encontrada.',
    })(target, key, descriptor);
    ApiResponse({
      status: 500,
      description: 'Erro ao buscar a URL. Tente novamente mais tarde.',
    })(target, key, descriptor);
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
    ApiResponse({
      status: 404,
      description: 'Erro ao encontrar a URL. URL não encontrada.',
    })(target, key, descriptor);
    ApiResponse({
      status: 500,
      description: 'Erro ao atualizar a url. Tente novamente mais tarde.',
    })(target, key, descriptor);
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
      description: 'Url deletada com sucesso',
    })(target, key, descriptor);
    ApiResponse({
      status: 404,
      description: 'Erro ao encontrar a url. Url não encontrada.',
    })(target, key, descriptor);
    ApiResponse({
      status: 500,
      description: 'Erro ao remover a url. Tente novamente mais tarde.',
    })(target, key, descriptor);
  };
}

export function ApiRedirectShortenedUrl() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    ApiOperation({
      summary: 'Redireciona para a URL original',
      description:
        'Este endpoint redireciona o usuário para a URL original associada ao código curto fornecido.',
    })(target, key, descriptor);

    ApiParam({
      name: 'shortCode',
      description: 'Código curto da URL',
      example: 'abc123',
    })(target, key, descriptor);

    ApiResponse({
      status: 302,
      description: 'Redirecionamento bem-sucedido para a URL original.',
    })(target, key, descriptor);

    ApiResponse({
      status: 404,
      description: 'Código curto não encontrado ou URL original indisponível.',
    })(target, key, descriptor);
  };
}
