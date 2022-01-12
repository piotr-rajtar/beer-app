import { createStore } from 'vuex';
import { Beer, BeerSimplified, State } from '@/types/typings';
import { API_ADDRESS } from './const';
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
        return {
          id: beer.id,
          name: beer.name || '-',
          first_brewed: beer.first_brewed || '-',
          abv: beer.abv || '-',
          ibu: beer.ibu || '-',
          ebc: beer.ebc || '-',
          ph: beer.ph || '-',
        };
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
