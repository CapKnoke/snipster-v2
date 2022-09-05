import { Dispatch, ReactNode, useReducer, createContext } from 'react';
import {
  initialSessionState,
  InitialSessionStateType,
  SessionActions,
  sessionReducer,
} from './sessionReducer';
import {
  initialSnippetState,
  InitialSnippetStateType,
  SnippetActions,
  snippetReducer,
} from './snippetReducer';
import { initialUserState, InitialUserStateType, UserActions, userReducer } from './userReducer';

export type InitialStateType = {
  snippetState: InitialSnippetStateType;
  userState: InitialUserStateType;
  sessionState: InitialSessionStateType;
};

export const initialState = {
  snippetState: initialSnippetState,
  userState: initialUserState,
  sessionState: initialSessionState,
};

export const AppContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<SnippetActions | UserActions | SessionActions>;
}>({
  state: initialState,
  dispatch: () => null,
});

const mainReducer = (
  { snippetState, userState, sessionState }: InitialStateType,
  action: SnippetActions | UserActions | SessionActions
) => ({
  snippetState: snippetReducer(snippetState, action as SnippetActions),
  userState: userReducer(userState, action as UserActions),
  sessionState: sessionReducer(sessionState, action as SessionActions),
});

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export default AppProvider;
