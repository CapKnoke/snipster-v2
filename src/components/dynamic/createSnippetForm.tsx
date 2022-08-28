import CreateSnippetFormSkeleton from '@components/skeletons/createSnippetFormSkeleton';
import dynamic from 'next/dynamic';

const CreateSnippetForm = dynamic(() => import('../forms/createSnippetForm'), {
  loading: () => <CreateSnippetFormSkeleton />,
});

export default CreateSnippetForm;