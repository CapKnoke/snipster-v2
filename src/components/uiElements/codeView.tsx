import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { githubDark } from '@uiw/codemirror-theme-github';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { EditorView } from '@codemirror/view';
import type { LanguageName } from '@uiw/codemirror-extensions-langs';
import type { Extension } from '@codemirror/state/dist';

type CodeViewProps = {
  language?: LanguageName;
  code?: string;
  className?: string;
};

export default function CodeView({
  language = 'javascript',
  code,
  className
}: CodeViewProps) {
  const extensions = [EditorView.lineWrapping] as Extension[];
  const lang = loadLanguage(language);
  if (lang !== null) {
    extensions.push(lang);
  }
  return (
    <CodeMirror
      value={code || ''}
      height="100%"
      theme={githubDark}
      extensions={extensions}
      basicSetup={{
        highlightActiveLine: false,
      }}
      className={`grow overflow-y-auto ${className}`}
    />
  );
}
