import { shallowMount } from '@vue/test-utils';
import BeerTable from '@/components/BeerTable.vue';

describe('BeerTable.vue', () => {
  it('emits an sort event when sort button clicked', () => {
    const wrapper = shallowMount(BeerTable, {
      props: {
        beerData: [],
        sortBy: null,
      },
    });
    const beerTableHeader = wrapper.find('[data-test-id="beer-table__header"]');
    beerTableHeader.trigger('sort');
    expect(wrapper.emitted()).toHaveProperty('sort');
  });
});
