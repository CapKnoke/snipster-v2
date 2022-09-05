import { inferQueryOutput } from '@utils/trpc';

export type SnippetDetail = inferQueryOutput<'snippet.byId'>;

export type InitialSnippetStateType = {
  snippet: SnippetDetail | null;
  voted: boolean;
  favorited: boolean;
  votes: number | null;
  favorites: number | null;
  isOwnSnippet: boolean;
  errors: boolean;
};

export const initialSnippetState = {
  snippet: null,
  voted: false,
  favorited: false,
  votes: null,
  favorites: null,
  isOwnSnippet: false,
};

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum SnippetTypes {
  Set = 'SET_SNIPPET',
  Vote = 'VOTE_SNIPPET',
  Favorite = 'FAVORITE_SNIPPET',
  SetFavorites = 'SET_FAVORITES',
  SetVotes = 'SET_VOTES',
  SetOwnSnippet = 'SET_OWN_SNIPPET',
}

type SnippetPayload = {
  [SnippetTypes.Set]: SnippetDetail | null;
  [SnippetTypes.Vote]: boolean;
  [SnippetTypes.Favorite]: boolean;
  [SnippetTypes.SetVotes]: number | null;
  [SnippetTypes.SetFavorites]: number | null;
  [SnippetTypes.SetOwnSnippet]: boolean;
};

export type SnippetActions = ActionMap<SnippetPayload>[keyof ActionMap<SnippetPayload>];

export const snippetReducer = (snippetState: InitialSnippetStateType, action: SnippetActions) => {
  switch (action.type) {
    case SnippetTypes.Set:
      return {
        ...snippetState,
        snippet: action.payload,
      };
    case SnippetTypes.Vote:
      return {
        ...snippetState,
        voted: action.payload,
      };
    case SnippetTypes.Favorite:
      return {
        ...snippetState,
        favorited: action.payload,
      };
    case SnippetTypes.SetVotes:
      return {
        ...snippetState,
        votes: action.payload,
      };
    case SnippetTypes.SetFavorites:
      return {
        ...snippetState,
        favorites: action.payload,
      };
    case SnippetTypes.SetOwnSnippet:
      return {
        ...snippetState,
        isOwnSnippet: action.payload,
      };
    default:
      return snippetState;
  }
};
