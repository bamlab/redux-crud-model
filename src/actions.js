import createActionTypes from './actionTypes';

import type { ModuleParams, Creators } from './TypeDefinitions.js';

export default function createModueActionCreators<E>(moduleParams: ModuleParams<E>): Creators<E> {
  const actionTypes = createActionTypes(moduleParams);

  // FETCH ONE

  const fetchOne = (id, context) => ({
    type: actionTypes.fetchOne,
    payload: { id },
    meta: { context },
  });

  const fetchOneSuccess = (normalizedResult, context) => ({
    type: actionTypes.fetchOneSuccess,
    payload: {
      result: normalizedResult.result,
    },
    meta: {
      entities: normalizedResult.entities,
      context,
    },
  });

  const fetchOneFailure = (id, error, context) => ({
    type: actionTypes.fetchOneFailure,
    payload: error,
    error: true,
    meta: { id, context },
  });

  // FETCH LIST

  const fetchList = (name, context) => ({
    type: actionTypes.fetchList,
    payload: { name },
    meta: { context },
  });

  const fetchListSuccess = (normalizedResult, name, context) => ({
    type: actionTypes.fetchListSuccess,
    payload: {
      name,
      result: normalizedResult.result,
    },
    meta: {
      entities: normalizedResult.entities,
      context,
    },
  });

  const fetchListFailure = (error, name, context) => ({
    type: actionTypes.fetchListFailure,
    payload: error,
    error: true,
    meta: { context, name },
  });

  return {
    fetchOne,
    fetchOneSuccess,
    fetchOneFailure,
    fetchList,
    fetchListSuccess,
    fetchListFailure,
  };
}
