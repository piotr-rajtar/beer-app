import { shallowMount, VueWrapper } from '@vue/test-utils';
import BeerTableHeaderCell from '@/components/BeerTableHeaderCell.vue';
import { SortDirection, TableHeaderKey } from '@/types/typings';

function createWrapper(headerKey: TableHeaderKey, headerName: string) {
  return shallowMount(BeerTableHeaderCell, {
    props: {
      headerKey: headerKey,
      headerName: headerName,
      sortBy: null,
    },
  });
}

describe('BeerTableHeaderCell.vue for all headers', () => {
  it('displays correct header name', () => {
    const wrapper = createWrapper('id', 'ID');
    expect(wrapper.vm.headerName).toBe('ID');
  });
});

describe('BeerTableHeaderCell.vue for all headers with "more" header excluded', () => {
  let wrapper: VueWrapper<InstanceType<typeof BeerTableHeaderCell>>;

  beforeEach(() => {
    wrapper = createWrapper('ph', 'PH');
  });

  it('renders sort button', () => {
    const sortButton = wrapper.find('[data-test-id="sort-button-ph"');
    expect(sortButton.exists()).toBe(true);
  });

  it('emits "sort" event when sort button clicked', () => {
    const sortButton = wrapper.find('[data-test-id="sort-button-ph"');
    sortButton.trigger('sort');
    expect(wrapper.emitted()).toHaveProperty('sort');
  });

  it('emits correct sort event data when sort button clicked', () => {
    wrapper.vm.onSortClick(SortDirection.ASC);
    expect(wrapper.emitted().sort[0]).toEqual([
      {
        sortBy: wrapper.props().headerKey,
        sortDirection: SortDirection.ASC,
      },
    ]);
  });
});

describe('BeerTableHeaderCell.vue with "more" header', () => {
  it('not renders sort button', () => {
    const wrapper = createWrapper('more', 'MORE');
    const sortButton = wrapper.find('[data-test-id="sort-button-more"]');
    expect(sortButton.exists()).toBe(false);
  });
});
