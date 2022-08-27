import SnippetDetail from '@components/uiElements/snippetDetail';
import { prisma } from '@server/prisma';
import { appRouter } from '@server/routers/_app';
import { createSSGHelpers } from '@trpc/react/ssg';
import { trpc } from '@utils/trpc';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import superjson from 'superjson';

export default function SnippetById({ id }: InferGetStaticPropsType<typeof getStaticProps>) {
  const snippetQuery = trpc.useQuery(['snippet.byId', { id }]);
  if (snippetQuery.status !== 'success') {
    return <SnippetDetail snippet={null} />;
  }
  return <SnippetDetail snippet={snippetQuery.data} />;
}

export async function getStaticProps(ctx: GetStaticPropsContext<{ id: string }>) {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: {
      userId: undefined,
      role: 'ADMIN'
    },
    transformer: superjson,
  });
  const id = ctx.params?.id as string;
  await ssg.fetchQuery('snippet.byId', {
    id,
  });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
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
}
