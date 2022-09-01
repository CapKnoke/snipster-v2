import React, { ReactElement } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { ReactQueryDevtools } from 'react-query/devtools';
import { HomeIcon, UserIcon, CodeIcon } from '@heroicons/react/outline';
import UserMenu from '@features/userMenu';
import logo from 'public/logo.svg'
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

type MainLayoutProps = {
  session?: Session;
  children: ReactElement;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const { data: session, status } = useSession()
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Snipster v2</title>
        <meta name="description" content="The ultimate snippet sharing platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-between items-center sticky top-0 z-20 bg-accent py-4 px-4 bg-opacity-40 backdrop-blur-lg drop-shadow-md">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <Link href="/">
            <a>
              <Image
                width={150}
                height={40}
                src={logo}
                alt="Snipster"
                className="cursor-pointer"
              />
            </a>
          </Link>
        </div>
        <UserMenu session={session} status={status} />
      </div>
      <div className="flex flex-grow flex-col-reverse lg:flex-row">
        <div className="flex sticky bottom-0 lg:fixed lg:flex-col lg:h-[calc(100vh-5rem)] justify-center items-center bg-neutral p-4 z-10">
          <div className="flex lg:flex-col gap-4">
            <Link href="/">
              <a className="btn btn-square">
                <HomeIcon className="h-6 w-6" />
              </a>
            </Link>
            <Link href="/create">
              <a className={`btn btn-square${status === 'unauthenticated' ? " btn-disabled" : ""}`}>
                <CodeIcon className="h-6 w-6" />
              </a>
            </Link>
            <Link href="#">
              <a className={`btn btn-square${status === 'unauthenticated' ? " btn-disabled" : ""}`}>
                <UserIcon className="h-6 w-6" />
              </a>
            </Link>
          </div>
        </div>
        <div className="flex flex-grow 2xl:mx-auto max-w-screen-2xl">
          <main className="flex flex-col flex-grow p-4 lg:ml-20">{children}</main>
        </div>
      </div>
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </div>
  );
}
