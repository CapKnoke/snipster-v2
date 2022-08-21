import CreateSnippetLayout from './components/layout';
import CodeEditor from '@components/uiElements/codeEditor';
import CreateSnippetForm from './components/createSnippetForm';

export default function CreateSnippet() {
  return (
    <CreateSnippetLayout
      main={<CodeEditor language="javascript" />}
      aside={<CreateSnippetForm />}
    />
  );
}
