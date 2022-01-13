import { BeerSimplified } from '@/types/typings';

export const API_ADDRESS: string = 'https://api.punkapi.com/v2/beers';

export const tableHeaders: Array<keyof BeerSimplified> = [
  'id',
  'name',
  'first_brewed',
  'abv',
  'ibu',
  'ebc',
  'ph',
];
