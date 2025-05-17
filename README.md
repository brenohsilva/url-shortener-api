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

O banco de dados possui várias tabelas que representam os principais recursos da aplicação:

- **Users**: Armazena informações dos usuários.
- **ShortenedUrls**: Armazena as URLs encurtadas e suas informações.
- **Workspaces**: Representa os espaços de trabalho criados pelos usuários.
- **Clicks**: Armazena os cliques realizados nas URLs encurtadas.
- **Tags**: Armazena tags personalizadas que podem ser associadas às URLs.

```prisma
model Users {
  id         Int       @id @default(autoincrement())
  name       String
  email      String    @unique
  password   String
  created_at DateTime  @default(now())
  updated_at DateTime  @default(now())
  deleted_at DateTime?

  shortenerUrls ShortenerUrls[] @relation("UserShortenerUrls")
  workspaces    Workspaces[]    @relation("UserWorkspaces")
  tags          Tags[]          @relation("UserTags")
}

model Workspaces {
  id         String    @id @default(uuid())
  name       String
  slug       String    @unique
  owner_id   Int
  created_at DateTime  @default(now())
  update_at  DateTime  @default(now())
  deleted_at DateTime?

  shortenerUrls ShortenerUrls[] @relation("WorkspaceShortenerUrls")
  ownerUser     Users           @relation("UserWorkspaces", fields: [owner_id], references: [id])
}

model ShortenerUrls {
  id            Int       @id @default(autoincrement())
  users_id      Int?
  workspaces_id String?
  short_code    String    @unique
  origin_url    String
  shorten_url   String
  comments      String?
  created_at    DateTime  @default(now())
  update_at     DateTime  @default(now())
  deleted_at    DateTime?
  expires_at    DateTime?

  user      Users?      @relation("UserShortenerUrls", fields: [users_id], references: [id], onDelete: Cascade)
  workspace Workspaces? @relation("WorkspaceShortenerUrls", fields: [workspaces_id], references: [id], onDelete: Cascade)
  tags      Tags[]      @relation("ShortenerUrlsTags")
  clicks    Clicks[]    @relation("ShortenerUrlsClicks")
}

model Clicks {
  id               Int      @id @default(autoincrement())
  shortenerUrls_id Int
  created_at       DateTime @default(now())

  shortenerUrls ShortenerUrls @relation("ShortenerUrlsClicks", fields: [shortenerUrls_id], references: [id], onDelete: Cascade)
}

model Tags {
  id       Int    @id @default(autoincrement())
  users_id Int
  name     String @unique

  Users         Users?          @relation("UserTags", fields: [users_id], references: [id])
  shortenerUrls ShortenerUrls[] @relation("ShortenerUrlsTags")
}

```

### Rotas da API

A API possui as seguintes rotas para gerenciamento das Urls:

- **POST /shortened-urls**: Cria uma nova URL encurtada (Pode ser chamada com e sem autenticação)

- **GET /shortened-urls/all**: Lista todas as URLs encurtadas (requer autenticação).

- **GET /shortened-urls/:id**: Obtém detalhes de uma URL encurtada específica (requer autenticação).

- **PATCH /shortened-urls/:id**: Atualiza uma URL encurtada (requer autenticação).

- **DELETE /shortened-urls/:id**: Remove uma URL encurtada (requer autenticação).

- **GET /:shortCode**: Redireciona para a URL original associada ao código curto.

Há outras rotas referentes a usuários e workspaces onde você pode encontrar na documentação do swagger e do postman.

---

### Autenticação

Algumas rotas requerem autenticação via `AuthGuard`. Certifique-se de fornecer um token válido no cabeçalho da requisição.

O Token valido pode ser obtido através do login e senha de um usuário existente. 

- **POST /auth/login**: Faz login na aplicação, retornando um access token.

Você pode criar um usuário através da rota **POST /users** via swagger ou postman.

No ambiente online já está disponivel as seguintes credenciais do usuário:

E-mail: joe.doe@hotmail.com

Password: 123456

---

## Deploy

A Api está rodando online no endereço: https://url-shortener-api-gap8.onrender.com

---

### Documentação da API

A documentação da API está disponível via Swagger. Para acessar, inicie o servidor localmente e navegue até:

http://localhost:3000/docs

Voce pode consultar a documentação via swagger do servidor online pelo endereço:

https://url-shortener-api-gap8.onrender.com/docs

---

## Configuração do Projeto

### Pré-requisitos

- Node.js (v22)

- Docker e Docker Compose

- MySQL

### Instalação

1.  Clone o repositório:

```
    git clone https://github.com/brenohsilva/url-shortener-api.git

    cd shortened-url-api
```

2.  Instale as dependências:

    npm install

3.  Configure o ambiente:

    Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente:

```
    DATABASE_URL='mysql://root:teddy@localhost:3306/shorteneddb'
    JWT_SECRET='SECRETKEY'
    BASE_URL='http://localhost:3000'
```

5.  Inicie o banco de dados com Docker Compose:

```
    docker-compose up -d
```

Ou

```
docker-compose up --build
```

6.  Inicie o servidor:

```
    npm run start:dev
```

### Uso

Após iniciar o servidor, a API estará disponível em `http://localhost:3000`. Use o Swagger para testar as rotas ou faça requisições diretamente via `curl`, Postman, ou qualquer outra ferramenta de sua preferência.

### Testes

Para executar os testes, utilize o comando:

npm run test


### Explicação do README

1. **Título e Descrição**: Introdução ao projeto e suas funcionalidades.
2. **Tecnologias Utilizadas**: Lista das principais tecnologias usadas.
3. **Estrutura do Projeto**: Descrição dos modelos do banco de dados e rotas da API.
4.  **Deploy**: Endereço da aplicação online.
5. **Configuração do Projeto**: Passos para instalação e configuração do ambiente.
6. **Uso**: Como usar a API após a configuração.
7. **Testes**: Como executar os testes.


