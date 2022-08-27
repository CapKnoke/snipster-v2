import React from 'react';
import { inferQueryOutput } from '@utils/trpc';
import { LanguageName } from '@uiw/codemirror-extensions-langs';
import CodeEditor from './codeEditor';

type SnippetDetailProps = {
  snippet: inferQueryOutput<'snippet.byId'> | null;
}

export default function SnippetDetail({ snippet }: SnippetDetailProps) {
  return (
    <div>
      <CodeEditor
       code={snippet?.code}
       language={snippet?.language as LanguageName}
      />
    </div>
  )
}
