import { shallowMount, VueWrapper } from '@vue/test-utils';
import { isEqual } from 'lodash';
import { BeerSimplified } from '@/types/typings';
import { simplifiedBeers } from './mockedBeerData';
import BeerTableBody from '@/components/BeerTableBody.vue';

function createWrapper(beerData: BeerSimplified[]) {
  return shallowMount(BeerTableBody, {
    props: {
      beerData,
    },
  });
}

describe('BeerTableBody.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof BeerTableBody>>;
  let beerData: BeerSimplified[];
  beforeEach(() => {
    wrapper = createWrapper(simplifiedBeers);
    beerData = wrapper.props().beerData;
  });
  it('returns correct beer object keys', () => {
    const beerObjectKeys: Array<keyof BeerSimplified> = wrapper.vm.getBeerObjectKeys(beerData[0]);
    const expectedKeys: Array<keyof BeerSimplified> = ['id', 'name', 'first_brewed', 'abv', 'ibu', 'ebc', 'ph'];
    expect(isEqual(beerObjectKeys, expectedKeys)).toBe(true);
  });
  it('returns correct cell content when beer prop data is empty', () => {
    const beerObjectIbuValue: string | number = wrapper.vm.getBeerTableCellContent(beerData[2].ibu);
    expect(beerObjectIbuValue).toBe('-');
  });
  it('returns correct cell content when beer prop data is not empty', () => {
    const beerObjectIbuValue: string | number = wrapper.vm.getBeerTableCellContent(beerData[0].ibu);
    expect(beerObjectIbuValue).toBe(60);
  });
});
