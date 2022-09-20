import { flushPromises, shallowMount, VueWrapper } from '@vue/test-utils';
import BeerTablePagination from '@/components/BeerTablePagination.vue';
import storeCreator from '@/store/index';

let wrapper: VueWrapper<InstanceType<typeof BeerTablePagination>>;

async function componentCreator(): Promise<void> {
  wrapper = shallowMount(BeerTablePagination, {
    global: {
      plugins: [storeCreator()],
    },
    props: {
      activePage: 1,
    },
  });
}

describe('BeerTablePagination.vue', () => {
  beforeEach(() => componentCreator());

  it('increases pageNumber by one after "next" button click when next page is available', () => {
    wrapper.vm.onNextClick();
    expect(wrapper.vm.pageNumber).toBe(2);
  });

  it('does not increase pageNumber on "next" button click when next page is not available', async () => {
    wrapper.vm.onNextClick();
    await flushPromises();
    wrapper.vm.onNextClick();
    expect(wrapper.vm.pageNumber).toBe(2);
  });

  it('decreases pageNumber by one after "prev" button click when enabled', async () => {
    wrapper.vm.onNextClick();
    await flushPromises();
    wrapper.vm.onPrevClick();
    expect(wrapper.vm.pageNumber).toBe(1);
  });

  it('does not decrease pageNumber on "prev" button click when disabled', () => {
    wrapper.vm.onPrevClick();
    expect(wrapper.vm.pageNumber).toBe(1);
  });

  it('sets pageNumber value to 1 after activePage prop value decreased to 1', () => {
    const activePageWatcher = wrapper.vm.$options.watch?.activePage as (pageNumber: number) => Promise<void>;
    wrapper.vm.onNextClick();
    activePageWatcher.call(wrapper.vm, 2);
    activePageWatcher.call(wrapper.vm, 1);
    expect(wrapper.vm.pageNumber).toBe(1);
  });

  it('emits "nextPage" event on "next" button click when next page is available', () => {
    wrapper.vm.onNextClick();
    expect(wrapper.emitted()).toHaveProperty('nextPage');
  });

  it('does not emit "nextPage" event on "next" button click when next page is not available', async () => {
    wrapper.vm.onNextClick();
    await flushPromises();
    wrapper.vm.onNextClick();
    expect(wrapper.emitted().nextPage.length).toBe(1);
  });

  it('emits "prevPage" event on "prev" button click when enabled', async () => {
    wrapper.vm.onNextClick();
    await flushPromises();
    wrapper.vm.onPrevClick();
    expect(wrapper.emitted()).toHaveProperty('prevPage');
  });

  it('does not emit "prevPage" event on "prev" button click when disabled', () => {
    wrapper.vm.onPrevClick();
    expect(wrapper.emitted().prevPage).toBe(undefined);
  });

  it('enables "next" button on component mounted when next page is available', () => {
    expect(wrapper.vm.isNextButtonDisabled).toBe(false);
  });

  it('enables "next" button on "prev" button click', async () => {
    wrapper.vm.onNextClick();
    await flushPromises();
    wrapper.vm.onPrevClick();
    await flushPromises();
    expect(wrapper.vm.isNextButtonDisabled).toBe(false);
  });

  it('disables "next" button when next page is not available', async () => {
    wrapper.vm.onNextClick();
    await flushPromises();
    expect(wrapper.vm.isNextButtonDisabled).toBe(true);
  });

  it('disables "prev" button on component mounted', () => {
    expect(wrapper.vm.isPrevButtonDisabled).toBe(true);
  });

  it('enables "prev" button on "next" button clicked', async () => {
    wrapper.vm.onNextClick();
    await flushPromises();
    expect(wrapper.vm.isPrevButtonDisabled).toBe(false);
  });

  it('disables "prev" button once clicked when page number decreased to 1', async () => {
    wrapper.vm.onNextClick();
    await flushPromises();
    wrapper.vm.onPrevClick();
    await flushPromises();
    expect(wrapper.vm.isPrevButtonDisabled).toBe(true);
  });
});
