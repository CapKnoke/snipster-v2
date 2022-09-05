import type { SnippetDetail } from "src/store/snippetReducer";

export const isVoted = (snippet: SnippetDetail, userId: string) => {
  const votes = snippet.votes.map(({ userId })=> userId)
  return votes.includes(userId);
};

export const isFavorited = (snippet: SnippetDetail, userId: string) => {
  const favorites = snippet.favorites.map(({ userId })=> userId)
  return favorites.includes(userId);
};
