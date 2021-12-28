import { shallowMount } from '@vue/test-utils';
import BeerTable from '@/components/BeerTable.vue';

describe('BeerTable.vue', () => {
  it('renders button correctly', () => {
    const wrapper = shallowMount(BeerTable);
    const button = wrapper.find('[data-test="fetch-button"]');
    expect(button.exists()).toBe(true);
  });
});
