import { createStore } from 'vuex';
import { Beer, State } from './store-typings';
import { API_ADDRESS } from './const';
import axios from 'axios';

const state: State = {
  beers: [],
};

export default createStore({
  state,
  getters: {
    getBeers(state): Beer[] {
      return state.beers;
    },
  },
  mutations: {
    addBeers(state, payload: Beer[]) {
      state.beers = payload;
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
