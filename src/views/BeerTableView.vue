<template>
  <h1>Click to fetch data</h1>
  <beer-button @click="debouncedInitialFetchClick()"> Let's brew! </beer-button>
  <beer-table-navigation v-if="isTableVisible" @change="onNavChange" />
  <beer-table
    v-if="isTableVisible"
    :beer-data="beersData"
    :sort-by="sortBy"
    :sort-direction="sortDirection"
    @sort="onSortClick"
  />
  <loader v-if="$store.state.loadingStatus" />
  <no-data data-test="no-data" v-if="isNoDataVisible"> No beers found </no-data>
  <component
    v-if="isLoadMoreVisible"
    :is="loadingType"
    :data-test="loadingType"
    @load-more="debouncedLoadMoreClick()"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapActions, mapGetters } from 'vuex';
import {
  BeerSimplified,
  LoadingType,
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
import BeerButton from '@/components/shared/BeerButton.vue';
import NoData from '@/components/shared/NoData.vue';
import Loader from '@/components/shared/Loader.vue';
import debounce from 'lodash/debounce';
import { DebouncedFunc } from 'lodash';

@Options({
  methods: {
    ...mapActions(['fetchBeersInitially', 'loadMoreBeers']),
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
    BeerTableNavigation,
  },
})
export default class BeerTableView extends Vue {
  fetchBeersInitially!: () => void;
  loadMoreBeers!: (query: QueryParams) => void;
  getSortedBeersData!: SortFunction;
  getSimplifiedBeersData!: BeerSimplified[];
  wasFetchButtonEverClicked: boolean = false;
  loadingType: LoadingType = 'LoadMore';
  sortDirection: SortDirection = 'none';
  sortBy: SortBy | null = null;
  page: number = 1;
  debouncedInitialFetchClick: DebouncedFunc<() => void> = debounce(
    this.downloadBeersInitially,
    300
  );
  debouncedLoadMoreClick: DebouncedFunc<() => void> = debounce(
    this.onLoadMoreBeers,
    300
  );

  get beersData(): BeerSimplified[] {
    return this.sortDirection === 'none'
      ? this.getSimplifiedBeersData
      : this.getSortedBeersData(this.sortDirection, this.sortBy as SortBy);
  }

  get isTableVisible(): boolean {
    return !!this.getSimplifiedBeersData.length;
  }

  get isNoDataVisible(): boolean {
    return (
      !this.getSimplifiedBeersData.length &&
      !this.$store.state.loadingStatus &&
      this.wasFetchButtonEverClicked
    );
  }

  get isLoadMoreVisible(): boolean {
    return this.isTableVisible && !this.$store.state.loadingStatus;
  }

  onSortClick(event: SortEventData): void {
    const shouldBeApplied: boolean =
      this.sortBy !== event.sortBy ||
      this.sortDirection !== event.sortDirection;

    this.sortBy = shouldBeApplied ? event.sortBy : null;
    this.sortDirection = shouldBeApplied ? event.sortDirection : 'none';
  }

  setInitialPageValue(): void {
    this.page = 1;
  }

  async onNavChange(navType: LoadingType): Promise<void> {
    this.sortBy = null;
    this.sortDirection = 'none';
    this.loadingType = navType;
    this.debouncedInitialFetchClick();
  }

  async downloadBeersInitially(): Promise<void> {
    await this.fetchBeersInitially();
    if (!this.wasFetchButtonEverClicked) {
      this.wasFetchButtonEverClicked = true;
    }
    this.setInitialPageValue();
  }

  async onLoadMoreBeers(): Promise<void> {
    this.page++;
    const queryObject: QueryParams = {
      page: this.page,
    };
    await this.loadMoreBeers(queryObject);
  }
}
</script>

<style scoped lang="scss" module="style"></style>
