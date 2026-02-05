import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const interests = [
  'Web Development',
  'Data Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Cloud Computing',
  'Mobile Development',
  'Cybersecurity',
  'DevOps',
  'UI/UX Design',
  'Blockchain',
];

async function main() {
  console.log('Seeding interests...');

  for (const name of interests) {
    await prisma.interest.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log(`Seeded ${interests.length} interests`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
