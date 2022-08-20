import { Session } from 'next-auth';
import LoginButton from './components/loginButton';

type UserMenuProps = {
  session: Session | null,
  status: 'authenticated' | 'loading' | 'unauthenticated'
}

export default function UserMenu({session, status}: UserMenuProps) {
  return (
    <LoginButton status={status} />
  )
}