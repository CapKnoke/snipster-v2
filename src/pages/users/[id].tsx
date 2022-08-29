import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { createSSGHelpers } from '@trpc/react/ssg';
import superjson from 'superjson';
import { prisma } from '@server/prisma';
import { appRouter } from '@server/routers/_app';
import { createContext } from '@server/context';
import { trpc } from '@utils/trpc';
import UserDetail from '@features/userDetail';

export default function User({ id }: InferGetStaticPropsType<typeof getStaticProps>) {
  const userQuery = trpc.useQuery(['user.byId', { id }], {
    enabled: !!id,
  });
  if (!userQuery.isSuccess) {
    return <div>Loading...</div>;
  }
  return <UserDetail user={userQuery.data} />;
}

export async function getStaticProps(ctx: GetStaticPropsContext<{ id: string }>) {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });
  const id = ctx.params?.id as string;
  await ssg.prefetchQuery('user.byId', { id });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const snippets = await prisma.user.findMany({
    select: {
      id: true,
    },
  });
  return {
    paths: snippets.map(({ id }) => ({
      params: {
        id,
      },
    })),
    fallback: 'blocking',
  };
};
