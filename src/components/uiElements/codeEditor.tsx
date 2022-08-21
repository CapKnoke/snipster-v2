import React, { Ref } from 'react';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
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
};

const CodeEditor = React.forwardRef(
  (
    { language = 'javascript', editable, placeholder, code }: CodeEditorProps,
    ref: Ref<ReactCodeMirrorRef>
  ) => {
    const extensions = [EditorView.lineWrapping] as Extension[];
    const lang = loadLanguage(language);
    if (lang !== null) {
      extensions.push(lang);
    }
    return (
      <CodeMirror
        ref={ref}
        value={code || ''}
        placeholder={placeholder}
        height="100%"
        minHeight="20rem"
        theme={githubDark}
        extensions={extensions}
        editable={editable}
        className="flex-grow overflow-y-auto"
      />
    );
  }
);

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;
