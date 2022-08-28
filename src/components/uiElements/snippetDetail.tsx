import React from 'react';
import { inferQueryOutput } from '@utils/trpc';
import { LanguageName } from '@uiw/codemirror-extensions-langs';
import CodeEditor from '@components/dynamic/codeEditor';

type SnippetDetailProps = {
  snippet: inferQueryOutput<'snippet.byId'>;
};

export default function SnippetDetail({ snippet }: SnippetDetailProps) {
  return (
    <div className="flex min-h-[20rem]">
      <CodeEditor
        code={snippet.code}
        language={snippet.language as LanguageName}
      />
    </div>
  );
}
