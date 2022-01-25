import { BeerSimplified } from '@/types/typings';

export const beers: BeerSimplified[] = [
  {
    id: 1,
    name: 'Buzz',
    first_brewed: '09/2007',
    abv: 4.5,
    ibu: 60,
    ebc: 20,
    ph: 4.4,
  },
];

export interface TestStore {
  beers: BeerSimplified[];
  loadingStatus: boolean;
}
