<template>
  <h1>Click to fetch data</h1>
  <beer-button @click="debouncedFetchBeers()">Let's brew!</beer-button>
  <beer-table-navigation v-if="isTableVisible" @change="onNavChange" />
  <beer-table v-if="isTableVisible" id="beerTable" :beer-data="beersData" :sort-by="sortBy" @sort="onSortClick" />
  <component
    v-if="isTableVisible"
    :active-page="page"
    :data-test="navigationType"
    :is="navigationType"
    @load-more="onLoadMoreBeers"
    @next-page="onNextPageClick"
    @prev-page="onPrevPageClick"
  />
  <beer-table-loader v-if="isLoaderVisible" />
  <the-no-data v-if="isNoDataVisible" data-test="no-data">No beers found</the-no-data>
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
    ...mapActions(['loadSinglePage', 'loadMoreBeers', 'loadMorePaginedBeers']),
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
  getPaginatedSimplifiedBeersData!: (pageNumber: number) => BeerSimplified[];
  getPaginatedSortedBeersData!: (sortOptions: SortOptions, page: number) => BeerSimplified[];
  loadMoreBeers!: (query: QueryParams) => Promise<void>;
  loadMorePaginedBeers!: (query: QueryParams) => Promise<void>;
  loadSinglePage!: (query: QueryParams) => Promise<void>;
  setInitialDataFetchingState!: () => void;

  debouncedFetchBeers: DebouncedFunc<() => void> = debounce(this.fetchBeers, 300);
  navigationType: DataLoaderType = DataLoaderType.LOAD_MORE;
  page: number = 1;
  sortBy: SortBy | null = null;
  sortDirection: SortDirection = SortDirection.NONE;
  wasFetchButtonEverClicked: boolean = false;

  get beersData(): BeerSimplified[] {
    return this.sortDirection === SortDirection.NONE ? this.beersDataInInitialOrder : this.sortedBeersData;
  }

  get beersDataInInitialOrder(): BeerSimplified[] {
    return this.navigationType === DataLoaderType.PAGINATION
      ? this.getPaginatedSimplifiedBeersData(this.page)
      : this.getSimplifiedBeersData;
  }

  get isLoaderVisible(): boolean {
    return !this.isTableVisible && this.$store.state.loadingStatus;
  }

  get isNoDataVisible(): boolean {
    return !this.getSimplifiedBeersData.length && !this.$store.state.loadingStatus && this.wasFetchButtonEverClicked;
  }

  get isTableVisible(): boolean {
    return !!this.getSimplifiedBeersData.length;
  }

  get queryObject(): QueryParams {
    return {
      page: this.page,
    };
  }

  get sortedBeersData(): BeerSimplified[] {
    return this.navigationType === DataLoaderType.PAGINATION
      ? this.getPaginatedSortedBeersData(this.sortOptions, this.page)
      : this.getSortedBeersData(this.sortOptions);
  }

  get sortOptions(): SortOptions {
    return {
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
    };
  }

  onSortClick(sortOptions: SortOptions): void {
    if (this.navigationType === DataLoaderType.PAGINATION) {
      this.page = 1;
    }
    this.sortBy = sortOptions.sortDirection !== SortDirection.NONE ? sortOptions.sortBy : null;
    this.sortDirection = sortOptions.sortDirection;
  }

  setTableInitialState(): void {
    this.sortBy = null;
    this.sortDirection = SortDirection.NONE;
    this.page = 1;
  }

  async fetchBeers(): Promise<void> {
    this.setTableInitialState();
    await this.loadSinglePage(this.queryObject);
    this.setInitialDataFetchingState();
    if (!this.wasFetchButtonEverClicked) {
      this.wasFetchButtonEverClicked = true;
    }
  }

  async onLoadMoreBeers(): Promise<void> {
    this.page++;
    await this.loadMoreBeers(this.queryObject);
  }

  async onNavChange(navigationType: DataLoaderType): Promise<void> {
    this.navigationType = navigationType;
    this.setTableInitialState();
    await this.loadSinglePage(this.queryObject);
  }

  async onNextPageClick(): Promise<void> {
    this.page++;
    await this.loadMorePaginedBeers(this.queryObject);
  }

  async onPrevPageClick(): Promise<void> {
    this.page--;
    await this.loadMorePaginedBeers(this.queryObject);
  }
}
</script>
