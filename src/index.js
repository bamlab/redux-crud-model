// @flow
import createActionTypes from './actionTypes';
import createModuleReducer from './reducers';
import createModueActionCreators from './actions';
import createSelectors, { createLocalSelectors } from './selectors';

import type { Module, ModuleParams, ActionTypes, DefaultModuleParams } from './TypeDefinitions.js';
export * from './TypeDefinitions';

export function createTypedModule<E, A>(moduleParams: ModuleParams<E, A>): Module<E, A> {
  const actionTypes = createActionTypes(moduleParams);
  const reducer = createModuleReducer(moduleParams);
  const selectors = createSelectors(moduleParams);
  const localSelectors = createLocalSelectors();
  const actionCreators = createModueActionCreators(moduleParams);

  return {
    actionTypes,
    reducer,
    selectors,
    localSelectors,
    actionCreators,
  };
}

export default function createModule<E>(
  moduleParams: DefaultModuleParams<E>
): Module<E, ActionTypes> {
  const upperName = moduleParams.name.toUpperCase();
  const actionTypes: ActionTypes = {
    fetchOne: `MODEL_${upperName}.FETCH_ONE`,
    fetchOneSuccess: `MODEL_${upperName}.FETCH_ONE_SUCCESS`,
    fetchOneFailure: `MODEL_${upperName}.FETCH_ONE_FAILURE`,
    fetchList: `MODEL_${upperName}.FETCH_LIST`,
    fetchListSuccess: `MODEL_${upperName}.FETCH_LIST_SUCCESS`,
    fetchListFailure: `MODEL_${upperName}.FETCH_LIST_FAILURE`,
  };

  const module: Module<E, ActionTypes> = createTypedModule({
    ...moduleParams,
    actionTypes,
  });
  return module;
}
