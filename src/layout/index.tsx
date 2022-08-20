import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { ReactQueryDevtools } from 'react-query/devtools';
import type { ReactElement } from 'react';
import Header from './components/header';

type LayoutProps = {
  children: ReactElement;
};

export default function Layout({ children }: LayoutProps) {
  const { data: session, status } = useSession();
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Snipster v2</title>
        <meta name="description" content="The ultimate snippet sharing platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header session={session} status={status} />
      <main>{children}</main>
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </div>
  );
}
