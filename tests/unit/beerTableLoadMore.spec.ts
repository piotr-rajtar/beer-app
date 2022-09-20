import { shallowMount, VueWrapper } from '@vue/test-utils';
import BeerTableLoadMore from '@/components/BeerTableLoadMore.vue';
import storeCreator from '@/store/index';

let wrapper: VueWrapper<InstanceType<typeof BeerTableLoadMore>>;
let activePageWatcher: (pageNumber: number) => Promise<void>;

async function componentCreator(): Promise<void> {
  wrapper = shallowMount(BeerTableLoadMore, {
    global: {
      plugins: [storeCreator()],
    },
    props: {
      activePage: 1,
    },
  });
  activePageWatcher = wrapper.vm.$options.watch?.activePage as (pageNumber: number) => Promise<void>;
}

describe('BeerTableLoadMore.vue', () => {
  beforeEach(() => componentCreator());

  it('increases pageNumber by one after "loadMore" button click', () => {
    wrapper.vm.onLoadMore();
    expect(wrapper.vm.pageNumber).toBe(2);
  });

  it('sets correct pageNumber value to 1 after activePage prop value decreased to 1', () => {
    wrapper.vm.onLoadMore();
    activePageWatcher.call(wrapper.vm, 1);
    expect(wrapper.vm.pageNumber).toBe(1);
  });

  it('emits "loadMore" event after "loadMore" button click when next page is available', async () => {
    await wrapper.vm.onLoadMore();
    expect(wrapper.emitted()).toHaveProperty('loadMore');
  });

  it('does not emit "loadMore" event after "loadMore" button click when all data fetched', async () => {
    await wrapper.vm.onLoadMore();
    await wrapper.vm.onLoadMore();
    //mocked data has only two pages, the second one is loaded with first loadMore event emit
    const expectedNumberOfEmits: number = 1;
    expect(wrapper.emitted().loadMore.length).toBe(expectedNumberOfEmits);
  });

  it('enables "loadMore" button if next page is available', () => {
    expect(wrapper.vm.isLoadMoreButtonDisabled).toBe(false);
  });

  it('disables "loadMore" button if next page is not available', async () => {
    await wrapper.vm.onLoadMore();
    expect(wrapper.vm.isLoadMoreButtonDisabled).toBe(true);
  });

  it('enables "loadMore" button when all data was fetched and activePage was changed to 1', async () => {
    await wrapper.vm.onLoadMore();
    await activePageWatcher.call(wrapper.vm, 1);
    expect(wrapper.vm.isLoadMoreButtonDisabled).toBe(false);
  });
});
