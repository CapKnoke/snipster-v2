import Head from 'next/head';
import Image from 'next/image';
import Header from '@components/header';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Snipster v2</title>
        <meta name="description" content="The ultimate snippet sharing platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="py-16 px-8 flex-1 flex flex-col justify-center items-center"></main>
    </div>
  );
}
