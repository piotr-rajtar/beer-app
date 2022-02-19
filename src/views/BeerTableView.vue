<template>
  <h1>Click to fetch data</h1>
  <beer-button @click="debouncedInitialFetchClick()"> Let's brew! </beer-button>
  <beer-table-navigation v-if="shouldTableBeVisibile" @change="onNavChange" />
  <beer-table
    v-if="shouldTableBeVisibile"
    :beer-data="beersData"
    @sort="onSortClick"
  />
  <loader v-if="$store.state.loadingStatus" />
  <no-data data-test="no-data" v-if="shouldNoDataBeVisibile">
    No beers found
  </no-data>
  <component
    v-if="shouldLoadMoreComponentBeVisible"
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

  get shouldTableBeVisibile(): boolean {
    return !!this.getSimplifiedBeersData.length;
  }

  get shouldNoDataBeVisibile(): boolean {
    return (
      !this.getSimplifiedBeersData.length &&
      !this.$store.state.loadingStatus &&
      this.wasFetchButtonEverClicked
    );
  }

  get shouldLoadMoreComponentBeVisible(): boolean {
    return this.shouldTableBeVisibile && !this.$store.state.loadingStatus;
  }

  onSortClick(event: SortEventData): void {
    this.sortDirection = event.sortDirection;
    this.sortBy = event.sortBy;
  }

  setInitialPageValue(): void {
    this.page = 1;
  }

  async onNavChange(navType: LoadingType): Promise<void> {
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
