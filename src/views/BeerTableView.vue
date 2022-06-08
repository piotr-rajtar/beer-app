<template>
  <h1>Click to fetch data</h1>
  <beer-button @click="debouncedFetchBeers()">Let's brew!</beer-button>
  <beer-table-navigation v-if="isTableVisible" @change="onNavChange" />
  <beer-table
    v-if="isTableVisible"
    id="beerTable"
    :beer-data="beersData"
    :sort-by="sortBy"
    :sort-direction="sortDirection"
    @sort="onSortClick"
  />
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
  DataLoaderComponent,
  SortDirection,
  SortEventData,
  SortFunction,
  SortBy,
  QueryParams,
} from '@/types/typings';
import debounce from 'lodash/debounce';
import { DebouncedFunc } from 'lodash';
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
    ...mapActions(['loadSinglePage', 'loadMoreBeers']),
    ...mapMutations(['setInitialDataFetchingState']),
  },
  computed: {
    ...mapGetters(['getSimplifiedBeersData', 'getSortedBeersData']),
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
  loadMoreBeers!: (query: QueryParams) => Promise<void>;
  loadSinglePage!: (query: QueryParams) => Promise<void>;
  setInitialDataFetchingState!: () => void;

  debouncedFetchBeers: DebouncedFunc<() => void> = debounce(this.fetchBeers, 300);
  navigationType: DataLoaderComponent = DataLoaderComponent.LOAD_MORE;
  page: number = 1;
  sortBy: SortBy | null = null;
  sortDirection: SortDirection = SortDirection.NONE;
  wasFetchButtonEverClicked: boolean = false;

  get beersData(): BeerSimplified[] {
    return this.sortDirection === SortDirection.NONE
      ? this.getSimplifiedBeersData
      : this.getSortedBeersData(this.sortDirection, this.sortBy as SortBy);
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

  onSortClick(event: SortEventData): void {
    const shouldBeApplied: boolean = this.sortBy !== event.sortBy || this.sortDirection !== event.sortDirection;

    this.sortBy = shouldBeApplied ? event.sortBy : null;
    this.sortDirection = shouldBeApplied ? event.sortDirection : SortDirection.NONE;
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

  async onNavChange(navigationType: DataLoaderComponent): Promise<void> {
    this.navigationType = navigationType;
    this.setTableInitialState();
    await this.loadSinglePage(this.queryObject);
  }

  async onNextPageClick(): Promise<void> {
    this.page++;
    await this.loadSinglePage(this.queryObject);
  }

  async onPrevPageClick(): Promise<void> {
    this.page--;
    await this.loadSinglePage(this.queryObject);
  }
}
</script>
