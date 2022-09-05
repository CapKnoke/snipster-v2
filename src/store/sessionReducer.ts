import { User } from 'next-auth';

export type InitialSessionStateType = {
  user: User | null;
  theme: string;
  modalOpen: boolean;
  status: 'loading' | 'authenticated' | 'unauthenticated';
};

export const initialSessionState = {
  user: null,
  theme: 'system' as 'light' | 'dark' | 'system',
  modalOpen: false,
  status: 'loading' as 'loading' | 'authenticated' | 'unauthenticated',
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

export enum SessionTypes {
  SetUser = 'SET_USER',
  SetStatus = 'SET_STATUS',
  SetTheme = 'SET_THEME',
  ModalOpen = 'SET_MODAL',
}

type SessionPayload = {
  [SessionTypes.SetUser]: User;
  [SessionTypes.SetStatus]: 'loading' | 'authenticated' | 'unauthenticated';
  [SessionTypes.SetTheme]: 'light' | 'dark' | 'system';
  [SessionTypes.ModalOpen]: boolean;
};

export type SessionActions = ActionMap<SessionPayload>[keyof ActionMap<SessionPayload>];

export const sessionReducer = (sessionState: InitialSessionStateType, action: SessionActions) => {
  switch (action.type) {
    case SessionTypes.SetUser:
      return {
        ...sessionState,
        user: action.payload,
      };
    case SessionTypes.SetStatus:
      return {
        ...sessionState,
        status: action.payload,
      };
    case SessionTypes.SetTheme:
      return {
        ...sessionState,
        theme: action.payload,
      };
    case SessionTypes.ModalOpen:
      return {
        ...sessionState,
        modalOpen: action.payload,
      };
    default:
      return sessionState;
  }
};
