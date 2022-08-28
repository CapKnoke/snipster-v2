import CodeEditorSkeleton from '@components/skeletons/codeEditorSkeleton';
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(() => import('../uiElements/codeEditor'), {
  loading: () => <CodeEditorSkeleton />,
});

export default CodeEditor;
