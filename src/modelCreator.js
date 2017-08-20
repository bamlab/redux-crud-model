// @flow
import R from 'ramda';

import createReducer from './createReducer';
import type {
  Module,
  State,
  ModuleParams,
  ActionTypes,
  Reducer,
  Selectors,
  Creators,
  LocalSelectors,
  FetchOneAction,
  FetchOneFailedAction,
  Action,
} from './TypeDefinitions.js';

function createActionTypes(name: string): ActionTypes {
  const upperName = name.toUpperCase();

  return {
    fetchOne: `MODEL_${upperName}.FETCH_ONE`,
    fetchOneSuccess: `MODEL_${upperName}.FETCH_ONE_SUCCESS`,
    fetchOneFailed: `MODEL_${upperName}.FETCH_ONE_FAILED`,
    fetchList: `MODEL_${upperName}.FETCH_LIST`,
    fetchListSuccess: `MODEL_${upperName}.FETCH_LIST_SUCCESS`,
    fetchListFailed: `MODEL_${upperName}.FETCH_LIST_FAILED`,
  };
}

function createModuleReducer<E>(moduleParams: ModuleParams<E>): Reducer<E> {
  const { name, reducers } = moduleParams;
  const actionTypes = createActionTypes(name);

  const initialState: State<E> = {
    entities: {},
    status: {},
  };

  const fetchOneReducer: Reducer<E> = (state, action: FetchOneAction) =>
    R.assocPath(['status', action.payload.id], 'fetching', state);

  const fetchOneFailedReducer: Reducer<E> = (state, action: FetchOneFailedAction) =>
    R.assocPath(['status', action.meta.id], 'error', state);

  const defaultReducer: Reducer<E> = (state = initialState, action: Action<E>) => {
    const entities = R.path(['meta', 'entities', name], action);
    if (!entities) {
      return state;
    }
    return R.mergeDeepRight(state, {
      entities,
      status: R.map(() => 'fetched', entities),
    });
  };

  return createReducer(
    initialState,
    {
      [actionTypes.fetchOne]: fetchOneReducer,
      [actionTypes.fetchOneFailed]: fetchOneFailedReducer,
      ...reducers,
    },
    defaultReducer
  );
}

function createModulSelectors<E>(): Selectors<E> {
  const entitySelector = (state, id) => state.entities[id];
  // prettier-ignore
  const entityListSelector = (state, ids) => R.compose(
    R.filter((entity: ?E): boolean => !!entity),
    R.map(id => entitySelector(state, id)),
    R.values
  )(ids);

  return {
    entitySelector,
    entityListSelector,
    entitiesSelector: state => R.values(state.entities),
    statusSelector: (state, id) => state.status[id] || 'unknown',
  };
}

function createModueActionCreators<E>(moduleParams: ModuleParams<E>): Creators<E> {
  const { name } = moduleParams;
  const actionTypes = createActionTypes(name);

  return {
    fetchOne: (id, context) => ({
      type: actionTypes.fetchOne,
      payload: { id },
      meta: { context },
    }),
    fetchOneSuccess: (normalizedResult, context) => ({
      type: actionTypes.fetchOneSuccess,
      payload: {
        result: normalizedResult.result,
      },
      meta: {
        entities: normalizedResult.entities,
        context,
      },
    }),
    fetchOneFailed: (id, error, context) => ({
      type: actionTypes.fetchOneFailed,
      payload: error,
      error: true,
      meta: { id, context },
    }),
    fetchList: (name, context) => ({
      type: actionTypes.fetchList,
      payload: { name },
      meta: { context },
    }),
    fetchListSuccess: (normalizedResult, name, context) => ({
      type: actionTypes.fetchListSuccess,
      payload: {
        name,
        result: normalizedResult.result,
      },
      meta: {
        entities: normalizedResult.entities,
        context,
      },
    }),
    fetchListFailed: (error, name, context) => ({
      type: actionTypes.fetchListFailed,
      payload: error,
      error: true,
      meta: { context, name },
    }),
  };
}

function mapReselect<E>(moduleParams: ModuleParams<E>): (LocalSelectors<E>) => Selectors<E> {
  const defaultSelector = (state: Object): State<E> => state;
  const storeSelector = moduleParams.storeSelector || defaultSelector;

  const composeSelector = selector =>
    R.curryN(R.length(selector), (...args) => selector(...R.adjust(storeSelector, 0, args)));

  return R.map(composeSelector);
}

export default function createModelModule<E>(moduleParams: ModuleParams<E>): Module<E> {
  const { name } = moduleParams;

  const actionTypes = createActionTypes(name);
  const reducer = createModuleReducer(moduleParams);
  const localSelectors = createModulSelectors();
  const actionCreators = createModueActionCreators(moduleParams);
  const selectors = mapReselect(moduleParams)(localSelectors);

  return {
    actionTypes,
    reducer,
    selectors,
    localSelectors,
    actionCreators,
  };
}
