import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { githubDark } from '@uiw/codemirror-theme-github';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { EditorView } from '@codemirror/view';
import type { LanguageName } from '@uiw/codemirror-extensions-langs';
import type { Extension } from '@codemirror/state/dist';

type CodeEditorProps = {
  language?: LanguageName;
  editable?: boolean;
  placeholder?: string;
  code?: string;
  onChange?(value: string): void;
  className?: string;
};

export default function CodeEditor({
  language = 'javascript',
  editable = false,
  placeholder,
  code,
  onChange,
  className
}: CodeEditorProps) {
  const extensions = [EditorView.lineWrapping] as Extension[];
  const lang = loadLanguage(language);
  if (lang !== null) {
    extensions.push(lang);
  }
  return (
    <CodeMirror
      value={code || ''}
      onChange={onChange}
      placeholder={placeholder}
      height="100%"
      theme={githubDark}
      extensions={extensions}
      editable={editable}
      className={`flex-grow overflow-y-auto${className && ` ${className}`}`}
    />
  );
}
