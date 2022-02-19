import { shallowMount } from '@vue/test-utils';
import BeerTableView from '@/views/BeerTableView.vue';
import { Store } from 'vuex';
import { State } from '@/types/typings';
import storeCreator from '@/store/index';

describe('BeerTableView.vue', () => {
  let mockedStore: Store<State>;

  beforeEach(() => (mockedStore = storeCreator()));
  it('return correct shouldTableBeVisibile getter value when beer data fetched', async () => {
    const wrapper = shallowMount(BeerTableView, {
      global: {
        plugins: [mockedStore],
      },
    });
    await wrapper.vm.downloadBeersInitially();
    const shouldTableBeVisibile = wrapper.vm.shouldTableBeVisibile;
    expect(shouldTableBeVisibile).toBe(true);
  });
  it('renders no data component when no data fetched', async () => {
    const wrapper = shallowMount(BeerTableView, {
      global: {
        plugins: [mockedStore],
      },
    });
    await wrapper.vm.downloadBeersInitially();
    await mockedStore.commit('addBeersInitially', []);
    const noData = wrapper.find('[data-test="no-data"]');
    expect(noData.exists()).toBe(true);
  });
  it('renders LoadMore component if selected', async () => {
    const wrapper = shallowMount(BeerTableView, {
      global: {
        plugins: [mockedStore],
      },
    });
    await wrapper.vm.downloadBeersInitially();
    const loadMore = wrapper.find('[data-test="LoadMore"]');
    expect(loadMore.exists()).toBe(true);
  });
  it('renders Pagination component if selected', async () => {
    const wrapper = shallowMount(BeerTableView, {
      global: {
        plugins: [mockedStore],
      },
    });
    await wrapper.vm.downloadBeersInitially();
    await wrapper.vm.onNavChange('Pagination');
    const pagination = wrapper.find('[data-test="Pagination"]');
    expect(pagination.exists()).toBe(true);
  });
  it('sort beer data correctly', async () => {
    const wrapper = shallowMount(BeerTableView, {
      global: {
        plugins: [mockedStore],
      },
    });

    await wrapper.vm.downloadBeersInitially();
    wrapper.vm.onSortClick({ sortDirection: 'dsc', sortBy: 'id' });
    const firstBeerId = wrapper.vm.beersData[0].id;
    expect(firstBeerId).toBe(16);
  });
  it('load more beer data correctly', async () => {
    const wrapper = shallowMount(BeerTableView, {
      global: {
        plugins: [mockedStore],
      },
    });

    await wrapper.vm.downloadBeersInitially();
    await wrapper.vm.onLoadMoreBeers();
    const [lastBeer] = wrapper.vm.beersData.slice(-1);
    expect(lastBeer.id).toBe(23);
  });
});
