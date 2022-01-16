import { createStore } from 'vuex';
import { Beer, BeerSimplified, State, BeerSimplifiedI } from '@/types/typings';
import { API_ADDRESS, tableHeaders } from './const';
import axios from 'axios';

const state: State = {
  beers: [],
  loadingStatus: false,
};

export default createStore({
  state,
  getters: {
    getSimplifiedBeersData(state): BeerSimplified[] {
      return state.beers.map((beer) => {
        const simplifiedBeer: BeerSimplifiedI = {} as BeerSimplifiedI;
        tableHeaders.forEach(
          (item) => (simplifiedBeer[item] = beer[item] || '-')
        );
        return simplifiedBeer as BeerSimplified;
      });
    },
  },
  mutations: {
    addBeers(state, payload: Beer[]): void {
      state.beers = [...payload];
    },
    changeLoadingStatus(state): void {
      state.loadingStatus = !state.loadingStatus;
    },
  },
  actions: {
    fetchBeers(context): void {
      context.commit('changeLoadingStatus');
      axios
        .get(API_ADDRESS)
        .then((res) => {
          context.commit('addBeers', res.data);
          context.commit('changeLoadingStatus');
        })
        .catch((e) => {
          throw new Error(e);
        });
    },
  },
});
