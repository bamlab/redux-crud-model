// @flow
export type Id = number;
export type EntityStatus = 'fetching' | 'fetched' | 'error' | 'saving' | 'unknown';

export type NormalizedEntitiesType<E> = {
  [Id]: E,
};

export type NormalizedResultType<E> = {
  result: any,
  entities: {
    [string]: NormalizedEntitiesType<E>,
  },
};

export type Action<E> = {|
  type: string,
  payload: any,
  meta: {
    entities?: {
      [string]: NormalizedEntitiesType<E>,
    },
    context?: ?Object,
    id?: Id,
  },
  error?: boolean,
|};

export type State<E> = {
  entities: NormalizedEntitiesType<E>,
  status: {
    [Id]: EntityStatus,
  },
};

export type Reducer<E> = (state: State<E>, action: any) => State<E>;

export type ModuleParams<E> = {
  name: string,
  reducers?: {
    [actionType: string]: Reducer<E>,
  },
  storeSelector: Object => State<E>,
};

export type ActionTypes = {|
  fetchOne: string,
  fetchOneSuccess: string,
  fetchOneFailed: string,
  fetchList: string,
  fetchListSuccess: string,
  fetchListFailed: string,
|};

export type Selectors<E> = {|
  entitySelector: (Object, Id) => E,
  statusSelector: (Object, Id) => EntityStatus,
  entityListSelector: (Object, Id[] | { [any]: Id }) => E[],
  entitiesSelector: Object => E[],
|};

export type LocalSelectors<E> = {|
  entitySelector: (State<E>, Id) => E,
  statusSelector: (State<E>, Id) => EntityStatus,
  entityListSelector: (State<E>, Id[] | { [any]: Id }) => E[],
  entitiesSelector: (State<E>) => E[],
|};

export type FetchOneAction = {|
  type: string,
  payload: { id: Id },
  meta: {
    context?: ?Object,
  },
|};
export type FetchOneSuccessAction<E> = {|
  type: string,
  payload: { result: any },
  meta: {
    context?: ?Object,
    entities?: {
      [string]: NormalizedEntitiesType<E>,
    },
  },
|};
export type FetchOneFailedAction = {|
  type: string,
  payload: any,
  meta: {
    context?: ?Object,
    id: Id,
  },
  error: true,
|};

export type FetchListAction = {|
  type: string,
  payload: { name: ?string },
  meta: {
    context?: ?Object,
  },
|};
export type FetchListSuccessAction<E> = {|
  type: string,
  payload: { result: any, name: ?string },
  meta: {
    context?: ?Object,
    entities?: {
      [string]: NormalizedEntitiesType<E>,
    },
  },
|};
export type FetchListFailedAction = {|
  type: string,
  payload: any,
  meta: {
    context?: ?Object,
    name: ?string,
  },
  error: true,
|};

export type Creators<E> = {|
  fetchOne: (number, ?Object) => FetchOneAction,
  fetchOneSuccess: (NormalizedResultType<E>, ?Object) => FetchOneSuccessAction<E>,
  fetchOneFailed: (Id, Object, ?Object) => FetchOneFailedAction,
  fetchList: (?string, ?Object) => FetchListAction,
  fetchListSuccess: (NormalizedResultType<E>, ?string, ?Object) => FetchListSuccessAction<E>,
  fetchListFailed: (Object, ?string, ?Object) => FetchListFailedAction,
|};

export type Module<E> = {|
  actionTypes: ActionTypes,
  reducer: Reducer<E>,
  selectors: Selectors<E>,
  localSelectors: LocalSelectors<E>,
  actionCreators: Creators<E>,
|};