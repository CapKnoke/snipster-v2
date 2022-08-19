import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function LoginButton() {
  const { data: session } = useSession();
  return session ? (
    <button onClick={() => signOut()} className="btn btn-primary btn-outline">
      Sign Out
    </button>
  ) : (
    <button onClick={() => signIn()} className="btn btn-primary">
      Sign In
    </button>
  );
}
