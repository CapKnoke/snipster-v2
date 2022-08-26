import { Role, Theme } from '@prisma/client';
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
      theme: Theme;
    } & DefaultSession['user'];
  }
  interface User extends DefaultUser {
    role: Role;
    theme: Theme;
  }
}
