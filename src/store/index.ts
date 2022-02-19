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
import { compareFunction, getQueryString } from '@/utils';

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
      addBeersInitially(state, payload: Beer[]): void {
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
      fetchBeersInitially(context): void {
        context.commit('changeLoadingStatus');
        axios
          .get(API_ADDRESS)
          .then((res) => {
            context.commit('addBeersInitially', res.data);
            context.commit('changeLoadingStatus');
          })
          .catch((e) => {
            throw new Error(e);
          });
      },
      loadMoreBeers(context, queryParams: QueryParams): void {
        const queryString: string = getQueryString(queryParams);
        const url: string = API_ADDRESS + queryString;
        context.commit('changeLoadingStatus');
        axios
          .get(url)
          .then((res) => {
            context.commit('addMoreBeers', res.data);
            context.commit('changeLoadingStatus');
          })
          .catch((e) => {
            throw new Error(e);
          });
      },
    },
  });
}
