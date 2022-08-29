import CreateSnippet from "@features/createSnippet";

export default function Create() {
  return <CreateSnippet />;
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
