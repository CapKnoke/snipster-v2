/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import { env } from '@server/utils/env';
import { PrismaClient } from '@prisma/client';

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

const prisma: PrismaClient =
  prismaGlobal.prisma ||
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
}

prisma.$use(async (params, next) => {
  if (params.model == 'Snippet') {
    if (params.action == 'delete') {
      params.action = 'update';
      params.args['data'] = { deleted: true };
    }
    if (params.action == 'deleteMany') {
      params.action = 'updateMany';
      if (params.args.data != undefined) {
        params.args.data['deleted'] = true;
      } else {
        params.args['data'] = { deleted: true };
      }
    }
  }
  if (params.model == 'Comment') {
    if (params.action == 'delete') {
      params.action = 'update';
      params.args['data'] = { deleted: true };
    }
    if (params.action == 'deleteMany') {
      params.action = 'updateMany';
      if (params.args.data != undefined) {
        params.args.data['deleted'] = true;
      } else {
        params.args['data'] = { deleted: true };
      }
    }
  }
  return next(params);
});

export { prisma };
