import { createStore } from 'vuex';
import { Beer, BeerSimplified, State, BeerSimplifiedI } from '@/types/typings';
import { API_ADDRESS, tableHeaders } from './const';
import axios from 'axios';

const state: State = {
  beers: [],
};

export default createStore({
  state,
  getters: {
    getAllBeersData(state): Beer[] {
      return state.beers;
    },
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
    addBeers(state, payload: Beer[]) {
      state.beers = [...payload];
    },
  },
  actions: {
    fetchBeers(context) {
      axios
        .get(API_ADDRESS)
        .then((res) => context.commit('addBeers', res.data))
        .catch((e) => {
          throw new Error(e);
        });
    },
  },
});
