import { Fragment, useEffect, useState } from 'react';
import { UserIcon, LogoutIcon } from '@heroicons/react/outline';
import { User } from 'next-auth';
import { Menu, Transition } from '@headlessui/react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { getInitials } from '../utils/userMenuUtils';
import ThemeSelectField from './themeSelectField';

type SignedInMenuProps = {
  user: User;
};

export default function SignedInMenu({ user }: SignedInMenuProps) {
  const [theme, setTheme] = useState(user.theme);
  return (
    <Menu as="div" className="relative inline-block text-left h-12 w-12">
      <Menu.Button className="btn btn-circle">
        {user.name ? (
          <div className="avatar placeholder">
            <div className="rounded-full w-10">
              <span className="text-xl">{getInitials(user.name)}</span>
            </div>
          </div>
        ) : (
          <UserIcon className="h-6 w-6" />
        )}
      </Menu.Button>
      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 divide-y divide-gray-700 rounded-md bg-gray-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-blue-500 text-white' : 'text-gray-100'
                  } group flex w-full gap-4 rounded-md px-2 py-2 text-sm`}
                >
                  {user.image ? (
                    <div className="avatar">
                      <div className="rounded-full w-12">
                        <Image src={user.image} alt="profile picture" height={50} width={50} />
                      </div>
                    </div>
                  ) : (
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus rounded-full w-12">
                        <UserIcon className="h-6 w-6" />
                      </div>
                    </div>
                  )}
                  <div className="text-left text-ellipsis">
                    <h1 className="text-lg">{user.name}</h1>
                    {user.role === 'ADMIN' && (
                      <span className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4 text-amber-400"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="lowercase first-letter:uppercase">{user.role}</p>
                      </span>
                    )}
                  </div>
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-blue-500 text-white' : 'text-gray-100'
                  } group flex w-full items-center rounded-md px-2 py-2 text-md`}
                  onClick={() => signOut()}
                >
                  <LogoutIcon className="mr-2 h-5 w-5" />
                  Sign Out
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1 bg-gray-700 rounded-b-md flex">
            <Menu.Item>
              <>
                <span className="px-2 self-center">Theme:</span>
                <ThemeSelectField
                  selected={theme}
                  setSelected={setTheme}
                />
              </>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
