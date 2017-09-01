// @flow
import R from 'ramda';

import createReducer from './createReducer';
import createActionTypes from './actionTypes';

import type {
  State,
  ModuleParams,
  Reducer,
  GlobalReducer,
  FetchOneAction,
  FetchOneFailureAction,
  Action,
} from './TypeDefinitions.js';

const createDefaultReducer = (name: string): Reducer<*> => (state, action: Action<*>) => {
  const entities = R.path(['meta', 'entities', name], action);
  if (!entities) {
    return state;
  }
  return R.mergeDeepRight(state, {
    entities,
    status: R.map(() => 'fetched', entities),
  });
};

const fetchOneReducer: Reducer<*> = (state, action: FetchOneAction<*>) =>
  R.assocPath(['status', action.payload.id], 'fetching', state);

const fetchOneFailureReducer: Reducer<*> = (state, action: FetchOneFailureAction) =>
  R.assocPath(['status', action.meta.id], 'error', state);

export default function createModuleReducer<E>(moduleParams: ModuleParams<E, *>): GlobalReducer<E> {
  const { name, reducers } = moduleParams;
  const actionTypes = createActionTypes(moduleParams);

  const initialState: State<E> = {
    entities: {},
    status: {},
  };

  return createReducer(
    initialState,
    {
      [actionTypes.fetchOne]: fetchOneReducer,
      [actionTypes.fetchOneFailure]: fetchOneFailureReducer,
      ...reducers,
    },
    createDefaultReducer(name)
  );
}
