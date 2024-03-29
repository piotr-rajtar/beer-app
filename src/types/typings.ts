//BEER DATA TYPES
interface Fermentation {
  temp: Volume;
}
interface Hop {
  add: 'start' | 'middle' | 'end';
  amount: Volume;
  attribute: string;
  name: string;
}

interface Ingredients {
  hops: Hop[];
  malt: Malt[];
  yeast: string;
}

interface Malt {
  amount: Volume;
  name: string;
}

interface MashTemp {
  duration: number;
  temp: Volume;
}

interface Method {
  fermentation: Fermentation;
  mash_temp: MashTemp[];
  twist: null | string;
}
interface Volume {
  unit: 'litres' | 'grams' | 'kilograms' | 'celsius';
  value: number;
}

export interface Beer {
  abv: number | null;
  attenuation_level: number;
  boil_volume: Volume;
  brewers_tips: string;
  contributed_by: string;
  description: string;
  ebc: number | null;
  first_brewed: string;
  food_pairing: string[];
  ibu: number | null;
  id: number;
  image_url: string;
  ingredients: Ingredients;
  method: Method;
  name: string;
  ph: number | null;
  srm: number;
  tagline: string;
  target_fg: number;
  target_og: number;
  volume: Volume;
}

export interface BeerSimplified {
  id: number;
  name: string;
  first_brewed: string;
  abv: number | null;
  ibu: number | null;
  ebc: number | null;
  ph: number | null;
}

//STORE TYPES
type AddBeersMutation = 'addMoreBeers' | 'addMorePaginedBeers' | 'addInitialPage';

type TableKeys = 'id' | 'name' | 'first_brewed' | 'abv' | 'ibu' | 'ebc' | 'ph';

export interface CachedPage {
  keyQuery: string;
  page: Beer[];
}

export interface LoadBeerItemPayload {
  queryParams: QueryParams;
  addBeersMutation: AddBeersMutation;
}

export interface PageIndexes {
  startIndex: number;
  endIndex: number;
}

export interface State {
  beers: Beer[];
  loadingStatus: boolean;
  cachedBeers: {
    [key: string]: Beer[];
  };
  areAllDataFetched: boolean;
}

export interface QueryParams {
  page: number;
}

export type BeerSimplifiedI = {
  [key in TableKeys]: number | string | null;
};

//SORT TYPES
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
  NONE = 'none',
}

export interface SortOptions {
  sortDirection: SortDirection;
  sortBy: SortBy | null;
}

export interface PagingOptions {
  pageNumber: number;
  itemsPerPage: number;
}

export type SortBy = keyof BeerSimplified;

export type SortFunction = (sortOptions: SortOptions) => BeerSimplified[];

//LOADING COMPONENTS TYPES
export enum DataLoaderType {
  LOAD_MORE = 'BeerTableLoadMore',
  PAGINATION = 'BeerTablePagination',
  INFINITE_SCROLL = 'BeerTableInfiniteScroll',
}

export enum PaginationButtonState {
  DEFAULT,
  NEXT,
  PREV,
}

export interface NavigationItem {
  id: string;
  value: DataLoaderType;
  label: string;
}

//BEER TABLE TYPES
export interface TableHeader {
  key: TableHeaderKey;
  name: string;
}

export type TableHeaderKey = keyof BeerSimplified | 'more';

export type TableHeaders = Array<TableHeader>;
