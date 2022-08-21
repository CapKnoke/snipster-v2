import { ReactElement } from 'react';

type CreateSnippetLayoutProps = {
  main: ReactElement;
  aside: ReactElement;
};

export default function CreateSnippetLayout({ main, aside }: CreateSnippetLayoutProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex flex-col md:w-3/5">{main}</div>
      <div className="flex flex-col md:w-2/5">{aside}</div>
    </div>
  );
}
