import { shallowMount } from '@vue/test-utils';
import BeerTableHeader from '@/components/BeerTableHeader.vue';

describe('BeerTableHeader.vue', () => {
  it('emits an sort event when sort button clicked', () => {
    const wrapper = shallowMount(BeerTableHeader, {
      props: {
        sortBy: null,
      },
    });
    const beerTableHeaderCell = wrapper.find('[data-test-id="beer-table-header_id"]');
    beerTableHeaderCell.trigger('sort');
    expect(wrapper.emitted()).toHaveProperty('sort');
  });
});
