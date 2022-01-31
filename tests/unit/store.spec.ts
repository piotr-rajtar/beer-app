import store from '@/store/index';
import { beers, beerPayload } from './mockedBeerData';

describe('store', () => {
  beforeEach(() => {
    store.commit('addBeers', []);
    if (store.state.loadingStatus) {
      store.commit('changeLoadingStatus');
    }
  });
  it('add and return beers correctly', () => {
    store.commit('addBeers', beerPayload);
    const beerData = store.getters.getSimplifiedBeersData;
    expect(beerData).toEqual(beers);
  });
  it('changes loading state correctly', () => {
    store.commit('changeLoadingStatus');
    const loadingStatus = store.state.loadingStatus;
    expect(loadingStatus).toBe(true);
  });
  it('changes loading state correctly', async () => {
    await store.dispatch('fetchBeers');
    const beersTable = store.state.beers;
    const beersTableLength = beersTable.length;
    expect(beersTable).toEqual(beerPayload);
    expect(beersTableLength).toBe(1);
  });
});
