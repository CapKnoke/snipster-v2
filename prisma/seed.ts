import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEST_USER_ID = 'cl7nf7xxo0044356kuk54n4wy';
const TEST_SNIPPET_IDS = ['cl7nf5pyd0006356kueb0eick', 'cl7nf7xxo0058356k9d8awq28'];

async function main() {
  await prisma.user.create({
    data: {
      id: TEST_USER_ID,
      name: 'John Doe',
      snippets: {
        createMany: {
          data: [
            {
              id: TEST_SNIPPET_IDS[0],
              title: 'Public Snippet',
              code: 'This is an example snippet generated from `prisma/seed.ts`',
              language: 'javascript',
              public: true,
            },
            {
              id: TEST_SNIPPET_IDS[1],
              title: 'Private Snippet',
              code: 'This is an example snippet generated from `prisma/seed.ts`',
              language: 'javascript',
              public: false,
            }
          ]
        }
      }
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
