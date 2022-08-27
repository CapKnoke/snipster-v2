import React from 'react';
import { Session } from 'next-auth';
import SignedInMenu from './components/signedInMenu';
import NotSignedInMenu from './components/notSignedInMenu';

type UserMenuProps = {
  session: Session | null;
  status: 'loading' | 'unauthenticated' | 'authenticated';
};

export default function UserMenu({ session, status }: UserMenuProps) {
  if (status === 'loading') return <button className="btn btn-circle loading" />
  if (!session || !session.user) return <NotSignedInMenu />;
  return <SignedInMenu user={session.user} />
}
