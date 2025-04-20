# Changelog

## v1.0.3

- 👌 **style:** Corrige erros de eslint e prettier [c7fb18a]

## v1.0.2
- 🔄 **Refactor:** Adiciona comandos ao Prisma [2cba2b7]
- 🐛 **Fix:** Ajusta ambiente no Docker Compose [60dd427]
- 🔧 **Chore:** Adiciona script de seed para Prisma [0af49b2]
- 📄 **Docs:** Atualiza README [d65d446, 8007be0, 0f7c73c, 0025a20]

## v1.0.1
- 🐛 **Fix:** Corrige compatibilidade do Prisma com Docker [4db26d3]
- 🔄 **Refactor:** Utiliza bcryptjs [76b904c]
- ➕ **Build:** Adiciona bcryptjs [32ae9e7]

## v1.0.0
- 🔧 **Chore:** Restringe a versão do Node para 18.20 até 22.14 [dab788d]

## v0.11.4
- ✨ **Feat:** Adiciona seed para Prisma [1653b91]

## v0.11.3
- 🔄 **Refactor:** Atualiza mensagens de erro no Swagger [272f96c]

## v0.11.2
- 🗑️ **Remove:** Remove código desnecessário [6ac63f0]
- 🐛 **Fix:** Corrige erros nos testes unitários [9a412bd, e271ed3]

## v0.11.1
- 🔄 **Refactor:** Ajusta tipos do Swagger para usuários [70ff31c]
- 🔄 **Refactor:** Adiciona guards de autenticação nas rotas de usuários [3f97e11]
- 🔄 **Refactor:** Adiciona exemplos no Swagger para signin [9dc7ea1]
- 🔄 **Refactor:** Garante que usuários e URLs encurtadas deletadas funcionam corretamente [11a7a44]

## v0.11.0
- 🔀 Merge: `docs/implementing-swagger-docs` → `develop` [b2405dd]
- ✨ **Feat:** Adiciona decoradores para Swagger [88b7cab, 07b9881]
- 🔄 **Refactor:** Usa decoradores para usuários [5bb680e]
- 🐛 **Fix:** Adiciona função `find-by-id` no serviço de usuários [74d9dd1]
- 🔄 **Refactor:** Usa Swagger no Auth Controller [f5e8373]
- ✨ **Feat:** Cria DTO para sign in [5a2591b]
- 🏷️ **Label:** Adiciona tipos do Swagger nos DTOs de usuário [ae446bb]
- 🔧 **Chore:** Configuração do Swagger [d7b5455]
- ➕ **Build:** Adiciona `swagger`, `class-transformer` e `class-validator` [da09542]

## v0.10.1
- 🐛 **Fix:** Corrige bug ao deletar usuário [0e709e9]
- ✨ **Feat:** Trata erro ao tentar cadastrar e-mail duplicado [9842678]
- 🐛 **Fix:** Encripta senha ao atualizar usuário [1119da4]
- 🐛 **Fix:** Adiciona busca por ID no serviço de usuários [a50c864]

## v0.10.0
- 🧹 **Cleanup:** Remove código desnecessário [f7d2cf3, 3db3808]
- ✅ **Test:** Adiciona testes para serviços e casos de uso de usuários e URLs encurtadas [7c43bd2, 24d0dfe, f410824, 24b4439, 858b5e7, 1a2a13f, 20f5ff9, e278780, 03a38e3, aa93285, 0c01e92, 4e83e3e, 7d83b54]

## v0.9.3
- 🧹 **Cleanup:** Remove comentários ESLint [379c210]
- 🔄 **Refactor:** Renomeia rota vazia para `all` [470d1ae]
- 🔄 **Refactor:** Atualiza mensagens de erro na exceção [815e8bd]

## v0.9.2
- ✨ **Feat:** Implementa logger para monitoramento de erros [eadd428, fbe42f9]

## v0.9.1
- 🔄 **Refactor:** Implementa validador de URL no caso de uso [0d76461]
- ✨ **Feat:** Adiciona validador de URL [399e649]

## v0.9.0
- 🗑️ **Remove:** Serviço `AppService` [4cbd5b6]
- ✨ **Feat:** Configura roteamento para redirecionamento [d1e2ba6, 847ea07]

## v0.8.2
- 🔄 **Refactor:** Adiciona encurtamento de URL no registro de usuários [21cc854]

## v0.8.1
- 🗄️ **Raw:** Adiciona nova migração e campo na tabela de URLs encurtadas [6d91d15, 67c2ebc]

## v0.8.0
- ✨ **Feat:** Implementa ações de CRUD autenticadas [620e945]

## v0.7.0
- 🔄 **Refactor:** Lógica para criação e registro de URLs encurtadas [29b0319]

## v0.6.0
- ✨ **Feat:** Implementa autenticação de usuários [7495a2f]
- 🔄 **Refactor:** Adiciona senha hash aos usuários [e12f41b]
- ➕ **Build:** Adiciona `bcrypt` e `nestjs-jwt` [42602f1, 99a0bf3]

## v0.5.0
- ✨ **Feat:** Implementa casos de uso para URLs encurtadas [83ff9d1, 07367c9, a73ca1e, ab11f46]
- 🐛 **Fix:** Corrige erro ao criar URL encurtada [edd42e7]
- 🔄 **Refactor:** Adiciona DTO ao body request [3cbc617]

## v0.4.1
- 🗄️ **Raw:** Adiciona nova migração e altera nome de campo [0847738, 5240ae5, 1d8dbdb]

## v0.4.0
- 🔀 Merge: `feature/create-users-endpoints` → `develop` [8aaeb9c]
- ✨ **Feat:** Criação de casos de uso e recursos para usuários [4d3562b, 5db7853]

## v0.3.2
- 🔀 Merge: `fix/add-missing-field-users` → `develop` [a879402]
- 🐛 **Fix:** Adiciona campo `deleted_at` ausente em usuários [da4c76c]

## v0.3.1
- 🐛 **Fix:** Implementação ausente do serviço do Prisma [105f92b]

## v0.3.0
- 🔧 **Chore:** Configuração do Docker [75a3600]

## v0.2.0
- ➕ **Build:** Adiciona cliente Prisma [6d88d76]
- 🗄️ **Raw:** Criação do schema Prisma [7c4cd78]

## v0.1.0
- 🚀 Primeira versão do projeto

