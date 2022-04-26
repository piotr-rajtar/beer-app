import { createStore, Store } from 'vuex';
import { Beer, BeerSimplified, State, BeerSimplifiedI, SortFunction, QueryParams } from '@/types/typings';
import { API_ADDRESS, tableHeaders } from './const';
import axios from 'axios';
import { compareFunction, getUrlAddress, getErrorMessage, getQueryString } from '@/utils';

const state: State = {
  beers: [],
  loadingStatus: false,
  cachedBeers: {},
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
      changeLoadingStatus(state): void {
        state.loadingStatus = !state.loadingStatus;
      },
    },
    actions: {
      async loadSinglePage(context, queryParams: QueryParams): Promise<void> {
        const url: string = getUrlAddress(API_ADDRESS, queryParams);
        const keyQuery: string = getQueryString(queryParams);
        context.commit('changeLoadingStatus');
        if (state.cachedBeers[keyQuery]) {
          context.commit('addSinglePage', state.cachedBeers[keyQuery]);
          context.commit('changeLoadingStatus');
          return;
        }
        try {
          const res = await axios.get(url);
          state.cachedBeers[keyQuery] = res.data;
          context.commit('addSinglePage', res.data);
        } catch (e) {
          throw getErrorMessage(e);
        }
        context.commit('changeLoadingStatus');
      },
      async loadMoreBeers(context, queryParams: QueryParams): Promise<void> {
        const url: string = getUrlAddress(API_ADDRESS, queryParams);
        const keyQuery: string = getQueryString(queryParams);
        context.commit('changeLoadingStatus');
        if (state.cachedBeers[keyQuery]) {
          context.commit('addMoreBeers', state.cachedBeers[keyQuery]);
          context.commit('changeLoadingStatus');
          return;
        }
        try {
          const res = await axios.get(url);
          state.cachedBeers[keyQuery] = res.data;
          context.commit('addMoreBeers', res.data);
        } catch (e) {
          throw getErrorMessage(e);
        }
        context.commit('changeLoadingStatus');
      },
      async checkIfNextPageAvailable(_context, queryParams: QueryParams): Promise<boolean> {
        const url: string = getUrlAddress(API_ADDRESS, queryParams);
        const keyQuery: string = getQueryString(queryParams);
        let isPageAvailable: boolean = false;
        if (state.cachedBeers[keyQuery] && state.cachedBeers[keyQuery].length) {
          return true;
        }
        try {
          const res = await axios.get(url);
          isPageAvailable = res.data.length > 0;
          state.cachedBeers[keyQuery] = res.data;
        } catch (e) {
          throw getErrorMessage(e);
        }
        return isPageAvailable;
      },
    },
  });
}
