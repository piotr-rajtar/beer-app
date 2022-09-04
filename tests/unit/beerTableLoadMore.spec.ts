import { shallowMount, VueWrapper } from '@vue/test-utils';
import BeerTableLoadMore from '@/components/BeerTableLoadMore.vue';
import { createStore } from 'vuex';

let wrapper: VueWrapper<InstanceType<typeof BeerTableLoadMore>>;
const testPageNumber = 2;

function componentCreator(areAllDataFetched: boolean): void {
  const store = createStore({
    state: {
      areAllDataFetched: areAllDataFetched,
    },
    actions: {
      checkIfNextPageAvailable: jest.fn(() => !areAllDataFetched),
    },
  });
  wrapper = shallowMount(BeerTableLoadMore, {
    global: {
      plugins: [store],
    },
    props: {
      activePage: testPageNumber,
    },
  });
  wrapper.vm.pageNumber = testPageNumber;
}

describe('BeerTableLoadMore.vue', () => {
  beforeEach(() => componentCreator(false));

  it('increases pageNumber by one after button click', async () => {
    await wrapper.vm.onLoadMore();
    expect(wrapper.vm.pageNumber).toBe(testPageNumber + 1);
  });

  it('sets correct pageNumber to 1 after activePage prop change to 1', () => {
    const activePageWatcher = wrapper.vm.$options.watch?.activePage as (pageNumber: number) => Promise<void>;
    activePageWatcher.call(wrapper.vm, 1);
    expect(wrapper.vm.pageNumber).toBe(1);
  });

  it('emits "loadMore" event after button click', async () => {
    await wrapper.vm.onLoadMore();
    expect(wrapper.emitted()).toHaveProperty('loadMore');
  });

  it('sets correct button disability status if next page is available', () => {
    expect(wrapper.vm.isLoadMoreButtonDisabled).toBe(false);
  });
});

describe('BeerTableLoadMore.vue with all data fetched', () => {
  beforeEach(() => componentCreator(true));

  it('does not emit "loadMore" event after button click when all data fetched', async () => {
    await wrapper.vm.onLoadMore();
    expect(wrapper.emitted().loadMore).toBe(undefined);
  });

  it('sets correct button disability status if next page is not available', () => {
    expect(wrapper.vm.isLoadMoreButtonDisabled).toBe(true);
  });
});
