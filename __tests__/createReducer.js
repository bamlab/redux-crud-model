import createReducer from '../src/createReducer';

describe('createReducer', () => {
  const initialState = { foo: 'bar' };

  const reducers = {
    actionFoo: state => ({ ...state, foo: 'foo' }),
    actionSet: (state, action) => ({ ...state, foo: action.value }),
  };

  it('should fail if no initialState', () => {
    expect(createReducer).toThrow();
  });

  it('should fail if no handlers', () => {
    expect(() => createReducer(initialState)).toThrow();
  });

  it('should fail if one reducer have undefined keys', () => {
    expect(() =>
      createReducer(initialState, {
        undefined: () => {},
      })
    ).toThrow();
  });

  it('should initialize with initial state', () => {
    const reducer = createReducer(initialState, reducers);
    const state = reducer(undefined, { type: '@INIT' });
    expect(state).toBe(initialState);
  });

  it('should ignore unknow actions', () => {
    const reducer = createReducer(initialState, reducers);
    const state = reducer(initialState, { type: 'UNKNOW' });
    expect(state).toBe(initialState);
  });
  it('should use default handler for unknow action if specified', () => {
    const reducer = createReducer(initialState, reducers, (state, action) => ({
      ...state,
      actionType: action.type,
    }));
    const state = reducer(initialState, { type: 'UNKNOW' });
    expect(state).toEqual({
      foo: 'bar',
      actionType: 'UNKNOW',
    });
  });

  it('should use the expected reducer', () => {
    const reducer = createReducer(initialState, reducers);
    let state = reducer(initialState, { type: 'actionFoo' });
    expect(state).toEqual({
      foo: 'foo',
    });

    state = reducer(initialState, { type: 'actionSet', value: 'Doe' });
    expect(state).toEqual({
      foo: 'Doe',
    });
  });
});
