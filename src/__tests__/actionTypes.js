import createActionTypes from '../actionTypes';
describe('actionType', () => {
  it('should return the list of actionTypes using the name', () => {
    const actionTypes = createActionTypes({ name: 'foobar' });
    expect(actionTypes).toEqual({
      fetchOne: `MODEL_FOOBAR.FETCH_ONE`,
      fetchOneSuccess: `MODEL_FOOBAR.FETCH_ONE_SUCCESS`,
      fetchOneFailure: `MODEL_FOOBAR.FETCH_ONE_FAILURE`,
      fetchList: `MODEL_FOOBAR.FETCH_LIST`,
      fetchListSuccess: `MODEL_FOOBAR.FETCH_LIST_SUCCESS`,
      fetchListFailure: `MODEL_FOOBAR.FETCH_LIST_FAILURE`,
    });
  });
});
