import { trpc } from '../utils/trpc';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  const welcomeQuery = trpc.useQuery(['hello', { text: session?.user?.name }], {
    enabled: !!session?.user?.name,
  });
  if (!welcomeQuery.data) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <h1>{welcomeQuery.data.greeting}</h1>
    </>
  );
}
