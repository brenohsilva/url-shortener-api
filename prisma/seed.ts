import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);

  await prisma.users.create({
    data: {
      name: 'Joe Doe',
      email: 'joe.doe@hotmail.com',
      password: hashedPassword,
    },
  });

  console.log('Usuário criado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
