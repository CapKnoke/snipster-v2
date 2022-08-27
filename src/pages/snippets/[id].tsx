import SnippetDetail from '@components/uiElements/snippetDetail';
import { createContext } from '@server/context';
import { prisma } from '@server/prisma';
import { appRouter } from '@server/routers/_app';
import { createSSGHelpers } from '@trpc/react/ssg';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import superjson from 'superjson';

export default function SnippetById({ snippet }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SnippetDetail snippet={snippet} />;
}

export async function getStaticProps(ctx: GetStaticPropsContext<{ id: string }>) {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });
  const id = ctx.params?.id as string;
  const snippet = await ssg.fetchQuery('snippet.byId', { id });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      snippet,
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
