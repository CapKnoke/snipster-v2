import { LoginIcon } from '@heroicons/react/outline';
import { signIn } from 'next-auth/react';

export default function NotSignedInMenu() {
  return (
    <button onClick={() => signIn()} className="btn btn-primary">
      Sign In
      <LoginIcon className="h-6 w-6 ml-2" />
    </button>
  );
}
