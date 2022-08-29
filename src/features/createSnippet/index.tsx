import React from 'react';
import CreateSnippetFormSkeleton from '@components/skeletons/createSnippetFormSkeleton';
import dynamic from 'next/dynamic';

const CreateSnippetForm = dynamic(() => import('./components/createSnippetForm'), {
  loading: () => <CreateSnippetFormSkeleton />
});

export default function CreateSnippet() {
  return (
    <CreateSnippetForm />
  );
}