import React from 'react';
import { inferQueryOutput } from '@utils/trpc';
import Image from 'next/image';
import placeholder from 'public/placeholder.png';

type UserDetailProps = {
  user: inferQueryOutput<'user.byId'>;
};

export default function UserDetail({ user }: UserDetailProps) {
  return (
    <div className="flex min-h-[20rem]">
      <div className="avatar">
        <div className="w-[150px] h-[150px] rounded-full">
          <Image src={user.image ? user.image : placeholder} height={150} width={150} alt="profile image" />
        </div>
      </div>
      <div className="flex-col">
        <h1>{user.name}</h1>
        <p>{user.bio}</p>
        <span>{user._count.followers} Followers</span>
      </div>
    </div>
  );
}
