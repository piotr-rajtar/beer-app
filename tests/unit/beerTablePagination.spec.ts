import { shallowMount, VueWrapper } from '@vue/test-utils';
import BeerTablePagination from '@/components/BeerTablePagination.vue';
import { createStore } from 'vuex';

let wrapper: VueWrapper<InstanceType<typeof BeerTablePagination>>;
let activePageWatcher: (pageNumber: number) => Promise<void>;
let pageNumberWatcher: (newPageNumber: number, oldPageNumber: number) => Promise<void>;

function componentCreator(isNextPageAvailable: boolean): void {
  const store = createStore({
    actions: {
      checkIfNextPageAvailable: jest.fn(() => isNextPageAvailable),
    },
  });
  wrapper = shallowMount(BeerTablePagination, {
    global: {
      plugins: [store],
    },
    props: {
      activePage: 1,
    },
  });
  activePageWatcher = wrapper.vm.$options.watch?.activePage as (pageNumber: number) => Promise<void>;
  pageNumberWatcher = wrapper.vm.$options.watch?.pageNumber as (
    newPageNumber: number,
    oldPageNumber: number
  ) => Promise<void>;
}

describe('BeerTablePagination.vue with next page available', () => {
  beforeEach(() => componentCreator(true));

  it('increases pageNumber by one after "next" button click', () => {
    wrapper.vm.onNextClick();
    expect(wrapper.vm.pageNumber).toBe(2);
  });

  it('emits "nextPage" event on "next" button click', () => {
    wrapper.vm.onNextClick();
    expect(wrapper.emitted()).toHaveProperty('nextPage');
  });

  it('decreases pageNumber by one after "prev" button click when enabled', () => {
    wrapper.vm.onNextClick();
    wrapper.vm.isPrevButtonDisabled = false;
    wrapper.vm.onPrevClick();
    expect(wrapper.vm.pageNumber).toBe(1);
  });

  it('emits "prevPage" event on "prev" button click when enabled', () => {
    wrapper.vm.isPrevButtonDisabled = false;
    wrapper.vm.onPrevClick();
    expect(wrapper.emitted()).toHaveProperty('prevPage');
  });

  it('does not emit "prevPage" event on "prev" button click when disabled', () => {
    wrapper.vm.onPrevClick();
    expect(wrapper.emitted().prevPage).toBe(undefined);
  });

  it('does not decrease pageNumber on "prev" button click when disabled', () => {
    wrapper.vm.onPrevClick();
    expect(wrapper.vm.pageNumber).toBe(1);
  });

  it('sets pageNumber to 1 after activePage prop change to 1', () => {
    wrapper.vm.onNextClick();
    activePageWatcher.call(wrapper.vm, 1);
    expect(wrapper.vm.pageNumber).toBe(1);
  });

  it('disables "prev" button on component mounted', () => {
    expect(wrapper.vm.isPrevButtonDisabled).toBe(true);
  });

  it('enables "prev" button when pageNumber increased', async () => {
    wrapper.vm.onNextClick();
    await pageNumberWatcher.call(wrapper.vm, 2, 1);
    expect(wrapper.vm.isPrevButtonDisabled).toBe(false);
  });

  it('enables "next" button on mounted when next page is available', () => {
    expect(wrapper.vm.isNextButtonDisabled).toBe(false);
  });

  it('keeps "next" button enabled on "prev" button click when it was previously enabled', async () => {
    wrapper.vm.onNextClick();
    await pageNumberWatcher.call(wrapper.vm, 2, 1);
    wrapper.vm.onPrevClick();
    await pageNumberWatcher.call(wrapper.vm, 1, 2);
    expect(wrapper.vm.isNextButtonDisabled).toBe(false);
  });

  it('enables "next" button on "prev" button click when it was previously disabled', async () => {
    wrapper.vm.onNextClick();
    await pageNumberWatcher.call(wrapper.vm, 2, 1);
    wrapper.vm.isNextButtonDisabled = true;
    wrapper.vm.onPrevClick();
    await pageNumberWatcher.call(wrapper.vm, 1, 2);
    expect(wrapper.vm.isNextButtonDisabled).toBe(false);
  });

  it('keeps "prev" button enabled on pageNumber decrease when page number is greater than 1', async () => {
    wrapper.vm.pageNumber = 3;
    await pageNumberWatcher.call(wrapper.vm, 3, 2);
    wrapper.vm.onPrevClick();
    await pageNumberWatcher.call(wrapper.vm, 2, 3);
    expect(wrapper.vm.isPrevButtonDisabled).toBe(false);
  });

  it('disables "prev" button on pageNumber decrease when page number is equal to 1', async () => {
    wrapper.vm.onNextClick();
    await pageNumberWatcher.call(wrapper.vm, 2, 1);
    wrapper.vm.onPrevClick();
    await pageNumberWatcher.call(wrapper.vm, 1, 2);
    expect(wrapper.vm.isPrevButtonDisabled).toBe(true);
  });
});

describe('BeerTablePagination.vue with next page not available', () => {
  beforeEach(() => componentCreator(false));

  it('disables "next" button on mounted', () => {
    expect(wrapper.vm.isNextButtonDisabled).toBe(true);
  });

  it('does not emit "nextPage" event on "next" button click', () => {
    wrapper.vm.onNextClick();
    expect(wrapper.emitted().nextPage).toBe(undefined);
  });

  it('does not increase pageNumber after "next" button click', () => {
    wrapper.vm.onNextClick();
    expect(wrapper.vm.pageNumber).toBe(1);
  });

  it('disables "next" button when was enabled previously and pageNumber increased', async () => {
    wrapper.vm.isNextButtonDisabled = false;
    wrapper.vm.onNextClick();
    await pageNumberWatcher.call(wrapper.vm, 2, 1);
    expect(wrapper.vm.isNextButtonDisabled).toBe(true);
  });
});
