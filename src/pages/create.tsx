import CreateSnippetForm from '@components/dynamic/createSnippetForm';

export default function Create() {
  return <CreateSnippetForm />;
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
