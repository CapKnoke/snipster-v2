import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { inferQueryOutput } from '@utils/trpc';
import { LanguageName } from '@uiw/codemirror-extensions-langs';
import CodeViewSkeleton from '@components/skeletons/codeViewSkeleton';
import placeholder from 'public/placeholder.png';

const CodeView = dynamic(() => import('@components/uiElements/codeView'), {
  loading: () => <CodeViewSkeleton />,
});

type SnippetDetailProps = {
  snippet: inferQueryOutput<'snippet.byId'>;
};

export default function SnippetInfo({ snippet }: SnippetDetailProps) {
  return (
    <div className="flex flex-col md:w-3/5 bg-gray-900 shadow-lg">
      <div className="flex flex-col">
        <div className="stats shadow rounded-b-none stats-vertical md:stats-horizontal">
          <div className="stat px-4">
            <div className="stat-title text-xl whitespace-normal">{snippet.title}</div>
            <div className="stat-desc">{snippet.language}</div>
          </div>
          <div className="stat px-4">
            <div className="stat-figure flex flex-col items-end text-right gap-2">
              <h1 className="text-xl stat-title text-ellipsis">{snippet.author.name}</h1>
              <div className="avatar">
                <div className="w-16 rounded-xl">
                  <Image
                    src={snippet.author.image ? snippet.author.image : placeholder}
                    height={100}
                    width={100}
                    alt="profile image"
                  />
                </div>
              </div>
            </div>
            <div className="stat-title">Followers</div>
            <div className="stat-value text-lg">{snippet.author._count.followers}</div>
            <div className="stat-actions mt-0">
              <button className="btn btn-sm btn-primary">Follow</button>
            </div>
          </div>
        </div>
      </div>
      <CodeView
        code={snippet.code}
        language={snippet.language as LanguageName}
        className="min-h-[20rem] text-base"
      />
    </div>
  );
}
