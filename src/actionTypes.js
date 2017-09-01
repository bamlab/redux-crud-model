// @flow

import type { ActionTypes, ModuleParams } from './TypeDefinitions.js';

export default function createActionTypes<E, A>(moduleParams: ModuleParams<E, A>): A {
  const { name, actionTypes } = moduleParams;
  return actionTypes;
}
