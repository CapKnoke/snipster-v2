import { trpc } from '../utils/trpc';
import type { Session } from 'next-auth';
import { publicRuntimeConfig } from '@utils/publicRuntimeConfig';

type HomeProps = {
  session?: Session;
  name?: string;
};

export default function Home({ session }: HomeProps) {
  const welcomeQuery = trpc.useQuery(['hello', { text: session?.user?.name }]);
  if (!welcomeQuery.data) {
    return (
      <div className="text-center">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );
  }
  console.dir({ user: welcomeQuery.data.user, enviroment: publicRuntimeConfig.NODE_ENV });
  return (
    <div className="text-center">
      <h1 className="text-2xl capitalize">{welcomeQuery.data.greeting}</h1>
      <p>This is a work in progress.</p>
    </div>
  );
}
