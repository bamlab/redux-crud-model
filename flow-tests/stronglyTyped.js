// @flow
// The flow type check of this file must pass before deploying
import { createTypedModule } from '../';
import type {
  Module,
  State as AbstractState,
  Action as AbstractAction,
  FetchOneSuccessAction,
  FetchOneAction,
} from '../';

type User = {
  id: number,
  email: string,
  name: string,
};

type ActionTypes = {
  fetchOne: 'USER_FETCH_ONE',
  fetchOneSuccess: 'USER_FETCH_ONE_SUCCESS',
  fetchOneFailure: string,
  fetchList: string,
  fetchListSuccess: string,
  fetchListFailure: string,
};

const originalActionTypes: ActionTypes = {
  fetchOne: 'USER_FETCH_ONE',
  fetchOneSuccess: 'USER_FETCH_ONE_SUCCESS',
  fetchOneFailure: '',
  fetchList: '',
  fetchListSuccess: '',
  fetchListFailure: '',
};

const { actionTypes }: Module<User, ActionTypes> = createTypedModule({
  name: 'user',
  actionTypes: originalActionTypes,
});

export type ActionOld = AbstractAction<User>;
type Action = FetchOneSuccessAction<User, ActionTypes> | FetchOneAction<ActionTypes>;
export type State = AbstractState<User>;

// REDUCER
type UserState = {
  userId: number,
};

(actionTypes: ActionTypes);

export default function userReducer(state: UserState, action: Action): UserState {
  switch (action.type) {
    case actionTypes.fetchOne:
      (action.type: 'USER_FETCH_ONE');
      return {
        ...state,
        // $FlowExpectedError
        userId: action.payload.foo,
      };
    case actionTypes.fetchOneSuccess:
      (action.type: 'USER_FETCH_ONE_SUCCESS');
      return {
        ...state,
        userId: action.payload.result,
      };

    default:
      return state;
  }
}
