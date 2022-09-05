import React from 'react';
import Snippet from './components/snippet';

export default function SnippetDetail() {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:max-h-[calc(100vh-12rem)] lg:max-h-[calc(100vh-7rem)]">
      <div className="flex flex-col md:w-3/5 bg-gray-900 shadow-lg">
        <Snippet />
      </div>
      <div className="flex flex-col md:w-2/5 p-4 bg-gray-900 shadow-lg">
      </div>
    </div>
  );
}
