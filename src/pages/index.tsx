import { trpc } from '../utils/trpc';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  const welcomeQuery = trpc.useQuery(['hello', { text: session?.user?.name }], {
    enabled: status !== 'loading',
  });
  if (!welcomeQuery.data) {
    return (
      <div className="text-center">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );
  }
  return (
    <div className="text-center">
      <h1 className="text-2xl capitalize">{welcomeQuery.data.greeting}</h1>
      <p>This is a work in progress.</p>
    </div>
  );
}
