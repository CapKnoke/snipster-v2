import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  const utils = trpc.useContext();
  const welcomeQuery = trpc.useQuery(['hello', { text: session?.user?.name }]);

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   for (const { id } of postsQuery.data ?? []) {
  //     utils.prefetchQuery(['post.byId', { id }]);
  //   }
  // }, [postsQuery.data, utils]);
  if (!welcomeQuery.data) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <h1>{welcomeQuery.data.greeting}</h1>
    </>
  );
};
