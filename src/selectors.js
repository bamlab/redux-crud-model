// @flow
import R from 'ramda';

import type { State, ModuleParams, Selectors, LocalSelectors } from './TypeDefinitions.js';

function mapReselect<E, A>(moduleParams: ModuleParams<E, A>): (LocalSelectors<E>) => Selectors<E> {
  const defaultSelector = (state: Object): State<E> => state;
  const storeSelector = moduleParams.storeSelector || defaultSelector;

  const composeSelector = selector =>
    R.curryN(R.length(selector), (...args) => selector(...R.adjust(storeSelector, 0, args)));

  return R.map(composeSelector);
}

export function createLocalSelectors<E>(): Selectors<E> {
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

export default function createSelectors<E, A>(moduleParams: ModuleParams<E, A>): Selectors<E> {
  return mapReselect(moduleParams)(createLocalSelectors());
}
