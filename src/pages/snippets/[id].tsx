import SnippetDetail from '@components/uiElements/snippetDetail';
import { prisma } from '@server/prisma';
import { appRouter } from '@server/routers/_app';
import { createSSGHelpers } from '@trpc/react/ssg';
import { trpc } from '@utils/trpc';
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import superjson from 'superjson';

export default function SnippetById({ id }: InferGetStaticPropsType<typeof getStaticProps>) {
  const snippetQuery = trpc.useQuery(['snippet.byId', { id }], {
    enabled: !!id,
  });
  if (!snippetQuery.isSuccess) {
    return <div>Loading...</div>;
  }
  return <SnippetDetail snippet={snippetQuery.data} />;
}

export async function getStaticProps(ctx: GetStaticPropsContext<{ id: string }>) {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: {
      userId: undefined,
      role: 'ADMIN',
    },
    transformer: superjson,
  });
  const id = ctx.params?.id as string;
  await ssg.prefetchQuery('snippet.byId', { id });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const snippets = await prisma.snippet.findMany({
    where: { deleted: false },
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
