import { shallowMount, VueWrapper } from '@vue/test-utils';
import BeerTableSortButton from '@/components/BeerTableSortButton.vue';
import { SortDirection } from '@/types/typings';

describe('BeerTableSortButton.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof BeerTableSortButton>>;
  beforeEach(() => {
    wrapper = shallowMount(BeerTableSortButton, {
      props: {
        columnHeader: 'ph',
        sortBy: null,
      },
    });
  });
  it('returns correct sortButtonTitle when sort is off', () => {
    expect(wrapper.vm.sortButtonTitle).toBe('ASC');
  });
  it('returns correct sortButtonTitle when "asc" sort is on', () => {
    wrapper.vm.sortButtonDirection = SortDirection.ASC;
    expect(wrapper.vm.sortButtonTitle).toBe('ASC');
  });
  it('returns correct sortButtonTitle when "desc" sort is on', () => {
    wrapper.vm.sortButtonDirection = SortDirection.DESC;
    expect(wrapper.vm.sortButtonTitle).toBe('DESC');
  });
  it('emits "sort" event when button clicked', () => {
    const sortButton = wrapper.find('[data-test-id="beer-table-sort-button__ph"]');
    sortButton.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('sort');
  });
  it('emits "asc" sort direction when sort button clicked and sort is off', () => {
    wrapper.vm.sortButtonDirection = SortDirection.NONE;
    const sortButton = wrapper.find('[data-test-id="beer-table-sort-button__ph"]');
    sortButton.trigger('click');
    expect(wrapper.emitted().sort[0]).toEqual([SortDirection.ASC]);
  });
  it('emits "desc" sort direction when sort button clicked and asc sort is on', () => {
    wrapper.vm.sortButtonDirection = SortDirection.ASC;
    const sortButton = wrapper.find('[data-test-id="beer-table-sort-button__ph"]');
    sortButton.trigger('click');
    expect(wrapper.emitted().sort[0]).toEqual([SortDirection.DESC]);
  });
  it('emits "none" sort direction when sort button clicked and desc sort is on', () => {
    wrapper.vm.sortButtonDirection = SortDirection.DESC;
    const sortButton = wrapper.find('[data-test-id="beer-table-sort-button__ph"]');
    sortButton.trigger('click');
    expect(wrapper.emitted().sort[0]).toEqual([SortDirection.NONE]);
  });
  it('returns correct "isSortButtonClicked" value when sort is on', () => {
    wrapper.vm.sortButtonDirection = SortDirection.ASC;
    expect(wrapper.vm.isSortButtonClicked).toBe(true);
  });
  it('returns correct "isSortButtonClicked" value when sort is off', () => {
    wrapper.vm.sortButtonDirection = SortDirection.NONE;
    expect(wrapper.vm.isSortButtonClicked).toBe(false);
  });
  it('turns sorting off on sortBy prop change', async () => {
    wrapper.vm.sortButtonDirection = SortDirection.ASC;
    await wrapper.setProps({ sortBy: 'id' });
    expect(wrapper.vm.sortButtonDirection).toBe(SortDirection.NONE);
  });
});
