import { normalize, schema } from 'normalizr';
import createModelModule from '../';

describe('ModelCreator', () => {
  describe('fetchOne', () => {
    it('should have action creators to fetch an entity', () => {
      const id = 1;

      const { reducer, selectors, actionCreators } = createModelModule({
        name: 'myEntity',
      });
      let state = reducer(undefined, { type: '##INIT' });

      state = reducer(state, actionCreators.fetchOne(id));
      expect(selectors.entitySelector(state, id)).toBeUndefined();
      expect(selectors.statusSelector(state, id)).toBe('fetching');

      const entity = { id, name: 'John Doe' };
      const normalizedEntity = normalize(entity, new schema.Entity('myEntity', {}));

      const action = actionCreators.fetchOneSuccess(normalizedEntity);

      state = reducer(state, action);
      expect(selectors.entitySelector(state, id)).toEqual(entity);
      expect(selectors.statusSelector(state, id)).toBe('fetched');
    });

    it('should mark entity as error on fetch fail', () => {
      const id = 1;

      const { reducer, selectors, actionCreators } = createModelModule({
        name: 'myEntity',
      });
      let state = reducer(undefined, { type: '@@INIT' });
      state = reducer(state, actionCreators.fetchOne(id));

      const action = actionCreators.fetchOneFailed(id, { status: 404 });
      state = reducer(state, action);

      expect(selectors.entitySelector(state, id)).toBeUndefined();
      expect(selectors.statusSelector(state, id)).toBe('error');
    });
  });

  describe('fetchList', () => {
    it('should have action creators to fetch a list of entities', () => {
      const ids = [1, 'foo'];

      const { reducer, selectors, actionCreators } = createModelModule({
        name: 'myEntity',
      });
      let state = reducer(undefined, { type: '##INIT' });

      state = reducer(state, actionCreators.fetchList());
      expect(selectors.entityListSelector(state, ids)).toEqual([]);
      expect(selectors.entitiesSelector(state)).toEqual([]);

      const entities = [{ id: ids[0], name: 'John Doe' }, { id: ids[1], name: 'Foo bar' }];
      const listSchema = new schema.Values(new schema.Entity('myEntity', {}));
      const normalizedEntity = normalize(entities, listSchema);

      const action = actionCreators.fetchListSuccess(normalizedEntity);

      state = reducer(state, action);
      expect(selectors.entityListSelector(state, ids)).toEqual(entities);
      expect(selectors.entitiesSelector(state)).toEqual(entities);
      expect(selectors.entityListSelector(state, [ids[0]])).toEqual([entities[0]]);
    });
  });

  describe('reducer', () => {
    it('should handle actions with meta entities key', () => {
      const { reducer, selectors } = createModelModule({
        name: 'myEntity',
      });
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
      expect(selectors.entitySelector(state, 'the-id')).toEqual({
        id: 'the-id',
        foo: 'bar',
      });
      expect(selectors.statusSelector(state, 'the-id')).toBe('fetched');
    });
  });

  describe('selectors', () => {
    it('should handle unknown entity', () => {
      const { reducer, selectors } = createModelModule({
        name: 'myEntity',
      });
      const state = reducer(undefined, { type: '##INIT' });
      expect(selectors.entitySelector(state, 'the-id')).toBeUndefined();
      expect(selectors.statusSelector(state, 'the-id')).toBe('unknown');
    });

    it('should handle hashmap as ids', () => {
      const ids = [2, 8];
      const { selectors } = createModelModule({
        name: 'myEntity',
      });
      const entities = [{ id: ids[0], name: 'John' }, { id: ids[1], name: 'Foo' }];
      const state = {
        entities: {
          [ids[0]]: entities[0],
          [ids[1]]: entities[1],
        },
      };

      expect(selectors.entityListSelector(state, { id1: ids[0], foo: ids[1] })).toEqual(entities);
    });

    it('should accept selector to get the store', () => {
      const ids = [2, 8];
      const { selectors } = createModelModule({
        name: 'myEntity',
        storeSelector: state => state.storeName,
      });
      const entities = [{ id: ids[0], name: 'John' }, { id: ids[1], name: 'Foo' }];
      const state = {
        storeName: {
          entities: {
            [ids[0]]: entities[0],
            [ids[1]]: entities[1],
          },
          status: {
            [ids[0]]: 'fetched',
          },
        },
      };

      expect(selectors.entityListSelector(state, ids)).toEqual(entities);
      expect(selectors.entitiesSelector(state)).toEqual(entities);
      expect(selectors.statusSelector(state, ids[0])).toEqual('fetched');

      expect(selectors.entityListSelector(state)(ids)).toEqual(entities);
      expect(selectors.statusSelector(state)(ids[0])).toEqual('fetched');
    });
  });
});
