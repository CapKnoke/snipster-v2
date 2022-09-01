import React from 'react';
import { inferQueryOutput } from '@utils/trpc';
import SnippetInfo from './components/snippetInfo';

type SnippetDetailProps = {
  snippet: inferQueryOutput<'snippet.byId'>;
};

export default function SnippetDetail({ snippet }: SnippetDetailProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:max-h-[calc(100vh-12rem)] lg:max-h-[calc(100vh-7rem)]">
      <SnippetInfo snippet={snippet} />
      <div className="flex flex-col md:w-2/5 p-4 bg-gray-900 shadow-lg">
      </div>
    </div>
  );
}
