import React from 'react';
import UserMenu from '@features/userMenu';
import { Session } from 'next-auth';

type HeaderProps = {
  session: Session | null,
  status: 'authenticated' | 'loading' | 'unauthenticated'
};

export default function Header({session, status}: HeaderProps) {
  return (
    <div className="flex justify-between items-center bg-gray-900 py-6 px-4 sm:px-6 bg-opacity-40 backdrop-blur-lg rounded drop-shadow-lg">
      <div className="flex justify-start lg:w-0 lg:flex-1">
        <a href="#">
          <span className="sr-only">Workflow</span>
          <img
            className="h-8 w-auto sm:h-10"
            src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
            alt=""
          />
        </a>
      </div>
      <UserMenu session={session} status={status} />
    </div>
  );
}
