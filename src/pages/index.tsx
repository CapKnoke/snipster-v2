import { trpc } from '@utils/trpc';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  const welcomeQuery = trpc.useQuery(['hello', { text: session?.user?.name }], {
    enabled: status !== 'loading',
  });
  return (
    <div className="hero flex-grow">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl capitalize">
            {
              welcomeQuery.data ?
              welcomeQuery.data.greeting :
              'Loading...'
            }
          </h1>
          {welcomeQuery.data && <p className="py-6">This is a work in progress.</p>}
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {}
  }
}
