import createReducer from '../reducers';
import createActionTypes from '../actionTypes';

describe('reducers', () => {
  const name = 'myEntity';
  let reducer;
  const actionTypes = createActionTypes({ name });

  beforeEach(() => {
    reducer = createReducer({ name });
  });

  it('should have an initial state', () => {
    const initialState = reducer(undefined, { type: '##INIT' });
    expect(initialState).toEqual({
      entities: {},
      status: {},
    });
  });

  it('should mark entity as fetching', () => {
    const action = { type: actionTypes.fetchOne, payload: { id: 1 } };
    const initialState = reducer(undefined, { type: '##INIT' });
    const state = reducer(initialState, action);
    expect(state).toMatchSnapshot();
  });

  it('should mark entity as failure', () => {
    const action = { type: actionTypes.fetchOneFailure, meta: { id: 1 } };
    const initialState = reducer(undefined, { type: '##INIT' });
    const state = reducer(initialState, action);
    expect(state).toMatchSnapshot();
  });

  it('should handle actions with meta entities key', () => {
    const action = {
      type: 'OtherAction',
      meta: {
        entities: {
          myEntity: {
            'the-id': {
              id: 'the-id',
              foo: 'bar',
            },
          },
        },
      },
    };

    const initialState = reducer(undefined, { type: '##INIT' });
    const state = reducer(initialState, action);
    expect(state).toMatchSnapshot();
  });
});
