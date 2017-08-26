// @flow

import type { ActionTypes, ModuleParams } from './TypeDefinitions.js';

export default function createActionTypes<E>(moduleParams: ModuleParams<E>): ActionTypes {
  const { name } = moduleParams;
  const upperName = name.toUpperCase();

  return {
    fetchOne: `MODEL_${upperName}.FETCH_ONE`,
    fetchOneSuccess: `MODEL_${upperName}.FETCH_ONE_SUCCESS`,
    fetchOneFailure: `MODEL_${upperName}.FETCH_ONE_FAILURE`,
    fetchList: `MODEL_${upperName}.FETCH_LIST`,
    fetchListSuccess: `MODEL_${upperName}.FETCH_LIST_SUCCESS`,
    fetchListFailure: `MODEL_${upperName}.FETCH_LIST_FAILURE`,
  };
}
