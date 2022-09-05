import { inferQueryOutput } from '@utils/trpc';

export type UserDetail = inferQueryOutput<'user.byId'>;

export type InitialUserStateType = {
  user: UserDetail | null;
  following: boolean;
  followers: number | null;
  isOwnUser: boolean;
};

export const initialUserState = {
  user: null,
  following: false,
  followers: null,
  isOwnUser: false,
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

export enum UserTypes {
  SetUser = 'SET_USER',
  Follow = 'FOLLOW_USER',
  SetFollowers = 'SET_FOLLOWERS',
  SetOwnUser = 'SET_OWN_USER',
}

type UserPayload = {
  [UserTypes.SetUser]: UserDetail | null;
  [UserTypes.Follow]: boolean;
  [UserTypes.SetFollowers]: number | null;
  [UserTypes.SetOwnUser]: boolean;
};

export type UserActions = ActionMap<UserPayload>[keyof ActionMap<UserPayload>];

export const userReducer = (userState: InitialUserStateType, action: UserActions) => {
  switch (action.type) {
    case UserTypes.SetUser:
      return {
        ...userState,
        user: action.payload,
      };
    case UserTypes.Follow:
      return {
        ...userState,
        following: action.payload,
      };
    case UserTypes.SetFollowers:
      return {
        ...userState,
        followers: action.payload,
      };
    case UserTypes.SetOwnUser:
      return {
        ...userState,
        isOwnUser: action.payload,
      };
    default:
      return userState;
  }
};
