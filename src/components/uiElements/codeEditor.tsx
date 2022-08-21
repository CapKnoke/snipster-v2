import CodeMirror from '@uiw/react-codemirror';
import { githubDark } from '@uiw/codemirror-theme-github';
import { loadLanguage, langNames } from '@uiw/codemirror-extensions-langs';
import { EditorView } from '@codemirror/view';
import type { Extension } from '@codemirror/state/dist';
import { javascript } from '@codemirror/lang-javascript';

type CodeEditorProps = {
  language: typeof langNames[0];
  editable?: boolean;
  placeholder?: string;
  code?: string;
  setCode?: React.Dispatch<React.SetStateAction<string>>;
};

export default function CodeEditor({
  language,
  editable = false,
  placeholder,
  code,
  setCode,
}: CodeEditorProps) {
  const extensions = [EditorView.lineWrapping] as Extension[];
  const lang = loadLanguage(language);
  if (lang !== null) {
    extensions.push(lang);
  }
  return (
    <CodeMirror
      value={code || ''}
      placeholder={placeholder}
      onChange={setCode}
      height="100%"
      minHeight="20rem"
      theme={githubDark}
      extensions={extensions}
      editable={editable}
      className="flex-grow overflow-y-auto"
    />
  );
}
