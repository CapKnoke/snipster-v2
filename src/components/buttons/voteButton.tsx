import { ThumbUpIcon as ThumbUpIconSolid } from '@heroicons/react/solid';
import { ThumbUpIcon as ThumbUpIconOutline } from '@heroicons/react/outline';
import { useContext, useState } from 'react';
import { trpc } from '@utils/trpc';
import { AppContext } from 'src/store/context';
import { SnippetTypes } from 'src/store/snippetReducer';

export default function VoteButton() {
  const {
    state: { snippetState, userState },
    dispatch,
  } = useContext(AppContext);
  const [pending, setPending] = useState(false);
  const voteMutation = trpc.useMutation(['snippet.vote']);
  const utils = trpc.useContext();

  const handleVote = async () => {
    if (snippetState.snippet) {
      setPending(true);
      voteMutation.mutate(
        { id: snippetState.snippet.id },
        {
          onError(error) {
            console.log(error.message);
          },
          async onSuccess(data) {
            dispatch({ type: SnippetTypes.Vote, payload: !snippetState.voted });
            dispatch({ type: SnippetTypes.SetVotes, payload: data._count.votes });
            await utils.invalidateQueries('snippet.byId');
          },
          onSettled() {
            setPending(false);
          },
        }
      );
    }
  };
  if (pending) {
    return <div className="btn btn-circle loading btn-ghost" />
  }
  return (
    <label className={`btn btn-circle btn-ghost swap swap-rotate${snippetState.isOwnSnippet || !userState.user ? ' btn-disabled' : ''}`} >
      <input
        type="checkbox"
        onChange={handleVote}
        checked={snippetState.voted}
        disabled={pending}
      />
      <ThumbUpIconOutline className="swap-off h-8 w-8" />
      <ThumbUpIconSolid className="swap-on h-8 w-8" />
    </label>
  );
}
