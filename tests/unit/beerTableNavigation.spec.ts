import { shallowMount, VueWrapper } from '@vue/test-utils';
import BeerTableNavigation from '@/components/BeerTableNavigation.vue';
import { DataLoaderType } from '@/types/typings';

describe('BeerTableNavigation.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof BeerTableNavigation>>;

  beforeEach(() => {
    wrapper = shallowMount(BeerTableNavigation);
  });

  it('set "DataLoaderType.LOAD_MORE" as activeDataLoader after component mount', () => {
    expect(wrapper.vm.activeDataLoader).toBe(DataLoaderType.LOAD_MORE);
  });
  it('set "DataLoaderType.LOAD_MORE" as activeDataLoader after "LoadMore" option change', () => {
    wrapper.find('[data-test-id="loadMore"]').trigger('change');
    expect(wrapper.vm.activeDataLoader).toBe(DataLoaderType.LOAD_MORE);
  });
  it('set "DataLoaderType.PAGINATION" as activeDataLoader after "Pagination" option change', () => {
    wrapper.find('[data-test-id="pagination"]').trigger('change');
    expect(wrapper.vm.activeDataLoader).toBe(DataLoaderType.PAGINATION);
  });
  it('set "DataLoaderType.INFINITE_SCROLL" as activeDataLoader after "Infinite Scroll" option change', () => {
    wrapper.find('[data-test-id="infiniteScroll"]').trigger('change');
    expect(wrapper.vm.activeDataLoader).toBe(DataLoaderType.INFINITE_SCROLL);
  });
  it('emits "change" event after radio option click', () => {
    wrapper.find('[data-test-id="infiniteScroll"]').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('change');
  });
  it('emits "DataLoaderType.LOAD_MORE" value after "LoadMore" option click', () => {
    wrapper.find('[data-test-id="loadMore"]').trigger('change');
    const eventPayload = wrapper.emitted().change[0];
    expect(eventPayload).toEqual([DataLoaderType.LOAD_MORE]);
  });
  it('emits "DataLoaderType.PAGINATION" value after "Pagination" option click', () => {
    wrapper.find('[data-test-id="pagination"]').trigger('change');
    const eventPayload = wrapper.emitted().change[0];
    expect(eventPayload).toEqual([DataLoaderType.PAGINATION]);
  });
  it('emits "DataLoaderType.INFINITE_SCROLL" value after "InfiniteScroll" option click', () => {
    wrapper.find('[data-test-id="infiniteScroll"]').trigger('change');
    const eventPayload = wrapper.emitted().change[0];
    expect(eventPayload).toEqual([DataLoaderType.INFINITE_SCROLL]);
  });
});
