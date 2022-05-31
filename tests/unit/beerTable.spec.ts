import { shallowMount } from '@vue/test-utils';
import BeerTable from '@/components/beerTable/BeerTable.vue';
import { BeerTableProps, tablePropsWithSortOff, tablePropsWithSortOn } from './mockedBeerData';
import { SortDirection } from '@/types/typings';

function createWrapper(props: BeerTableProps) {
  const { beerData, sortBy, sortDirection } = props;
  return shallowMount(BeerTable, {
    props: {
      beerData,
      sortDirection,
      sortBy,
    },
  });
}

describe('BeerTable.vue', () => {
  it('returns correct isSortClicked value when sort is on', () => {
    const wrapper = createWrapper(tablePropsWithSortOn);
    const isSortClicked = wrapper.vm.isSortClicked(SortDirection.ASC, 'abv');
    expect(isSortClicked).toBe(true);
  });
  it('returns correct isSortClicked value when sort is off', () => {
    const wrapper = createWrapper(tablePropsWithSortOff);
    const isSortClicked = wrapper.vm.isSortClicked(SortDirection.DESC, 'id');
    expect(isSortClicked).toBe(false);
  });
  it('does not render "asc" sort button for "more" header', () => {
    const wrapper = createWrapper(tablePropsWithSortOff);
    const ascSortButton = wrapper.find('[data-test="asc-sort-button-more"]');
    expect(ascSortButton.exists()).toBe(false);
  });
  it('does not render "desc" sort button for "more" header', () => {
    const wrapper = createWrapper(tablePropsWithSortOff);
    const descSortButton = wrapper.find('[data-test="asc-sort-button-more"]');
    expect(descSortButton.exists()).toBe(false);
  });
  it('emits sort event when "asc" button clicked', () => {
    const wrapper = createWrapper(tablePropsWithSortOff);
    wrapper.find('[data-test="asc-sort-button-id"]').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('sort');
  });
  it('emits sort event when "desc" button clicked', () => {
    const wrapper = createWrapper(tablePropsWithSortOff);
    wrapper.find('[data-test="desc-sort-button-id"]').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('sort');
  });
});
