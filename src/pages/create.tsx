import CreateSnippetForm from '@components/forms/createSnippetForm';

export default function Create() {
  return <CreateSnippetForm />;
}

export async function getStaticProps() {
  return {
    props: {}
  }
}