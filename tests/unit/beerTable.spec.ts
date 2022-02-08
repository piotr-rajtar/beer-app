import { shallowMount } from '@vue/test-utils';
import BeerTable from '@/components/beerTable/BeerTable.vue';
import { beers } from './mockedBeerData';

describe('BeerTableNavigation.vue', () => {
  it('emits sort on event correctly', () => {
    const wrapper = shallowMount(BeerTable, {
      props: {
        beerData: beers,
      },
    });
    wrapper.vm.onSortClick('asc', 'id');
    const emittedEvent = wrapper.emitted().sort[0];
    expect(emittedEvent).toEqual([{ sortDirection: 'asc', sortBy: 'id' }]);
  });
  it('emits sort off event correctly', () => {
    const wrapper = shallowMount(BeerTable, {
      props: {
        beerData: beers,
      },
    });
    wrapper.vm.onSortClick('asc', 'id');
    wrapper.vm.onSortClick('asc', 'id');
    const emittedEvent = wrapper.emitted().sort[1];
    expect(emittedEvent).toEqual([{ sortDirection: 'none', sortBy: null }]);
  });
  it('returns correct value when sort is on', () => {
    const wrapper = shallowMount(BeerTable, {
      props: {
        beerData: beers,
      },
    });
    wrapper.vm.onSortClick('asc', 'id');
    const isSortClicked = wrapper.vm.isSortClicked('asc', 'id');
    expect(isSortClicked).toBe(true);
  });
  it('returns correct value when sort is off', () => {
    const wrapper = shallowMount(BeerTable, {
      props: {
        beerData: beers,
      },
    });
    wrapper.vm.onSortClick('asc', 'id');
    const isSortClicked = wrapper.vm.isSortClicked('dsc', 'id');
    expect(isSortClicked).toBe(false);
  });
});
