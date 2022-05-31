import { BeerSimplified, SortDirection, TableHeaderKey } from '@/types/typings';

//MOCKED DATA

export const simplifiedBeers: BeerSimplified[] = [
  {
    id: 1,
    name: 'Buzz',
    first_brewed: '09/2007',
    abv: 4.5,
    ibu: 60,
    ebc: 20,
    ph: 4.4,
  },
  {
    id: 16,
    name: 'Libertine Porter',
    first_brewed: '01/2012',
    abv: 6.1,
    ibu: 45,
    ebc: 219,
    ph: 4.4,
  },
];

export const tablePropsWithSortOn: BeerTableProps = {
  beerData: simplifiedBeers,
  sortDirection: SortDirection.ASC,
  sortBy: 'abv',
};

export const tablePropsWithSortOff: BeerTableProps = {
  beerData: simplifiedBeers,
  sortDirection: SortDirection.NONE,
  sortBy: null,
};

//TEST PURPOSE TYPES

export type BeerTableProps = {
  beerData: BeerSimplified[];
  sortBy: TableHeaderKey | null;
  sortDirection: SortDirection;
};
