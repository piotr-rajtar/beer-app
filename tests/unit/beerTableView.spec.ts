import { shallowMount, VueWrapper } from '@vue/test-utils';
import BeerTableView from '@/views/BeerTableView.vue';
import { Store } from 'vuex';
import { DataLoaderType, SortDirection, State } from '@/types/typings';
import storeCreator from '@/store/index';

describe('BeerTableView.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof BeerTableView>>;

  beforeEach(() => {
    const store: Store<State> = storeCreator();
    wrapper = shallowMount(BeerTableView, {
      global: {
        plugins: [store],
      },
    });
  });

  it('calls "loadInitialPage" action after "beerButton" click', async () => {
    const loadInitialPage = jest.spyOn(wrapper.vm, 'loadInitialPage');
    await wrapper.vm.fetchBeers();
    expect(loadInitialPage).toHaveBeenCalled();
  });

  it('returns correct isTableVisible getter value when beer data fetched', async () => {
    await wrapper.vm.fetchBeers();
    expect(wrapper.vm.isTableVisible).toBe(true);
  });

  it('renders no data component when no data fetched', async () => {
    await wrapper.vm.fetchBeers();
    //to mock returning no data from axios
    wrapper.vm.$store.commit('addInitialPage', []);
    expect(wrapper.vm.isNoDataVisible).toBe(true);
  });

  it('calls "loadInitialPage" action after navigation type change', async () => {
    const loadInitialPage = jest.spyOn(wrapper.vm, 'loadInitialPage');
    await wrapper.vm.onNavChange(DataLoaderType.PAGINATION);
    expect(loadInitialPage).toHaveBeenCalled();
  });

  it('calls "loadMorePaginedBeers" action on "nextPage" event catch', async () => {
    const loadMorePaginedBeers = jest.spyOn(wrapper.vm, 'loadMorePaginedBeers');
    await wrapper.vm.onNextPageClick();
    expect(loadMorePaginedBeers).toHaveBeenCalled();
  });

  it('calls "loadMorePaginedBeers" action after "prevPage" event catch', async () => {
    const loadMorePaginedBeers = jest.spyOn(wrapper.vm, 'loadMorePaginedBeers');
    await wrapper.vm.onPrevPageClick();
    expect(loadMorePaginedBeers).toHaveBeenCalled();
  });

  it('calls "loadMoreBeers" action after "loadMore" event catch', async () => {
    const loadMoreBeers = jest.spyOn(wrapper.vm, 'loadMoreBeers');
    await wrapper.vm.onLoadMoreBeers();
    expect(loadMoreBeers).toHaveBeenCalled();
  });

  it('sets page number value to 1 on sort click when "pagination" nav type chosen', () => {
    wrapper.vm.navigationType = DataLoaderType.PAGINATION;
    wrapper.vm.pageNumber = 2;
    wrapper.vm.onSortClick({ sortBy: 'id', sortDirection: SortDirection.DESC });
    expect(wrapper.vm.pageNumber).toBe(1);
  });

  it('sets "sortBy" as "null" after "beerButton" click', async () => {
    wrapper.vm.sortBy = 'abv';
    await wrapper.vm.fetchBeers();
    expect(wrapper.vm.sortBy).toBe(null);
  });

  it('sets "sortDirection" as "none" after "beerButton" click', async () => {
    wrapper.vm.sortDirection = SortDirection.ASC;
    await wrapper.vm.fetchBeers();
    expect(wrapper.vm.sortDirection).toBe(SortDirection.NONE);
  });

  it('sets "page" value equal 1 after "beerButton" click', async () => {
    wrapper.vm.pageNumber = 2;
    await wrapper.vm.fetchBeers();
    expect(wrapper.vm.pageNumber).toBe(1);
  });

  it('sets "sortBy" as "null" on navigation change', async () => {
    wrapper.vm.sortDirection = SortDirection.ASC;
    await wrapper.vm.onNavChange(DataLoaderType.PAGINATION);
    expect(wrapper.vm.sortDirection).toBe(SortDirection.NONE);
  });

  it('sets "sortDirection" as "none" on navigation change', async () => {
    wrapper.vm.sortDirection = SortDirection.ASC;
    await wrapper.vm.onNavChange(DataLoaderType.PAGINATION);
    expect(wrapper.vm.sortDirection).toBe(SortDirection.NONE);
  });

  it('sets "page" value equal 1 on navigation change', async () => {
    wrapper.vm.pageNumber = 2;
    await wrapper.vm.onNavChange(DataLoaderType.PAGINATION);
    expect(wrapper.vm.pageNumber).toBe(1);
  });
});
