import { shallowMount, VueWrapper } from '@vue/test-utils';
import { isEqual } from 'lodash';
import { BeerSimplified } from '@/types/typings';
import { simplifiedBeers } from './mockedBeerData';
import BeerTableBody from '@/components/BeerTableBody.vue';

describe('BeerTableBody.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof BeerTableBody>>;

  beforeEach(() => {
    wrapper = shallowMount(BeerTableBody, {
      props: {
        beerData: simplifiedBeers,
      },
    });
  });

  it('returns correct beer object keys', () => {
    const beerObjectKeys: Array<keyof BeerSimplified> = wrapper.vm.getBeerObjectKeys(simplifiedBeers[0]);
    const expectedKeys: Array<keyof BeerSimplified> = ['id', 'name', 'first_brewed', 'abv', 'ibu', 'ebc', 'ph'];
    expect(isEqual(beerObjectKeys, expectedKeys)).toBe(true);
  });

  it('returns correct cell content when beer prop data is empty', () => {
    const beerObjectIbuValue: string | number = wrapper.vm.getBeerTableCellContent(simplifiedBeers[2].ibu);
    expect(beerObjectIbuValue).toBe('-');
  });

  it('returns correct cell content when beer prop data is not empty', () => {
    const beerObjectIbuValue: string | number = wrapper.vm.getBeerTableCellContent(simplifiedBeers[0].ibu);
    expect(beerObjectIbuValue).toBe(60);
  });
});
