import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import BeerTableView from '@/containers/BeerTableView.vue';
import { beers, TestStore } from './mockedBeerData';
import { BeerSimplified } from '@/types/typings';

const store = createStore({
  state() {
    return {
      beers: [],
      loadingStatus: false,
    };
  },
  getters: {
    getSimplifiedBeersData(state: TestStore): BeerSimplified[] {
      return state.beers;
    },
  },
  mutations: {
    addBeers(state: TestStore, payload = beers) {
      state.beers = [...payload];
    },
  },
  actions: {
    fetchBeers() {
      this.commit('addBeers');
    },
  },
});

//Component rendering
describe('BeerTableView.vue', () => {
  beforeEach(() => (store.state.beers = []));
  it('renders header correctly', () => {
    const wrapper = shallowMount(BeerTableView, {
      global: {
        plugins: [store],
      },
    });
    const header = wrapper.find('[data-test="header"]');
    expect(header.exists()).toBe(true);
  });
  it('renders fetch button correctly', () => {
    const wrapper = shallowMount(BeerTableView, {
      global: {
        plugins: [store],
      },
    });
    const button = wrapper.find('[data-test="fetch-button"]');
    expect(button.exists()).toBe(true);
  });
  it('renders beer table correctly', async () => {
    const wrapper = shallowMount(BeerTableView, {
      global: {
        plugins: [store],
      },
    });
    await wrapper.vm.downloadBeers();
    const table = wrapper.find('[data-test="beer-table"]');
    expect(table.exists()).toBe(true);
  });
  it('renders no data component correctly', async () => {
    const wrapper = shallowMount(BeerTableView, {
      global: {
        plugins: [store],
      },
    });
    await wrapper.vm.downloadBeers();
    await store.commit('addBeers', []);
    const noData = wrapper.find('[data-test="no-data"]');
    expect(noData.exists()).toBe(true);
  });
});
