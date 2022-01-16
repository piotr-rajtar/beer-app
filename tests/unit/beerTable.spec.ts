import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import BeerTable from '@/components/BeerTable.vue';
import { beers, TestStore } from './mockedBeerData';
import { BeerSimplified } from '@/types/typings';

const store = createStore({
  state() {
    return {
      beers: [],
    };
  },
  getters: {
    getSimplifiedBeersData(state: TestStore): BeerSimplified[] {
      return state.beers;
    },
  },
  mutations: {
    addBeers(state: TestStore) {
      state.beers = [...beers];
    },
  },
  actions: {
    fetchBeers() {
      this.commit('addBeers');
    },
  },
});

describe('BeerTable.vue', () => {
  it('renders button correctly', () => {
    const wrapper = shallowMount(BeerTable, {
      global: {
        plugins: [store],
      },
    });
    const button = wrapper.find('[data-test="fetch-button"]');
    expect(button.exists()).toBe(true);
  });
  it('renders table correctly', () => {
    const wrapper = shallowMount(BeerTable, {
      global: {
        plugins: [store],
      },
    });
    const table = wrapper.find('[data-test="beer-table"]');
    expect(table.exists()).toBe(true);
  });
  it('get display vuex store data after button click', async () => {
    const wrapper = shallowMount(BeerTable, {
      global: {
        plugins: [store],
      },
    });

    const button = wrapper.find('[data-test="fetch-button"]');
    await button.trigger('click');
    const tableBody = wrapper.find('[data-test="table-body"]');
    expect(tableBody.find('tr').exists()).toBe(true);
  });
});
