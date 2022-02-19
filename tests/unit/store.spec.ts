import storeCreator from '@/store/index';
import { Store } from 'vuex';
import { State } from '@/types/typings';
import { simplifiedBeers } from './mockedBeerData';

describe('store', () => {
  let testStore: Store<State>;

  beforeEach(() => {
    testStore = storeCreator();
  });
  it('fetch data correctly', async () => {
    await testStore.dispatch('fetchBeersInitially');
    const beersTableLength = testStore.state.beers.length;
    expect(beersTableLength).toEqual(2);
  });
  it('return simplified beers correctly', async () => {
    await testStore.dispatch('fetchBeersInitially');
    const simplifiedBeersData = testStore.getters.getSimplifiedBeersData;
    expect(simplifiedBeersData).toEqual(simplifiedBeers);
  });
  it('sort data correctly', async () => {
    await testStore.dispatch('fetchBeersInitially');
    const sortedBeersData = testStore.getters.getSortedBeersData('asc', 'ibu');
    const sortedBeerId = sortedBeersData[0].id;
    expect(sortedBeerId).toBe(16);
  });
  it('fetch more data correctly', async () => {
    await testStore.dispatch('fetchBeersInitially');
    await testStore.dispatch('loadMoreBeers', { page: 2 });
    const beersTableLength = testStore.state.beers.length;
    expect(beersTableLength).toEqual(3);
  });
});
