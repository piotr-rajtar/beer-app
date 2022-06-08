import { BeerSimplified, SortBy, SortDirection, QueryParams } from '@/types/typings';
import axios from 'axios';

const getDateTime = (dateString: string) => {
  const [month, year]: number[] = dateString.split('/').map((item) => +item);
  return new Date(year, month - 1).getTime();
};

export const compareFunction = (sortDirection: SortDirection, sortBy: SortBy) => {
  return (a: BeerSimplified, b: BeerSimplified): number => {
    const arg1 = sortDirection === SortDirection.ASC ? a : b;
    const arg2 = sortDirection === SortDirection.ASC ? b : a;
    switch (sortBy) {
      case 'name':
        return arg1[sortBy].localeCompare(arg2[sortBy]);
      case 'first_brewed':
        return getDateTime(arg1[sortBy]) - getDateTime(arg2[sortBy]);
      default:
        return (arg1[sortBy] as number) - (arg2[sortBy] as number);
    }
  };
};

export const getErrorMessage = (error: unknown): string =>
  axios.isAxiosError(error) ? `Axios error: ${error.message}` : `Other error: ${new Error().message}`;

export const getUrlAddress = (apiAddress: string, queryParams: QueryParams): string => {
  const queryString: string = getQueryString(queryParams);
  return `${apiAddress}?${queryString}`;
};

export const getQueryString = (queryParams: QueryParams): string =>
  (Object.keys(queryParams) as Array<keyof QueryParams>)
    .map((queryParamKey) => `${queryParamKey}=${queryParams[queryParamKey]}`)
    .join();
