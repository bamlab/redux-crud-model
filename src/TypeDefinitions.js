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
export type GlobalReducer<E> = (state: ?State<E>, action: any) => State<E>;

export type ModuleParams<E, A> = {
  name: string,
  reducers?: {
    [actionType: string]: Reducer<E>,
  },
  storeSelector?: Object => State<E>,
  actionTypes: A,
};

export type DefaultModuleParams<E> = {
  name: string,
  reducers?: {
    [actionType: string]: Reducer<E>,
  },
  storeSelector?: Object => State<E>,
};

export type ActionTypes = {|
  fetchOne: string,
  fetchOneSuccess: string,
  fetchOneFailure: string,
  fetchList: string,
  fetchListSuccess: string,
  fetchListFailure: string,
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

export type FetchOneAction<A> = {|
  type: $PropertyType<A, 'fetchOne'>,
  payload: { id: Id },
  meta: {
    context?: ?Object,
  },
|};
export type FetchOneSuccessAction<E, A> = {|
  type: $PropertyType<A, 'fetchOneSuccess'>,
  payload: { result: any },
  meta: {
    context?: ?Object,
    entities?: {
      [string]: NormalizedEntitiesType<E>,
    },
  },
|};
export type FetchOneFailureAction = {|
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
export type FetchListFailureAction = {|
  type: string,
  payload: any,
  meta: {
    context?: ?Object,
    name: ?string,
  },
  error: true,
|};

export type Creators<E, A> = {|
  fetchOne: (number, ?Object) => FetchOneAction<A>,
  fetchOneSuccess: (NormalizedResultType<E>, ?Object) => FetchOneSuccessAction<E, A>,
  fetchOneFailure: (Id, Object, ?Object) => FetchOneFailureAction,
  fetchList: (?string, ?Object) => FetchListAction,
  fetchListSuccess: (NormalizedResultType<E>, ?string, ?Object) => FetchListSuccessAction<E>,
  fetchListFailure: (Object, ?string, ?Object) => FetchListFailureAction,
|};

export type Module<E, A> = {|
  actionTypes: A,
  reducer: GlobalReducer<E>,
  selectors: Selectors<E>,
  localSelectors: LocalSelectors<E>,
  actionCreators: Creators<E, A>,
|};
