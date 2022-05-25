interface Volume {
  unit: 'litres' | 'grams' | 'kilograms' | 'celsius';
  value: number;
}

interface Hop {
  add: 'start' | 'middle' | 'end';
  amount: Volume;
  attribute: string;
  name: string;
}

interface Malt {
  amount: Volume;
  name: string;
}

interface Ingredients {
  hops: Hop[];
  malt: Malt[];
  yeast: string;
}

interface Fermentation {
  temp: Volume;
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
  abv: number | string;
  ibu: number | string;
  ebc: number | string;
  ph: number | string;
}

type TableKeys = 'id' | 'name' | 'first_brewed' | 'abv' | 'ibu' | 'ebc' | 'ph';

export type BeerSimplifiedI = {
  [key in TableKeys]: number | string | null;
};

export interface State {
  beers: Beer[];
  loadingStatus: boolean;
  cachedBeers: {
    [key: string]: Beer[];
  };
  areAllDataFetched: boolean;
}

export type LoadingComponentType = 'LoadMore' | 'Pagination' | 'InfiniteScroll';

export enum LoadingComponent {
  LOAD_MORE,
  PAGINATION,
  INFINITE_SCROLL,
}

export type SortDirection = 'asc' | 'dsc' | 'none';

export type SortBy = keyof BeerSimplified;

export interface SortEventData {
  sortDirection: SortDirection;
  sortBy: SortBy | null;
}

export type SortFunction = (sortDirection: SortDirection, sortBy: SortBy) => BeerSimplified[];

export interface QueryParams {
  page: number;
}

export enum PaginationButtonState {
  DEFAULT,
  NEXT,
  PREV,
}

export interface CachePageParam {
  mutation: string;
  cachedPage: Beer[];
}

export interface FetchBeerDataParam {
  mutation: string;
  queryParams: QueryParams;
  keyQuery: string;
}
