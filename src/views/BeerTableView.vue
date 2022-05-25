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
    :data-test="loadingComponent"
    :is="loadingComponent"
    @load-more="onLoadMoreBeers"
    @next-page="onNextPageClick"
    @prev-page="onPrevPageClick"
  />
  <loader v-if="isLoaderVisible" />
  <no-data v-if="isNoDataVisible" data-test="no-data">No beers found</no-data>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import {
  BeerSimplified,
  LoadingComponent,
  LoadingComponentType,
  SortDirection,
  SortEventData,
  SortFunction,
  SortBy,
  QueryParams,
} from '@/types/typings';
import BeerTableNavigation from '@/components/beerTable/BeerTableNavigation.vue';
import BeerTable from '@/components/beerTable/BeerTable.vue';
import Pagination from '@/components/beerTable/Pagination.vue';
import LoadMore from '@/components/beerTable/LoadMore.vue';
import InfiniteScroll from '@/components/beerTable/InfiniteScroll.vue';
import BeerButton from '@/components/shared/BeerButton.vue';
import NoData from '@/components/shared/NoData.vue';
import Loader from '@/components/shared/Loader.vue';
import debounce from 'lodash/debounce';
import { DebouncedFunc } from 'lodash';

@Options({
  methods: {
    ...mapActions(['loadSinglePage', 'loadMoreBeers']),
    ...mapMutations(['setInitialDataFetchingState']),
  },
  computed: {
    ...mapGetters(['getSimplifiedBeersData', 'getSortedBeersData']),
  },
  components: {
    BeerTable,
    BeerButton,
    NoData,
    Loader,
    Pagination,
    LoadMore,
    InfiniteScroll,
    BeerTableNavigation,
  },
})
export default class BeerTableView extends Vue {
  loadMoreBeers!: (query: QueryParams) => Promise<void>;
  loadSinglePage!: (query: QueryParams) => Promise<void>;
  getSortedBeersData!: SortFunction;
  setInitialDataFetchingState!: () => void;
  getSimplifiedBeersData!: BeerSimplified[];

  wasFetchButtonEverClicked: boolean = false;
  navigationType: LoadingComponent = LoadingComponent.LOAD_MORE;
  sortDirection: SortDirection = 'none';
  sortBy: SortBy | null = null;
  page: number = 1;
  debouncedFetchBeers: DebouncedFunc<() => void> = debounce(this.fetchBeers, 300);

  get beersData(): BeerSimplified[] {
    return this.sortDirection === 'none'
      ? this.getSimplifiedBeersData
      : this.getSortedBeersData(this.sortDirection, this.sortBy as SortBy);
  }

  get loadingComponent(): LoadingComponentType {
    switch (this.navigationType) {
      case LoadingComponent.LOAD_MORE:
      default:
        return 'LoadMore';
      case LoadingComponent.PAGINATION:
        return 'Pagination';
      case LoadingComponent.INFINITE_SCROLL:
        return 'InfiniteScroll';
    }
  }

  get isTableVisible(): boolean {
    return !!this.getSimplifiedBeersData.length;
  }

  get isLoaderVisible(): boolean {
    return !this.isTableVisible && this.$store.state.loadingStatus;
  }

  get isNoDataVisible(): boolean {
    return !this.getSimplifiedBeersData.length && !this.$store.state.loadingStatus && this.wasFetchButtonEverClicked;
  }

  get queryObject(): QueryParams {
    return {
      page: this.page,
    };
  }

  onSortClick(event: SortEventData): void {
    const shouldBeApplied: boolean = this.sortBy !== event.sortBy || this.sortDirection !== event.sortDirection;

    this.sortBy = shouldBeApplied ? event.sortBy : null;
    this.sortDirection = shouldBeApplied ? event.sortDirection : 'none';
  }

  setTableInitialState(): void {
    this.sortBy = null;
    this.sortDirection = 'none';
    this.page = 1;
  }

  async onNavChange(navigationType: LoadingComponent): Promise<void> {
    this.navigationType = navigationType;
    this.setTableInitialState();
    await this.loadSinglePage(this.queryObject);
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

  async onPrevPageClick(): Promise<void> {
    this.page--;
    await this.loadSinglePage(this.queryObject);
  }

  async onNextPageClick(): Promise<void> {
    this.page++;
    await this.loadSinglePage(this.queryObject);
  }
}
</script>

<style scoped lang="scss" module="style"></style>
