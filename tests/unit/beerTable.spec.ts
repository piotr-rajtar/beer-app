import { shallowMount } from '@vue/test-utils';
import BeerTable from '@/components/beerTable/BeerTable.vue';
import { simplifiedBeers } from './mockedBeerData';

describe('BeerTableNavigation.vue', () => {
  it('returns correct isSortClicked value when sort is on', () => {
    const wrapper = shallowMount(BeerTable, {
      props: {
        beerData: simplifiedBeers,
      },
    });
    wrapper.vm.onSortClick('asc', 'id');
    const isSortClicked = wrapper.vm.isSortClicked('asc', 'id');
    expect(isSortClicked).toBe(true);
  });
  it('returns correct value when sort is off', () => {
    const wrapper = shallowMount(BeerTable, {
      props: {
        beerData: simplifiedBeers,
      },
    });
    wrapper.vm.onSortClick('asc', 'id');
    const isSortClicked = wrapper.vm.isSortClicked('dsc', 'id');
    expect(isSortClicked).toBe(false);
  });
});
