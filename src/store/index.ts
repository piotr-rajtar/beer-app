import { createStore, Store } from 'vuex';
import {
  Beer,
  BeerSimplified,
  BeerSimplifiedI,
  CachedPage,
  LoadBeerItemPayload,
  PagingOptions,
  QueryParams,
  SortFunction,
  SortOptions,
  State,
} from '@/types/typings';
import { apiAddress, tableHeaders } from './const';
import axios from 'axios';
import { compare, getErrorMessage, getQueryString, getStartAndEndIndexOfPageItems, getUrlAddress } from '@/utils';
import { isArray, cloneDeep } from 'lodash';

export default function storeCreator(): Store<State> {
  const state: State = {
    areAllDataFetched: false,
    beers: [],
    cachedBeers: {},
    loadingStatus: false,
  };

  return createStore({
    state,
    getters: {
      getSimplifiedBeersData(state): BeerSimplified[] {
        return state.beers.map((beer) => {
          const simplifiedBeer: BeerSimplifiedI = {} as BeerSimplifiedI;
          tableHeaders.forEach((item) => (simplifiedBeer[item] = beer[item]));
          return simplifiedBeer as BeerSimplified;
        });
      },

      getPaginatedSimplifiedBeersData(_state, getters): (pagingOptions: PagingOptions) => BeerSimplified[] {
        return (pagingOptions) => {
          const pageIndexes = getStartAndEndIndexOfPageItems(pagingOptions.pageNumber, pagingOptions.itemsPerPage);
          return getters.getSimplifiedBeersData.slice(pageIndexes.startIndex, pageIndexes.endIndex);
        };
      },

      getSortedBeersData(_state, getters): SortFunction {
        return (sortOptions) => cloneDeep(getters.getSimplifiedBeersData).sort(compare(sortOptions));
      },

      getPaginatedSortedBeersData(
        _state,
        getters
      ): (sortOptions: SortOptions, pagingOptions: PagingOptions) => BeerSimplified[] {
        return (sortOptions, pagingOptions: PagingOptions) => {
          const pageIndexes = getStartAndEndIndexOfPageItems(pagingOptions.pageNumber, pagingOptions.itemsPerPage);
          return cloneDeep(getters.getSimplifiedBeersData)
            .sort(compare(sortOptions))
            .slice(pageIndexes.startIndex, pageIndexes.endIndex);
        };
      },
    },
    mutations: {
      addMoreBeers(state, payload: Beer[]): void {
        state.beers = [...state.beers, ...payload];
      },

      addMorePaginedBeers(state, payload: Beer[]): void {
        const updatedBeersData = payload.filter((beer) => !state.beers.some((storedBeer) => storedBeer.id === beer.id));
        state.beers = [...state.beers, ...updatedBeersData];
      },

      addInitialPage(state, payload: Beer[]): void {
        state.beers = [...payload];
      },

      cacheBeerPage(state, payload: CachedPage): void {
        const { keyQuery, page } = payload;
        state.cachedBeers[keyQuery] = page;
      },

      setDataFetchingCompletion(state): void {
        state.areAllDataFetched = true;
      },

      setInitialDataFetchingState(state): void {
        state.areAllDataFetched = false;
      },

      setLoadingStatus(state, newStatus: boolean): void {
        state.loadingStatus = newStatus;
      },
    },
    actions: {
      async checkIfNextPageAvailable(context, queryParams: QueryParams): Promise<boolean> {
        const keyQuery: string = getQueryString(queryParams);
        const isPageCached: boolean = !!state.cachedBeers[keyQuery];
        let isPageAvailable: boolean = false;
        if (isPageCached) {
          return true;
        }
        if (state.areAllDataFetched) {
          return false;
        }
        const result: Beer[] | Error = await this.dispatch('fetchBeerData', queryParams);
        if (isArray(result) && result.length) {
          isPageAvailable = true;
          const pageToCache: CachedPage = {
            page: result,
            keyQuery,
          };
          context.commit('cacheBeerPage', pageToCache);
        }
        return isPageAvailable;
      },

      async fetchBeerData(context, queryParams: QueryParams): Promise<Beer[] | Error> {
        const url: string = getUrlAddress(apiAddress, queryParams);
        try {
          const res = await axios.get(url);
          if (res.data.length) {
            return res.data;
          } else {
            context.commit('setDataFetchingCompletion');
            return [];
          }
        } catch (e) {
          throw getErrorMessage(e);
        }
      },

      async loadBeerItems(context, payload: LoadBeerItemPayload): Promise<void> {
        const keyQuery: string = getQueryString(payload.queryParams);
        const cachedPage: Beer[] | undefined = state.cachedBeers[keyQuery];
        context.commit('setLoadingStatus', true);
        if (cachedPage) {
          context.commit(payload.addBeersMutation, cachedPage);
          context.commit('setLoadingStatus', false);
          return;
        }
        if (state.areAllDataFetched) {
          context.commit('setLoadingStatus', false);
          return;
        }
        const result: Beer[] | Error = await this.dispatch('fetchBeerData', payload.queryParams);
        if (isArray(result) && result.length) {
          const pageToCache: CachedPage = {
            page: result,
            keyQuery,
          };
          context.commit('cacheBeerPage', pageToCache);
          context.commit(payload.addBeersMutation, result);
        }
        context.commit('setLoadingStatus', false);
      },

      async loadMoreBeers(_context, queryParams: QueryParams): Promise<void> {
        const payload: LoadBeerItemPayload = {
          queryParams,
          addBeersMutation: 'addMoreBeers',
        };
        await this.dispatch('loadBeerItems', payload);
      },

      async loadMorePaginedBeers(_context, queryParams: QueryParams): Promise<void> {
        const payload: LoadBeerItemPayload = {
          queryParams,
          addBeersMutation: 'addMorePaginedBeers',
        };
        await this.dispatch('loadBeerItems', payload);
      },

      async loadInitialPage(_context, queryParams: QueryParams): Promise<void> {
        const payload: LoadBeerItemPayload = {
          queryParams,
          addBeersMutation: 'addInitialPage',
        };
        await this.dispatch('loadBeerItems', payload);
      },
    },
  });
}
