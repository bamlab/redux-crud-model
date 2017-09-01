# redux-crud-model
Generate reducer, actions creators and selectors to easily handle entity crud operation

## What is in?

 - Automatically create action creators reducer and selectors to manage a type of entity
 - Contains method to get one or a list of entities 
 - Easily customizable
 - Easy to add or remove from a project
 - Highly tested and full flow coverage

## Getting Started

### Installation

```
yarn add redux-crud-model
```
or
```
npm install --save redux-crud-model
```

### Basic Usage

See below an example for ducks redux store to manage a list of user :
```js
// @flow
// src/module/User.js
import createModelModule from 'redux-crud-model';
import type { Module, State as AbstractState, Action as AbstractAction } from 'redux-crud-model';

type User = {
  id: number,
  email: string,
  name: string,
  birthdate: number,
};

const { actionTypes, reducer, actionCreators, selectors }: Module<User> = createModelModule({
  name: 'user',
  storeSelector: (state: any): State<User> => state.user,
});

export type Action = AbstractAction<User>;
export type State = AbstractState<User>;

export { actionTypes };
export const {
  fetchList,
  fetchListSuccess,
  fetchListFailure,
  fetchOne,
  fetchOneSuccess,
  fetchOneFailure,
} = actionCreators;

export const { entitySelector, entityListSelector, entitiesSelector } = selectors;

export default reducer;
```

The `createModelModule` method created for you all the actions, reducer and selectors you need to retrieve new entities from server.

But you still have to do the call yourself. With [redux-saga]() it will look like that : 

```js
function* fetchListSaga(action): Generator<*, *, *> {
  try {
    const response = yield call(api.getUserList);
    yield put(fetchListSuccess(normalize(response, userListSchema)));
  } catch (e) {
    yield put(fetchListFailure(e));
  }
}

export function* saga(): Generator<*, *, *> {
  yield all([
    takeLatest(actionTypes.fetchList, fetchListSaga),
  ]);
}
```

Notice that you have to normalize the api results with [normalizr]() before calling the success action.

Now you can use it in the rest of your app.
```js
// @flow
import { connect } from 'react-redux';
import { fetchList, entitiesSelector } from 'modules/User';

const mapStateToProps = (state: any) => ({
  users: entitiesSelector(state),
});

const mapDispatchToProps: $Shape<Props> = {
  fetchUsers: fetchList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
```

### Extending the module

The generated actions and reducer works save the entities but without knowing the context. Also, you have to know the id of an entity if you want to select it.

If you want to retrieve and select later the current user, you will need to have an another reducer (like `AuthenticationReducer`) or to extend this one to save his id.

For example, you can declare your own actions action creator: 
```js
export const fetchCurrentUser = () => ({ type: 'FETCH_CURRENT_USER' });
export const fetchCurrentUserSuccess = (id) => fetchOneSuccess(id, { currentUser: true });
export const fetchCurrentUserFailure = (id, error) => fetchOneFailure(id, error, { currentUser: true });
```

Notice that the action creator accept a third argument which is used as context.

The reducer returned by the module is a standard reducer. You can extend it easily by calling it in your own :
```js
export default function(state: State, action: Action) {
  const newState = reducer(state, action); // use the reducer from createModelModule
  switch(action.type) {
    case actionType.fetchOneSuccess:
      if(action.meta.currentUser) { // use the context given earlier
        return {
          ...newState,
          currentUserId: action.payload.id
        };
      }
      return newState;
    default:
      return newState;
  }
}
```

Then export your own selector:
```js
export const currentUserSelector = (state) => entitySelector(state, state.user.currentUserId);
```

