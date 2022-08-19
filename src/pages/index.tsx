import Head from 'next/head';
import Image from 'next/image';
import Header from '@components/header';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Snipster v2</title>
        <meta name="description" content="The ultimate snippet sharing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="py-16 px-8 flex-1 flex flex-col justify-center items-center"></main>
      <footer className="flex flex-initial py-8 border-t border-gray-200 justify-center items-center">
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className="h-4">
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
