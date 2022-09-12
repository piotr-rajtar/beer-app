<template>
  <h1>Click to fetch data</h1>
  <beer-button @click="debouncedFetchBeers()">Let's start brewing!</beer-button>
  <beer-table-navigation v-if="isTableVisible" @change="onNavChange" />
  <beer-table v-if="isTableVisible" id="beerTable" :beer-data="beersData" :sort-by="sortBy" @sort="onSortClick" />
  <component
    v-if="isTableVisible"
    :active-page="pageNumber"
    :data-test-id="navigationType"
    :is="navigationType"
    @load-more="onLoadMoreBeers"
    @next-page="onNextPageClick"
    @prev-page="onPrevPageClick"
  />
  <beer-table-loader v-if="isLoaderVisible" />
  <the-no-data v-if="isNoDataVisible" data-test-id="no-data">No beers found</the-no-data>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import {
  BeerSimplified,
  DataLoaderType,
  SortDirection,
  SortOptions,
  SortFunction,
  SortBy,
  QueryParams,
  PagingOptions,
} from '@/types/typings';
import { debounce, DebouncedFunc } from 'lodash';
import BeerButton from '@/components/BeerButton.vue';
import BeerTable from '@/components/BeerTable.vue';
import BeerTableInfiniteScroll from '@/components/BeerTableInfiniteScroll.vue';
import BeerTableLoader from '@/components/BeerTableLoader.vue';
import BeerTableLoadMore from '@/components/BeerTableLoadMore.vue';
import BeerTableNavigation from '@/components/BeerTableNavigation.vue';
import BeerTablePagination from '@/components/BeerTablePagination.vue';
import TheNoData from '@/components/TheNoData.vue';

@Options({
  methods: {
    ...mapActions(['loadInitialPage', 'loadMoreBeers', 'loadMorePaginedBeers']),
    ...mapMutations(['setInitialDataFetchingState']),
  },
  computed: {
    ...mapGetters([
      'getSimplifiedBeersData',
      'getSortedBeersData',
      'getPaginatedSimplifiedBeersData',
      'getPaginatedSortedBeersData',
    ]),
  },
  components: {
    BeerButton,
    BeerTable,
    BeerTableInfiniteScroll,
    BeerTableLoader,
    BeerTableLoadMore,
    BeerTableNavigation,
    BeerTablePagination,
    TheNoData,
  },
})
export default class BeerTableView extends Vue {
  getSimplifiedBeersData!: BeerSimplified[];
  getSortedBeersData!: SortFunction;
  getPaginatedSimplifiedBeersData!: (pagingOptions: PagingOptions) => BeerSimplified[];
  getPaginatedSortedBeersData!: (sortOptions: SortOptions, pagingOptions: PagingOptions) => BeerSimplified[];
  loadMoreBeers!: (query: QueryParams) => Promise<void>;
  loadMorePaginedBeers!: (query: QueryParams) => Promise<void>;
  loadInitialPage!: (query: QueryParams) => Promise<void>;
  setInitialDataFetchingState!: () => void;

  debouncedFetchBeers: DebouncedFunc<() => void> = debounce(this.fetchBeers, 300);
  navigationType: DataLoaderType = DataLoaderType.LOAD_MORE;
  pageNumber: number = 1;
  sortBy: SortBy | null = null;
  sortDirection: SortDirection = SortDirection.NONE;
  wasFetchButtonEverClicked: boolean = false;
  itemsPerPage: number = 25;

  get beersData(): BeerSimplified[] {
    return this.sortDirection === SortDirection.NONE ? this.beersDataInInitialOrder : this.sortedBeersData;
  }

  get beersDataInInitialOrder(): BeerSimplified[] {
    if (this.navigationType === DataLoaderType.PAGINATION) {
      const { itemsPerPage, pageNumber } = this;
      return this.getPaginatedSimplifiedBeersData({ pageNumber, itemsPerPage });
    }
    return this.getSimplifiedBeersData;
  }

  get isLoaderVisible(): boolean {
    return this.$store.state.loadingStatus;
  }

  get isNoDataVisible(): boolean {
    return !this.getSimplifiedBeersData.length && !this.$store.state.loadingStatus && this.wasFetchButtonEverClicked;
  }

  get isTableVisible(): boolean {
    return !!this.getSimplifiedBeersData.length;
  }

  get queryObject(): QueryParams {
    return {
      page: this.pageNumber,
    };
  }

  get sortedBeersData(): BeerSimplified[] {
    if (this.navigationType === DataLoaderType.PAGINATION) {
      const { itemsPerPage, pageNumber } = this;
      const pagingOptions: PagingOptions = {
        itemsPerPage,
        pageNumber,
      };
      return this.getPaginatedSortedBeersData(this.sortOptions, pagingOptions);
    }
    return this.getSortedBeersData(this.sortOptions);
  }

  get sortOptions(): SortOptions {
    return {
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
    };
  }

  onSortClick(sortOptions: SortOptions): void {
    if (this.navigationType === DataLoaderType.PAGINATION) {
      this.pageNumber = 1;
    }
    this.sortBy = sortOptions.sortDirection !== SortDirection.NONE ? sortOptions.sortBy : null;
    this.sortDirection = sortOptions.sortDirection;
  }

  setTableInitialState(): void {
    this.sortBy = null;
    this.sortDirection = SortDirection.NONE;
    this.pageNumber = 1;
  }

  async fetchBeers(): Promise<void> {
    this.setTableInitialState();
    this.setInitialDataFetchingState();
    await this.loadInitialPage(this.queryObject);
    if (!this.wasFetchButtonEverClicked) {
      this.wasFetchButtonEverClicked = true;
    }
  }

  async onLoadMoreBeers(): Promise<void> {
    this.pageNumber++;
    await this.loadMoreBeers(this.queryObject);
  }

  async onNavChange(navigationType: DataLoaderType): Promise<void> {
    this.navigationType = navigationType;
    this.setTableInitialState();
    await this.loadInitialPage(this.queryObject);
  }

  async onNextPageClick(): Promise<void> {
    this.pageNumber++;
    await this.loadMorePaginedBeers(this.queryObject);
  }

  async onPrevPageClick(): Promise<void> {
    this.pageNumber--;
    await this.loadMorePaginedBeers(this.queryObject);
  }
}
</script>
