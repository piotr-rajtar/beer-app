import { createStore, Store } from 'vuex';
import {
  Beer,
  BeerSimplified,
  State,
  BeerSimplifiedI,
  SortFunction,
  QueryParams,
} from '@/types/typings';
import { API_ADDRESS, tableHeaders } from './const';
import axios from 'axios';
import { compareFunction, getUrlAddress, getErrorMessage } from '@/utils';

const state: State = {
  beers: [],
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
        return (sortDirection, sortBy) =>
          getters.getSimplifiedBeersData.sort(
            compareFunction(sortDirection, sortBy)
          );
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
        context.commit('changeLoadingStatus');
        try {
          const res = await axios.get(url);
          context.commit('addSinglePage', res.data);
          context.commit('changeLoadingStatus');
        } catch (e) {
          throw getErrorMessage(e);
        }
      },
      async loadMoreBeers(context, queryParams: QueryParams): Promise<void> {
        const url: string = getUrlAddress(API_ADDRESS, queryParams);
        context.commit('changeLoadingStatus');
        try {
          const res = await axios.get(url);
          context.commit('addMoreBeers', res.data);
          context.commit('changeLoadingStatus');
        } catch (e) {
          throw getErrorMessage(e);
        }
      },
      async checkIfNextPageAvailable(
        _context,
        queryParams: QueryParams
      ): Promise<boolean> {
        const url: string = getUrlAddress(API_ADDRESS, queryParams);
        try {
          const res = await axios.get(url);
          return res.data.length > 0;
        } catch {
          return false;
        }
      },
    },
  });
}
