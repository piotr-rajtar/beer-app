import { createStore, Store } from 'vuex';
import {
  Beer,
  BeerSimplified,
  State,
  BeerSimplifiedI,
  SortFunction,
  QueryParams,
  CachePageParam,
  FetchBeerDataParam,
} from '@/types/typings';
import { API_ADDRESS, tableHeaders } from './const';
import axios from 'axios';
import { compareFunction, getUrlAddress, getErrorMessage, getQueryString } from '@/utils';

const state: State = {
  beers: [],
  loadingStatus: false,
  cachedBeers: {},
  areAllDataFetched: false,
};

export default function storeCreator(): Store<State> {
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
      getSortedBeersData(_state, getters): SortFunction {
        return (sortDirection, sortBy) => getters.getSimplifiedBeersData.sort(compareFunction(sortDirection, sortBy));
      },
    },
    mutations: {
      addSinglePage(state, payload: Beer[]): void {
        state.beers = [...payload];
      },
      addMoreBeers(state, payload: Beer[]): void {
        state.beers = [...state.beers, ...payload];
      },
      setLoadingStatus(state, newStatus: boolean): void {
        state.loadingStatus = newStatus;
      },
      setDataFetchingCompletion(state): void {
        state.areAllDataFetched = true;
      },
      setInitialDataFetchingState(state): void {
        state.areAllDataFetched = false;
      },
    },
    actions: {
      addCachedPage(context, params: CachePageParam): void {
        const { mutation, cachedPage } = params;
        context.commit(mutation, cachedPage);
      },
      async fetchBeerData(context, params: FetchBeerDataParam) {
        const { mutation, queryParams, keyQuery } = params;
        const url: string = getUrlAddress(API_ADDRESS, queryParams);
        try {
          const res = await axios.get(url);
          if (res.data.length) {
            state.cachedBeers[keyQuery] = res.data;
            context.commit(mutation, res.data);
          } else {
            context.commit('setDataFetchingCompletion');
          }
        } catch (e) {
          throw getErrorMessage(e);
        }
      },
      async loadSinglePage(context, queryParams: QueryParams): Promise<void> {
        const keyQuery: string = getQueryString(queryParams);
        const cachedPage: Beer[] = state.cachedBeers[keyQuery];
        context.commit('setLoadingStatus', true);
        if (cachedPage) {
          const cachedPageParam: CachePageParam = {
            mutation: 'addSinglePage',
            cachedPage,
          };
          this.dispatch('addCachedPage', cachedPageParam);
          context.commit('setLoadingStatus', false);
          return;
        }
        if (state.areAllDataFetched) {
          context.commit('setLoadingStatus', false);
          return;
        }
        const fetchBeerDataParam: FetchBeerDataParam = {
          mutation: 'addSinglePage',
          queryParams,
          keyQuery,
        };
        await this.dispatch('fetchBeerData', fetchBeerDataParam);
        context.commit('setLoadingStatus', false);
      },
      async loadMoreBeers(context, queryParams: QueryParams): Promise<void> {
        const keyQuery: string = getQueryString(queryParams);
        const cachedPage: Beer[] = state.cachedBeers[keyQuery];
        context.commit('setLoadingStatus', true);
        if (cachedPage) {
          const cachedPageParam: CachePageParam = {
            mutation: 'addMoreBeers',
            cachedPage,
          };
          this.dispatch('addCachedPage', cachedPageParam);
          context.commit('setLoadingStatus', false);
          return;
        }
        if (state.areAllDataFetched) {
          context.commit('setLoadingStatus', false);
          return;
        }
        const fetchBeerDataParam: FetchBeerDataParam = {
          mutation: 'addMoreBeers',
          queryParams,
          keyQuery,
        };
        await this.dispatch('fetchBeerData', fetchBeerDataParam);
        context.commit('setLoadingStatus', false);
      },
      async checkIfNextPageAvailable(context, queryParams: QueryParams): Promise<boolean> {
        const url: string = getUrlAddress(API_ADDRESS, queryParams);
        const keyQuery: string = getQueryString(queryParams);
        const cachedPage: Beer[] = state.cachedBeers[keyQuery];
        let isPageAvailable: boolean = false;
        if (cachedPage) {
          return true;
        }
        if (state.areAllDataFetched) {
          return false;
        }
        try {
          const res = await axios.get(url);
          if (res.data.length) {
            isPageAvailable = true;
            state.cachedBeers[keyQuery] = res.data;
          } else {
            context.commit('setDataFetchingCompletion');
          }
        } catch (e) {
          throw getErrorMessage(e);
        }
        return isPageAvailable;
      },
    },
  });
}
