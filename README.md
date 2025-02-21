# Shortened URL API

Esta é uma API de encurtamento de URLs desenvolvida com NestJS, Prisma ORM e MySQL. A API permite que os usuários criem, gerenciem e acessem URLs encurtadas. A documentação da API é fornecida via Swagger.

## Tecnologias Utilizadas

- **Node.js**: Versão 22
- **NestJS**: Framework para construção de aplicações server-side em Node.js
- **Prisma ORM**: ORM para gerenciamento de banco de dados
- **MySQL**: Banco de dados relacional
- **Docker**: Para containerização e gerenciamento de dependências
- **Swagger**: Para documentação da API

## Estrutura do Projeto

### Modelos do Banco de Dados

O banco de dados possui duas tabelas principais:

- **Users**: Armazena informações dos usuários.
- **Shortened_urls**: Armazena as URLs encurtadas e suas informações.

```prisma
model Users {
  id         String           @id @default(uuid())
  name       String
  email      String           @unique
  password   String
  created_at DateTime         @default(now())
  updated_at DateTime         @updatedAt
  deleted_at DateTime?
  urls       Shortened_urls[]
}

model Shortened_urls {
  id           String    @id @default(uuid())
  users_id     String?
  short_code   String    @unique
  original_url String
  shorten_url  String
  clicks       Int       @default(0)
  created_at   DateTime  @default(now())
  updated_at   DateTime  @updatedAt
  deleted_at   DateTime?

  user Users? @relation(fields: [users_id], references: [id])
}
```
### Rotas da API

A API possui as seguintes rotas para gerenciamento de URLs encurtadas:

-   **POST /shortened-urls**: Cria uma nova URL encurtada.

-   **GET /shortened-urls/all**: Lista todas as URLs encurtadas (requer autenticação).

-   **GET /shortened-urls/:id **: Obtém detalhes de uma URL encurtada específica (requer autenticação).

-   **PATCH /shortened-urls/:id **: Atualiza uma URL encurtada (requer autenticação).

-   **DELETE /shortened-urls/:id **: Remove uma URL encurtada (requer autenticação).

-   **GET /:shortCode **: Redireciona para a URL original associada ao código curto.

### Autenticação

Algumas rotas requerem autenticação via `AuthGuard`. Certifique-se de fornecer um token válido no cabeçalho da requisição.

### Documentação da API

A documentação da API está disponível via Swagger. Para acessar, inicie o servidor e navegue até:

http://localhost:3000/docs

Configuração do Projeto
-----------------------

### Pré-requisitos

-   Node.js (v22)

-   Docker e Docker Compose

-   MySQL

### Instalação

1.  Clone o repositório:

    git clone https://github.com/brenohsilva/url-shortener-api.git
    cd shortened-url-api

2.  Instale as dependências:

    npm install

3.  Configure o ambiente:

    Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente:
```
    DATABASE_URL="mysql://root:teddy@mysql:3307/shorteneddb"
    JWT_SECRET="your_jwt_secret"
    BASE_URL="http://localhost:3000"
```
5.  Inicie o banco de dados com Docker Compose:

    docker-compose up -d

6.  Execute as migrações do Prisma:

    npx prisma migrate dev

7.  Inicie o servidor:

    npm run start:dev

### Uso

Após iniciar o servidor, a API estará disponível em `http://localhost:3000`. Use o Swagger para testar as rotas ou faça requisições diretamente via `curl`, Postman, ou qualquer outra ferramenta de sua preferência.

### Testes

Para executar os testes, utilize o comando:

npm run test

## Deploy

A Api está rodando online no endereço: https://url-shortener-api-gap8.onrender.com

Voce pode consultar a documentação via swagger da aplicação online pelo endereço:

https://url-shortener-api-gap8.onrender.com/docs

Contribuição
------------

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

Licença
-------

Este projeto está licenciado sob a [MIT License](https://chat.deepseek.com/a/chat/s/LICENSE).


### Explicação do README

1. **Título e Descrição**: Introdução ao projeto e suas funcionalidades.
2. **Tecnologias Utilizadas**: Lista das principais tecnologias usadas.
3. **Estrutura do Projeto**: Descrição dos modelos do banco de dados e rotas da API.
4. **Configuração do Projeto**: Passos para instalação e configuração do ambiente.
5. **Uso**: Como usar a API após a configuração.
6. **Testes**: Como executar os testes.
7. **Deploy**: Endereço da aplicação online.
8. **Contribuição**: Informações sobre como contribuir para o projeto.
9. **Licença**: Informações sobre a licença do projeto.
