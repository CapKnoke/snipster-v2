import { useContext, useEffect } from 'react';
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { useSession } from 'next-auth/react';
import { createSSGHelpers } from '@trpc/react/ssg';
import superjson from 'superjson';
import { prisma } from '@server/prisma';
import { createContext as createServerContext } from '@server/context';
import { appRouter } from '@server/routers/_app';
import { trpc } from '@utils/trpc';
import { isFavorited, isVoted } from '@features/snippetDetail/utils/snippetActionUtils';
import SnippetDetail from '@features/snippetDetail';
import { AppContext } from 'src/store/context';
import { SnippetTypes } from 'src/store/snippetReducer';

export default function SnippetPage({ id }: InferGetStaticPropsType<typeof getStaticProps>) {
  const {
    state: {
      userState: { user },
      snippetState: { snippet },
    },
    dispatch,
  } = useContext(AppContext);
  const { data: session, status } = useSession();
  const snippetQuery = trpc.useQuery(['snippet.byId', { id }], {
    enabled: !!id,
    retryOnMount: true,
    retry: 3,
    onSuccess(data) {
      dispatch({ type: SnippetTypes.Set, payload: data });
      if (user) {
        dispatch({ type: SnippetTypes.SetOwnSnippet, payload: data.authorId === user.id });
        dispatch({ type: SnippetTypes.SetFavorites, payload: data._count.favorites})
        dispatch({ type: SnippetTypes.SetVotes, payload: data._count.votes})
      }
      return data;
    },
    onError(err) {
      console.log(err.message);
    },
  });

  useEffect(() => {
    if (session && snippetQuery.isSuccess) {
      dispatch({
        type: SnippetTypes.Vote,
        payload: isVoted(snippetQuery.data, session.user.id)
      });
      dispatch({
        type: SnippetTypes.Favorite,
        payload: isFavorited(snippetQuery.data, session.user.id),
      });
    }
  }, [status, snippetQuery.status]);

  if (snippetQuery.error) {
    return <div>{snippetQuery.error.message}</div>;
  }

  if (!snippet) {
    return <div>Loading...</div>;
  }

  return <SnippetDetail />;
}

export async function getStaticProps(ctx: GetStaticPropsContext<{ id: string }>) {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createServerContext(),
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
