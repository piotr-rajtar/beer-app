<template>
  <h1>Click to fetch data</h1>
  <beer-button @click="debouncedFetchBeers()"> Let's brew! </beer-button>
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
    v-if="isTableNavigationButtonsVisible"
    :is="loadingType"
    :data-test="loadingType"
    :is-prev-button-disabled="isPrevButtonDisabled"
    :is-next-button-disabled="isNextButtonDisabled"
    :is-load-more-button-disabled="isLoadMoreButtonDisabled"
    @load-more="debouncedLoadMoreClick()"
    @prev-page="debouncedPrevPageClick()"
    @next-page="debouncedNextPageClick()"
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
  PaginationButtonState,
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
    ...mapActions([
      'loadSinglePage',
      'loadMoreBeers',
      'checkIfNextPageAvailable',
    ]),
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
  loadMoreBeers!: (query: QueryParams) => Promise<void>;
  loadSinglePage!: (query: QueryParams) => Promise<void>;
  checkIfNextPageAvailable!: (query: QueryParams) => Promise<boolean>;
  getSortedBeersData!: SortFunction;
  getSimplifiedBeersData!: BeerSimplified[];
  wasFetchButtonEverClicked: boolean = false;
  loadingType: LoadingType = 'LoadMore';
  sortDirection: SortDirection = 'none';
  sortBy: SortBy | null = null;
  page: number = 1;
  isPrevButtonDisabled: boolean = true;
  isNextButtonDisabled: boolean = false;
  isLoadMoreButtonDisabled: boolean = false;
  debouncedFetchBeers: DebouncedFunc<() => void> = debounce(
    this.fetchBeers,
    300
  );
  debouncedLoadMoreClick: DebouncedFunc<() => Promise<void>> = debounce(
    this.onLoadMoreBeers,
    300
  );
  debouncedPrevPageClick: DebouncedFunc<() => Promise<void>> = debounce(
    this.onPrevPageClick,
    300
  );
  debouncedNextPageClick: DebouncedFunc<() => Promise<void>> = debounce(
    this.onNextPageClick,
    300
  );

  async mounted(): Promise<void> {
    await this.setButtonsStatus(PaginationButtonState.INITIAL);
  }

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

  get isTableNavigationButtonsVisible(): boolean {
    return this.isTableVisible && !this.$store.state.loadingStatus;
  }

  get queryObject(): QueryParams {
    return {
      page: this.page,
    };
  }

  onSortClick(event: SortEventData): void {
    const shouldBeApplied: boolean =
      this.sortBy !== event.sortBy ||
      this.sortDirection !== event.sortDirection;

    this.sortBy = shouldBeApplied ? event.sortBy : null;
    this.sortDirection = shouldBeApplied ? event.sortDirection : 'none';
  }

  async setButtonsStatus(buttonState: PaginationButtonState): Promise<void> {
    const isNextPageAvailable: boolean = await this.checkIfNextPageAvailable({
      page: this.page + 1,
    });
    switch (buttonState) {
      case PaginationButtonState.INITIAL:
        this.isPrevButtonDisabled = true;
        this.isNextButtonDisabled = !isNextPageAvailable;
        this.isLoadMoreButtonDisabled = !isNextPageAvailable;
        return;
      case PaginationButtonState.PREV:
        this.isNextButtonDisabled = false;
        this.isPrevButtonDisabled = this.page === 1;
        return;
      case PaginationButtonState.NEXT:
        this.isPrevButtonDisabled = false;
        this.isNextButtonDisabled = !isNextPageAvailable;
        return;
      case PaginationButtonState.LOAD_MORE:
        this.isLoadMoreButtonDisabled = !isNextPageAvailable;
        return;
    }
  }

  async onNavChange(navType: LoadingType): Promise<void> {
    this.sortBy = null;
    this.sortDirection = 'none';
    if (this.page !== 1) {
      this.page = 1;
      this.debouncedFetchBeers();
    }
    await this.setButtonsStatus(PaginationButtonState.INITIAL);
    this.loadingType = navType;
  }

  fetchBeers(): void {
    this.page = 1;
    this.loadSinglePage(this.queryObject);
    if (!this.wasFetchButtonEverClicked) {
      this.wasFetchButtonEverClicked = true;
    }
  }

  async onLoadMoreBeers(): Promise<void> {
    this.page++;
    await this.loadMoreBeers(this.queryObject);
    await this.setButtonsStatus(PaginationButtonState.LOAD_MORE);
  }

  async onPrevPageClick(): Promise<void> {
    this.page--;
    await this.loadSinglePage(this.queryObject);
    await this.setButtonsStatus(PaginationButtonState.PREV);
  }

  async onNextPageClick(): Promise<void> {
    this.page++;
    await this.loadSinglePage(this.queryObject);
    await this.setButtonsStatus(PaginationButtonState.NEXT);
  }
}
</script>

<style scoped lang="scss" module="style"></style>
