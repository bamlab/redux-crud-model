import createModuleSelectors from '../selectors';

describe('selectors', () => {
  const ids = [2, 8];
  const entities = [{ id: ids[0], name: 'John' }, { id: ids[1], name: 'Foo' }];
  const state = {
    entities: {
      [ids[0]]: entities[0],
      [ids[1]]: entities[1],
    },
    status: {
      [ids[0]]: 'fetched',
    },
  };

  describe('entitySelector', () => {
    it('should get the first entity', () => {
      const selectors = createModuleSelectors({ name: 'myEntity' });
      expect(selectors.entitySelector(state, ids[0])).toEqual(entities[0]);
    });

    it('should be curried', () => {
      const selectors = createModuleSelectors({ name: 'myEntity' });
      expect(selectors.entitySelector(state)(ids[0])).toEqual(entities[0]);
    });

    it('should handle unknown entity', () => {
      const selectors = createModuleSelectors({ name: 'myEntity' });
      expect(selectors.entitySelector(state, 'the-id')).toBeUndefined();
    });

    it('should accept selector to get the store', () => {
      const selectors = createModuleSelectors({
        name: 'myEntity',
        storeSelector: state => state.storeName,
      });
      const globalState = { storeName: state };
      expect(selectors.entitySelector(globalState, ids[0])).toEqual(entities[0]);
    });
  });

  describe('entityListSelector', () => {
    it('should get the first entity', () => {
      const selectors = createModuleSelectors({ name: 'myEntity' });
      expect(selectors.entityListSelector(state, [ids[0]])).toEqual([entities[0]]);
    });

    it('should be curried', () => {
      const selectors = createModuleSelectors({ name: 'myEntity' });
      expect(selectors.entityListSelector(state)([ids[0]])).toEqual([entities[0]]);
    });

    it('should handle unknown entity', () => {
      const selectors = createModuleSelectors({ name: 'myEntity' });
      expect(selectors.entityListSelector(state, [ids[1], 'the-id'])).toEqual([entities[1]]);
    });

    it('should handle hashmap as ids', () => {
      const selectors = createModuleSelectors({ name: 'myEntity' });
      expect(selectors.entityListSelector(state, { id1: ids[0], foo: ids[1] })).toEqual(entities);
    });

    it('should accept selector to get the store', () => {
      const selectors = createModuleSelectors({
        name: 'myEntity',
        storeSelector: state => state.storeName,
      });
      const globalState = { storeName: state };
      expect(selectors.entityListSelector(globalState, ids)).toEqual(entities);
    });
  });

  describe('entitiesSelector', () => {
    it('should get all teh entities', () => {
      const selectors = createModuleSelectors({ name: 'myEntity' });
      expect(selectors.entitiesSelector(state)).toEqual(entities);
    });

    it('should accept selector to get the store', () => {
      const selectors = createModuleSelectors({
        name: 'myEntity',
        storeSelector: state => state.storeName,
      });
      const globalState = { storeName: state };
      expect(selectors.entitiesSelector(globalState)).toEqual(entities);
    });
  });

  describe('statusSelector', () => {
    it('should get the first status', () => {
      const selectors = createModuleSelectors({ name: 'myEntity' });
      expect(selectors.statusSelector(state, ids[0])).toBe('fetched');
    });

    it('should be curried', () => {
      const selectors = createModuleSelectors({ name: 'myEntity' });
      expect(selectors.statusSelector(state)(ids[0])).toBe('fetched');
    });

    it('should handle unknown entity', () => {
      const selectors = createModuleSelectors({ name: 'myEntity' });
      expect(selectors.statusSelector(state, 'the-id')).toBe('unknown');
    });

    it('should accept selector to get the store', () => {
      const selectors = createModuleSelectors({
        name: 'myEntity',
        storeSelector: state => state.storeName,
      });
      const globalState = { storeName: state };
      expect(selectors.statusSelector(globalState, ids[0])).toBe('fetched');
    });
  });
});
