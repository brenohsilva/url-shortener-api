FROM node:22-alpine

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . .

# Gera o Prisma Client
RUN npx prisma generate

EXPOSE 3000

CMD sh -c "npx prisma db push && npx prisma db seed || echo 'Seed falhou, continuando...' && npm run start"
