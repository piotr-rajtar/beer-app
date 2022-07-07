import { createStore, Store } from 'vuex';
import { Beer, BeerSimplified, State, BeerSimplifiedI, SortFunction, QueryParams, CachedPage } from '@/types/typings';
import { apiAddress, tableHeaders } from './const';
import axios from 'axios';
import { compare, getUrlAddress, getErrorMessage, getQueryString } from '@/utils';
import { isArray } from 'lodash';

const state: State = {
  areAllDataFetched: false,
  beers: [],
  cachedBeers: {},
  loadingStatus: false,
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
        return (sortDirection, sortBy) => getters.getSimplifiedBeersData.sort(compare(sortDirection, sortBy));
      },
    },
    mutations: {
      addSinglePage(state, payload: Beer[]): void {
        state.beers = [...payload];
      },
      addMoreBeers(state, payload: Beer[]): void {
        state.beers = [...state.beers, ...payload];
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
          const cachedPage: CachedPage = {
            page: result,
            keyQuery,
          };
          context.commit('cacheBeerPage', cachedPage);
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
      async loadMoreBeers(context, queryParams: QueryParams): Promise<void> {
        const keyQuery: string = getQueryString(queryParams);
        const cachedPage: Beer[] = state.cachedBeers[keyQuery];
        context.commit('setLoadingStatus', true);
        if (cachedPage) {
          context.commit('addMoreBeers', cachedPage);
          context.commit('setLoadingStatus', false);
          return;
        }
        if (state.areAllDataFetched) {
          context.commit('setLoadingStatus', false);
          return;
        }
        const result: Beer[] | Error = await this.dispatch('fetchBeerData', queryParams);
        if (isArray(result) && result.length) {
          const cachedPage: CachedPage = {
            page: result,
            keyQuery,
          };
          context.commit('cacheBeerPage', cachedPage);
          context.commit('addMoreBeers', result);
        }
        context.commit('setLoadingStatus', false);
      },
      async loadSinglePage(context, queryParams: QueryParams): Promise<void> {
        const keyQuery: string = getQueryString(queryParams);
        const cachedPage: Beer[] | undefined = state.cachedBeers[keyQuery];
        context.commit('setLoadingStatus', true);
        if (cachedPage) {
          context.commit('addSinglePage', cachedPage);
          context.commit('setLoadingStatus', false);
          return;
        }
        if (state.areAllDataFetched) {
          context.commit('setLoadingStatus', false);
          return;
        }
        const result: Beer[] | Error = await this.dispatch('fetchBeerData', queryParams);
        if (isArray(result) && result.length) {
          const cachedPage: CachedPage = {
            page: result,
            keyQuery,
          };
          context.commit('cacheBeerPage', cachedPage);
          context.commit('addSinglePage', result);
        }
        context.commit('setLoadingStatus', false);
      },
    },
  });
}
