import { shallowMount } from '@vue/test-utils';
import BeerTableView from '@/views/BeerTableView.vue';
import { store, beers } from './mockedBeerData';

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
  it('renders beer table navigation correctly', async () => {
    const wrapper = shallowMount(BeerTableView, {
      global: {
        plugins: [store],
      },
    });
    await wrapper.vm.downloadBeers();
    const tableNavigation = wrapper.find('[data-test="beer-table-nav"]');
    expect(tableNavigation.exists()).toBe(true);
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
  it('renders LoadMore component correctly', async () => {
    const wrapper = shallowMount(BeerTableView, {
      global: {
        plugins: [store],
      },
    });
    await wrapper.vm.downloadBeers();
    const loadMore = wrapper.find('[data-test="LoadMore"]');
    expect(loadMore.exists()).toBe(true);
  });
  it('renders pagination correctly', async () => {
    const wrapper = shallowMount(BeerTableView, {
      global: {
        plugins: [store],
      },
    });
    await wrapper.vm.downloadBeers();
    await wrapper.vm.onNavChange('Pagination');
    const pagination = wrapper.find('[data-test="Pagination"]');
    expect(pagination.exists()).toBe(true);
  });
  it('handle sort event correctly', async () => {
    const wrapper = shallowMount(BeerTableView, {
      global: {
        plugins: [store],
      },
    });

    await store.commit('addBeers', beers);
    const initialFirstBeerId = wrapper.vm.beersData[0].id;
    wrapper.vm.onSortClick({ sortDirection: 'dsc', sortBy: 'id' });
    const sortedFirstBeersId = wrapper.vm.beersData[0].id;
    wrapper.vm.onSortClick({ sortDirection: 'none', sortBy: null });
    const sortDirectionDataProp = wrapper.vm.sortDirection;
    const sortByDataProp = wrapper.vm.sortBy;
    expect(initialFirstBeerId).toBe(1);
    expect(sortedFirstBeersId).toBe(16);
    expect(sortDirectionDataProp).toBe('none');
    expect(sortByDataProp).toBe(null);
  });
});
