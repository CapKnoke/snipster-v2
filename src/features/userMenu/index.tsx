import React, { useContext } from 'react';
import { Session } from 'next-auth';
import SignedInMenu from './components/signedInMenu';
import NotSignedInMenu from './components/notSignedInMenu';
import { AppContext } from 'src/store/context';

export default function UserMenu() {
  const { state: { sessionState } } = useContext(AppContext)
  if (sessionState.status === 'loading') return <button className="btn btn-circle loading" />
  if (sessionState.status === 'unauthenticated') return <NotSignedInMenu />;
  return <SignedInMenu />
}
