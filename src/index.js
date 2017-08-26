// @flow
import createActionTypes from './actionTypes';
import createModuleReducer from './reducers';
import createModueActionCreators from './actions';
import createSelectors, { createLocalSelectors } from './selectors';

import type { Module, ModuleParams } from './TypeDefinitions.js';
export default function createModelModule<E>(moduleParams: ModuleParams<E>): Module<E> {
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
