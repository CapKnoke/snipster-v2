import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { ReactQueryDevtools } from 'react-query/devtools';
import { HomeIcon, UserIcon, DocumentAddIcon } from '@heroicons/react/outline';
import type { ReactElement } from 'react';
import UserMenu from '@features/userMenu';
import logo from 'public/logo.svg'

type MainLayoutProps = {
  children: ReactElement;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const { data: session, status } = useSession();
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Snipster v2</title>
        <meta name="description" content="The ultimate snippet sharing platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-between items-center bg-gray-900 py-6 px-4 sm:px-6 bg-opacity-40 backdrop-blur-lg drop-shadow-md">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <Link href="/">
              <Image
                width={150}
                height={40}
                src={logo}
                alt="Snipster"
                className="cursor-pointer"
              />
          </Link>
        </div>
        <UserMenu session={session} status={status} />
      </div>
      <div className="flex flex-grow flex-col-reverse lg:flex-row">
        <div className="flex lg:flex-col justify-center items-center bg-gray-800 p-4">
          <div className="flex lg:flex-col gap-4">
            <Link href="#">
              <a className="btn btn-square active">
                <HomeIcon className="h-6 w-6" />
              </a>
            </Link>
            <Link href="/create">
              <a className="btn btn-square active">
                <DocumentAddIcon className="h-6 w-6" />
              </a>
            </Link>
            <Link href="#">
              <a className="btn btn-square active">
                <UserIcon className="h-6 w-6" />
              </a>
            </Link>
          </div>
        </div>
        <main className="flex flex-col flex-grow max-w-screen-2xl 2xl:mx-auto p-4">{children}</main>
      </div>
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </div>
  );
}
