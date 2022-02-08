<template>
  <h1 data-test="header">Click to fetch data</h1>
  <beer-button data-test="fetch-button" @click="debouncedFetchClick()">
    Let's brew!
  </beer-button>
  <loader v-if="$store.state.loadingStatus" />
  <beer-table-navigation
    v-if="shouldTableBeVisibile"
    @change="onNavChange"
    data-test="beer-table-nav"
  />
  <beer-table
    v-if="shouldTableBeVisibile"
    :beer-data="beersData"
    data-test="beer-table"
    @sort="onSortClick"
  />
  <no-data data-test="no-data" v-if="shouldNoDataBeVisibile">
    No beers found
  </no-data>
  <component
    v-if="shouldTableBeVisibile"
    :is="loadingType"
    :data-test="loadingType"
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
    ...mapActions(['fetchBeers']),
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
  fetchBeers!: () => void;
  getSimplifiedBeersData!: BeerSimplified[];
  getSortedBeersData!: SortFunction;
  wasFetchButtonEverClicked: boolean = false;
  debouncedFetchClick: DebouncedFunc<() => void> = debounce(
    this.downloadBeers,
    300
  );
  loadingType: LoadingType = 'LoadMore';
  sortDirection: SortDirection = 'none';
  sortBy: SortBy | null = null;

  get beersData(): BeerSimplified[] {
    return this.sortDirection === 'none'
      ? this.getSimplifiedBeersData
      : this.getSortedBeersData(this.sortDirection, this.sortBy as SortBy);
  }

  get shouldTableBeVisibile(): boolean {
    return (
      !!this.getSimplifiedBeersData.length && !this.$store.state.loadingStatus
    );
  }

  get shouldNoDataBeVisibile(): boolean {
    return (
      !this.getSimplifiedBeersData.length &&
      !this.$store.state.loadingStatus &&
      this.wasFetchButtonEverClicked
    );
  }

  onNavChange(navType: LoadingType): void {
    this.loadingType = navType;
  }

  onSortClick(event: SortEventData): void {
    this.sortDirection = event.sortDirection;
    this.sortBy = event.sortBy;
  }

  async downloadBeers(): Promise<void> {
    await this.fetchBeers();
    if (!this.wasFetchButtonEverClicked) {
      this.wasFetchButtonEverClicked = true;
    }
  }
}
</script>

<style scoped lang="scss" module="style"></style>