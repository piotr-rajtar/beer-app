import { shallowMount, VueWrapper } from '@vue/test-utils';
import BeerTableInfiniteScroll from '@/components/BeerTableInfiniteScroll.vue';
import { Store } from 'vuex';
import { State } from '@/types/typings';
import storeCreator from '@/store/index';

describe('BeerTableInfiniteScroll.vue', () => {
  let testStore: Store<State>;
  let wrapper: VueWrapper<InstanceType<typeof BeerTableInfiniteScroll>>;
  const addEventListener: jest.SpyInstance = jest.spyOn(window, 'addEventListener');
  const removeEventListener = jest.spyOn(window, 'removeEventListener');

  beforeEach(() => {
    testStore = storeCreator();
    wrapper = shallowMount(BeerTableInfiniteScroll, {
      attachTo: document.body,
      computed: {
        numberOfInitialFetchNeeded() {
          return 1;
        },
      },
      global: {
        plugins: [testStore],
      },
      props: {
        activePage: 2,
      },
    });
  });

  it('adds "scroll" event listener when component mounted', () => {
    expect(addEventListener).toHaveBeenCalled();
  });
  it('removes "scroll" event listener when component unmounted', () => {
    wrapper.unmount();
    expect(removeEventListener).toHaveBeenCalled();
  });
  it('removes "scroll" event listener when all data fetched', () => {
    const areAllDataFetchedWatcher = wrapper.vm.$options.watch?.areAllDataFetched as (
      areAllDataFetched: boolean
    ) => void;
    areAllDataFetchedWatcher.call(wrapper.vm, true);
    expect(removeEventListener).toHaveBeenCalled();
  });
  it('emits "loadMore" event when component mounted', () => {
    expect(wrapper.emitted()).toHaveProperty('loadMore');
  });
  it('emits "loadMore" event when active page turns to 1', async () => {
    const activePageWatcher = wrapper.vm.$options.watch?.activePage as (pageNumber: number) => void;
    activePageWatcher.call(wrapper.vm, 1);
    //doubled value of "numberOfInitialFetchNeeded" (initial fetch + fetch after activePage change)
    const expectedNumberOfEmits: number = wrapper.vm.numberOfInitialFetchNeeded * 2;
    expect(wrapper.emitted().loadMore.length).toBe(expectedNumberOfEmits);
  });
});
