import { Session } from 'next-auth';
import LoginButton from './components/loginButton';

type UserMenuProps = {
  session?: Session;
};

export default function UserMenu({ session }: UserMenuProps) {
  return <LoginButton session={session} />;
}
