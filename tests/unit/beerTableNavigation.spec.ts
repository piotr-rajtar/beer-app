import { shallowMount } from '@vue/test-utils';
import BeerTableNavigation from '@/components/beerTable/BeerTableNavigation.vue';

describe('BeerTableNavigation.vue', () => {
  it('emits "LoadMore" value correctly', async () => {
    const wrapper = shallowMount(BeerTableNavigation);
    const loadMoreRadio = wrapper.find('[id="loadMore"]');
    await loadMoreRadio.trigger('change');
    const emittedEvent = wrapper.emitted().change[0];
    expect(emittedEvent).toEqual(['LoadMore']);
  });
  it('emits "Pagination" value correctly', async () => {
    const wrapper = shallowMount(BeerTableNavigation);
    const paginationRadio = wrapper.find('[id="pagination"]');
    await paginationRadio.trigger('change');
    const emittedEvent = wrapper.emitted().change[0];
    expect(emittedEvent).toEqual(['Pagination']);
  });
});
