import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { inferQueryOutput } from '@utils/trpc';
import { LanguageName } from '@uiw/codemirror-extensions-langs';
import CodeViewSkeleton from '@components/skeletons/codeViewSkeleton';

const CodeView = dynamic(() => import('@components/uiElements/codeView'), {
  loading: () => <CodeViewSkeleton />,
});

type SnippetDetailProps = {
  snippet: inferQueryOutput<'snippet.byId'>;
};

export default function SnippetDetail({ snippet }: SnippetDetailProps) {
  return (
    <div className="flex min-h-[20rem]">
      <CodeView
        code={snippet.code}
        language={snippet.language as LanguageName}
      />
    </div>
  );
}
