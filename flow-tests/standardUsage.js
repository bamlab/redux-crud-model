// @flow
// The flow type check of this file must pass before deploying

import { normalize, schema } from 'normalizr';
import createModelModule from '../';
import type {
  Module,
  State as AbstractState,
  Action as AbstractAction,
  NormalizedResultType,
} from '../';

type User = {
  id: number,
  email: string,
  name: string,
};

const { actionTypes, reducer, actionCreators, selectors }: Module<User, *> = createModelModule({
  name: 'user',
});

export type Action = AbstractAction<User>;
export type State = AbstractState<User>;

// ACTIONS
const user: User = {
  id: 1,
  email: 'my@emall.com',
  name: 'John Doe',
};
const normalizedUser = normalize(user, new schema.Entity('user', {}));
reducer(undefined, actionCreators.fetchOneSuccess(normalizedUser));

// $FlowExpectedError
const wrongNormalizedEntity: NormalizedResultType<{ foo: string }> = normalize(
  { foo: 'bar' },
  new schema.Entity('user', {})
);
actionCreators.fetchOneSuccess(wrongNormalizedEntity);

// REDUCER
type UserState = {
  userId: number,
};

export default function userReducer(state: UserState, action: Action): UserState {
  switch (action.type) {
    case actionTypes.fetchOne:
      return {
        ...state,
        userId: action.payload.id,
      };
    case actionTypes.fetchOneSuccess:
      return {
        ...state,
        userId: action.payload.result,
      };

    default:
      return state;
  }
}

// SELCTORS

export function userSelector(state: State): ?User {
  return selectors.entitySelector(state, 1);
}

// $FlowExpectedError
export function wrongserSelector(state: State): { foo: string } {
  return selectors.entitySelector(state, 1);
}
