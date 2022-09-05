import React from 'react';
import { LoginIcon } from '@heroicons/react/outline';
import { signIn } from 'next-auth/react';
import ThemeSelectSwap from './themeSelectSwap';

export default function NotSignedInMenu() {
  return (
    <div className="flex gap-2 items-center">
      <ThemeSelectSwap />
      <button onClick={() => signIn()} className="btn btn-primary btn-outline">
        Sign In
        <LoginIcon className="h-6 w-6 ml-2" />
      </button>
    </div>
  );
}
