import { StarIcon as StarIconSolid } from '@heroicons/react/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/outline';
import { useContext, useState } from 'react';
import { trpc } from '@utils/trpc';
import { SnippetTypes } from 'src/store/snippetReducer';
import { AppContext } from 'src/store/context';

export default function FavoriteButton() {
  const {
    state: { snippetState, userState },
    dispatch,
  } = useContext(AppContext);
  const [pending, setPending] = useState(false);
  const favoriteMutation = trpc.useMutation('snippet.favorite');
  const utils = trpc.useContext();

  const handleFavorite = async () => {
    if (snippetState.snippet) {
      setPending(true);
      favoriteMutation.mutate(
        { id: snippetState.snippet.id },
        {
          onError(error) {
            console.log(error.message);
          },
          async onSuccess() {
            dispatch({ type: SnippetTypes.Favorite, payload: !snippetState.favorited });
            await utils.refetchQueries(['snippet.byId']);
          },
          onSettled() {
            setPending(false);
          },
        }
      );
    }
  };
  return (
    <label
      className={`btn btn-circle btn-ghost swap ${
        snippetState.isOwnSnippet || !userState.user ? ' btn-disabled' : ''
      }`}
    >
      <input
        type="checkbox"
        onChange={handleFavorite}
        checked={snippetState.favorited}
        disabled={pending}
      />
      <StarIconOutline className="swap-off h-8 w-8" />
      <StarIconSolid className="swap-on h-8 w-8" />
    </label>
  );
}
