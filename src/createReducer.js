import R from 'ramda';

export default (initialState, handlers, defaultHandler = state => state) => {
  // initial state is required
  if (R.isNil(initialState)) {
    throw new Error('initial state is required');
  }

  // handlers must be an object
  if (R.isNil(handlers) || !R.is(Object, handlers)) {
    throw new Error('handlers must be an object');
  }

  // handlers cannot have an undefined key
  if (R.any(R.equals('undefined'))(R.keys(handlers))) {
    throw new Error('handlers cannot have an undefined key');
  }

  // create the reducer function
  return (state = initialState, action) => {
    // wrong actions, just return state
    if (R.isNil(action)) return state;
    if (!R.has('type', action)) return state;

    // look for the handler
    const handler = handlers[action.type];

    // no handler use default one
    if (R.isNil(handler)) return defaultHandler(state, action);

    // execute the handler
    return handler(state, action);
  };
};
