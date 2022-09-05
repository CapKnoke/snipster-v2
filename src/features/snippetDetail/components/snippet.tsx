import React, { useContext } from 'react';
import dynamic from 'next/dynamic';
import { LanguageName } from '@uiw/codemirror-extensions-langs';
import CodeViewSkeleton from '@components/skeletons/codeViewSkeleton';
import VoteButton from '@components/buttons/voteButton';
import FavoriteButton from '@components/buttons/favoriteButton';
import { AppContext } from 'src/store/context';

const CodeView = dynamic(() => import('@components/uiElements/codeView'), {
  loading: () => <CodeViewSkeleton />,
});

export default function Snippet() {
  const { state: { snippetState } } = useContext(AppContext);
  const snippet = snippetState.snippet;
  return (snippet &&
    <>
      <div className="flex flex-col p-4">
        <div className="shadow flex justify-between items-center">
          <div className="">
            <div className="stat-title text-xl whitespace-normal">{snippet.title}</div>
            <div className="stat-desc">{snippet.language}</div>
          </div>
          <div className="flex grow items-center justify-end">
          <div className="flex flex-col lg:flex-row">
            <VoteButton />
            <FavoriteButton />
          </div>
          </div>
        </div>
      </div>
      <CodeView
        code={snippet.code}
        language={snippet.language as LanguageName}
        className="min-h-[20rem] text-base"
      />
    </>
  );
}
