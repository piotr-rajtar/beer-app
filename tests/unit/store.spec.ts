import storeCreator from '@/store/index';
import { Store } from 'vuex';
import {
  Beer,
  CachedPage,
  LoadBeerItemPayload,
  PagingOptions,
  SortDirection,
  SortOptions,
  State,
} from '@/types/typings';
import { beerPayload, duplicatedBeerPayload } from './mockedBeerData';
import { isEqual } from 'lodash';
import { getQueryString } from '@/utils';

describe('store', () => {
  let store: Store<State>;

  beforeEach(() => {
    store = storeCreator();
  });

  it('returns correct simplified beer object', async () => {
    await store.dispatch('loadInitialPage', { page: 1 });
    const storedSimplifiedBeerKeys = Object.keys(store.getters.getSimplifiedBeersData[0]);
    const expectedKeys = ['id', 'name', 'first_brewed', 'abv', 'ibu', 'ebc', 'ph'];
    const areKeysArrayEqual: boolean = isEqual(storedSimplifiedBeerKeys, expectedKeys);
    expect(areKeysArrayEqual).toBe(true);
  });

  it('returns correct number of paginated simplified beer objects', async () => {
    await store.dispatch('loadInitialPage', { page: 1 });
    const pagingOptions: PagingOptions = {
      pageNumber: 1,
      itemsPerPage: 1,
    };
    const paginatedSimplifiedBeers = store.getters.getPaginatedSimplifiedBeersData(pagingOptions);
    expect(paginatedSimplifiedBeers.length).toBe(1);
  });

  it('returns correctly sorted data', async () => {
    await store.dispatch('loadInitialPage', { page: 1 });
    const sortOptions: SortOptions = {
      sortDirection: SortDirection.DESC,
      sortBy: 'id',
    };
    const sortedSimplifiedBeers = store.getters.getSortedBeersData(sortOptions);
    expect(sortedSimplifiedBeers[0].id).toBe(16);
  });

  it('returns correctly sorted paginated data with appropriate number of items', async () => {
    await store.dispatch('loadInitialPage', { page: 1 });
    const sortOptions: SortOptions = {
      sortDirection: SortDirection.ASC,
      sortBy: 'abv',
    };
    const pagingOptions: PagingOptions = {
      pageNumber: 1,
      itemsPerPage: 1,
    };
    const sortedSimplifiedBeers = store.getters.getPaginatedSortedBeersData(sortOptions, pagingOptions);
    expect(sortedSimplifiedBeers[0].id).toBe(1);
  });

  it('adds more beers correctly', async () => {
    await store.dispatch('loadInitialPage', { page: 1 });
    store.commit('addMoreBeers', beerPayload);
    expect(store.state.beers.length).toBe(3);
  });

  it('adds more pagined beers correctly with no duplications', async () => {
    await store.dispatch('loadInitialPage', { page: 1 });
    store.commit('addMorePaginedBeers', duplicatedBeerPayload);
    expect(store.state.beers.length).toBe(2);
  });

  it('adds initialPage correctly', () => {
    store.commit('addInitialPage', beerPayload);
    expect(store.state.beers.length).toBe(1);
  });

  it('caches beer page correctly', () => {
    const keyQuery: string = getQueryString({ page: 1 });
    const pageToCache: CachedPage = {
      page: [],
      keyQuery,
    };
    store.commit('cacheBeerPage', pageToCache);
    expect(store.state.cachedBeers).toHaveProperty(keyQuery);
  });

  it('sets data fetching completion status correctly', () => {
    store.commit('setDataFetchingCompletion');
    expect(store.state.areAllDataFetched).toBe(true);
  });

  it('sets initial status of data fetching completion correctly', () => {
    store.commit('setInitialDataFetchingState');
    expect(store.state.areAllDataFetched).toBe(false);
  });

  it('sets correct loading status', () => {
    store.commit('setLoadingStatus', true);
    expect(store.state.loadingStatus).toBe(true);
  });

  it('returns true while checking if next page is available if once with given query params is cached', async () => {
    await store.dispatch('loadInitialPage', { page: 1 });
    await store.dispatch('loadMoreBeers', { page: 2 });
    const isNextPageAvailable: boolean = await store.dispatch('checkIfNextPageAvailable', { page: 2 });
    expect(isNextPageAvailable).toBe(true);
  });

  it('return false while checking if next page is available if page not cached and all data fetched', async () => {
    await store.dispatch('loadInitialPage', { page: 1 });
    await store.dispatch('loadMoreBeers', { page: 2 });
    await store.dispatch('loadMoreBeers', { page: 3 });
    const isNextPageAvailable: boolean = await store.dispatch('checkIfNextPageAvailable', { page: 3 });
    expect(isNextPageAvailable).toBe(false);
  });

  it('returns true if next page is available', async () => {
    await store.dispatch('loadInitialPage', { page: 1 });
    const isNextPageAvailable: boolean = await store.dispatch('checkIfNextPageAvailable', { page: 2 });
    expect(isNextPageAvailable).toBe(true);
  });

  it('caches beer data correctly with given query params if next page is available', async () => {
    await store.dispatch('loadInitialPage', { page: 1 });
    await store.dispatch('checkIfNextPageAvailable', { page: 2 });
    const keyQuery: string = getQueryString({ page: 2 });
    expect(store.state.cachedBeers).toHaveProperty(keyQuery);
  });

  it('caches beer data correctly with given query params if next page is not available', async () => {
    await store.dispatch('loadInitialPage', { page: 1 });
    await store.dispatch('loadMoreBeers', { page: 2 });
    await store.dispatch('checkIfNextPageAvailable', { page: 3 });
    const keyQuery: string = getQueryString({ page: 3 });
    expect(store.state.cachedBeers[keyQuery]).toBe(undefined);
  });

  it('fetches data from api', async () => {
    const fetchedBeerData: Beer[] = await store.dispatch('fetchBeerData', { page: 1 });
    expect(fetchedBeerData.length).toBe(2);
  });

  it('returns empty array if no data to fetched with given params', async () => {
    const fetchedBeerData: Beer[] = await store.dispatch('fetchBeerData', { page: 3 });
    expect(fetchedBeerData.length).toBe(0);
  });

  it('sets data fetching completion when no data to fetch', async () => {
    await store.dispatch('fetchBeerData', { page: 3 });
    expect(store.state.areAllDataFetched).toBe(true);
  });

  it('sets data fetching completion when no data to fetch', async () => {
    await store.dispatch('fetchBeerData', { page: 3 });
    expect(store.state.areAllDataFetched).toBe(true);
  });

  it('adds beer data correctly after "loadBeerItems" action dispatch', async () => {
    const actionPayload: LoadBeerItemPayload = {
      queryParams: { page: 1 },
      addBeersMutation: 'addInitialPage',
    };
    await store.dispatch('loadBeerItems', actionPayload);
    expect(store.state.beers.length).toBe(2);
  });

  it('caches beer data correctly after "loadBeerItems" action dispatch', async () => {
    const actionPayload: LoadBeerItemPayload = {
      queryParams: { page: 1 },
      addBeersMutation: 'addInitialPage',
    };
    const keyQuery: string = getQueryString({ page: 1 });
    await store.dispatch('loadBeerItems', actionPayload);
    expect(store.state.cachedBeers).toHaveProperty(keyQuery);
  });

  it('caches beer data correctly after "loadMoreBeers" action dispatch', async () => {
    await store.dispatch('loadMoreBeers', { page: 1 });
    const keyQuery: string = getQueryString({ page: 1 });
    expect(store.state.cachedBeers).toHaveProperty(keyQuery);
  });

  it('updates beer prop state after "loadMoreBeers" action dispatch', async () => {
    await store.dispatch('loadMoreBeers', { page: 1 });
    expect(store.state.beers.length).toBe(2);
  });

  it('caches beer data correctly after "loadMorePaginedBeers" action dispatch', async () => {
    await store.dispatch('loadMorePaginedBeers', { page: 1 });
    const keyQuery: string = getQueryString({ page: 1 });
    expect(store.state.cachedBeers).toHaveProperty(keyQuery);
  });

  it('updates beer prop state after "loadMorePaginedBeers" action dispatch', async () => {
    await store.dispatch('loadMorePaginedBeers', { page: 1 });
    expect(store.state.beers.length).toBe(2);
  });

  it('caches beer data correctly after "loadInitialPage" action dispatch', async () => {
    await store.dispatch('loadInitialPage', { page: 1 });
    const keyQuery: string = getQueryString({ page: 1 });
    expect(store.state.cachedBeers).toHaveProperty(keyQuery);
  });

  it('updates beer prop state after "loadInitialPage" action dispatch', async () => {
    await store.dispatch('loadInitialPage', { page: 1 });
    expect(store.state.beers.length).toBe(2);
  });
});
