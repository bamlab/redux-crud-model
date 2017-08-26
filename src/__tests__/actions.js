import { normalize, schema } from 'normalizr';
import createModuleActionCreators from '../actions';

describe('actions', () => {
  const context = { contextKey: 'contextValue' };
  let actionsCreators;
  beforeEach(() => {
    actionsCreators = createModuleActionCreators({ name: 'myEntity' });
  });

  it('should get the fetchOne action', () => {
    expect(actionsCreators.fetchOne('an-id', context)).toMatchSnapshot();
  });

  it('should get the fetchOneSuccess action', () => {
    const entity = { id: 'an-id', name: 'John Doe' };
    const normalizedEntity = normalize(entity, new schema.Entity('myEntity', {}));
    expect(actionsCreators.fetchOneSuccess(normalizedEntity, context)).toMatchSnapshot();
  });

  it('should get the fetchOneFailure action', () => {
    expect(actionsCreators.fetchOneFailure('an-id', new Error(), context)).toMatchSnapshot();
  });

  it('should get the fetchList action', () => {
    expect(actionsCreators.fetchList('listName', context)).toMatchSnapshot();
  });

  it('should get the fetchListSuccess action', () => {
    const entities = [{ id: 'an-id', name: 'John Doe' }, { id: 'an other id', name: 'Mr Smith' }];
    const mSchema = new schema.Values(new schema.Entity('myEntity', {}));
    const normalizedEntity = normalize(entities, mSchema);
    expect(
      actionsCreators.fetchListSuccess(normalizedEntity, 'listName', context)
    ).toMatchSnapshot();
  });

  it('should get the fetchListFailure action', () => {
    expect(actionsCreators.fetchListFailure(new Error(), 'listName', context)).toMatchSnapshot();
  });
});
