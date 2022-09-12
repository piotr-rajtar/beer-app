import { BeerSimplified, PageIndexes, SortDirection, QueryParams, SortOptions } from '@/types/typings';
import axios from 'axios';

export const compare = (sortOptions: SortOptions) => {
  return (a: BeerSimplified, b: BeerSimplified): number => {
    const arg1 = sortOptions.sortDirection === SortDirection.ASC ? a : b;
    const arg2 = sortOptions.sortDirection === SortDirection.ASC ? b : a;
    switch (sortOptions.sortBy) {
      case 'name':
        return arg1[sortOptions.sortBy].localeCompare(arg2[sortOptions.sortBy]);
      case 'first_brewed':
        return getDateFromString(arg1[sortOptions.sortBy]) - getDateFromString(arg2[sortOptions.sortBy]);
      default:
        return (arg1[sortOptions.sortBy!] as number) - (arg2[sortOptions.sortBy!] as number);
    }
  };
};

const getDateFromString = (dateString: string) => {
  const [month, year]: number[] = dateString.split('/').map((item) => +item);
  return new Date(year, month - 1).getTime();
};

export const getErrorMessage = (error: unknown): string =>
  axios.isAxiosError(error) ? `Axios error: ${error.message}` : `Other error: ${new Error().message}`;

export const getStartAndEndIndexOfPageItems = (pageNumber: number, itemsPerPage: number): PageIndexes => {
  const endIndex = itemsPerPage * pageNumber;
  const startIndex = endIndex - itemsPerPage;
  return {
    startIndex,
    endIndex,
  };
};

export const getUrlAddress = (apiAddress: string, queryParams: QueryParams): string => {
  const queryString: string = getQueryString(queryParams);
  return `${apiAddress}?${queryString}`;
};

export const getQueryString = (queryParams: QueryParams): string =>
  (Object.keys(queryParams) as Array<keyof QueryParams>)
    .map((queryParamKey) => `${queryParamKey}=${queryParams[queryParamKey]}`)
    .join();
