<template>
  <h1 data-test="header">Click to fetch data</h1>
  <fetch-button data-test="fetch-button" @fetch="debouncedFetchClick()">
    Let's brew!
  </fetch-button>
  <loader v-if="$store.state.loadingStatus" />
  <beer-table
    v-if="shouldTableBeVisibile"
    :beer-data="simplifiedBeersData"
    data-test="beer-table"
  />
  <no-data data-test="no-data" v-if="shouldNoDataBeVisibile">
    No beers found
  </no-data>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapActions, mapGetters } from 'vuex';
import { BeerSimplified } from '@/types/typings';
import BeerTable from '@/components/BeerTable.vue';
import FetchButton from '@/components/FetchButton.vue';
import NoData from '@/components/NoData.vue';
import Loader from '@/components/Loader.vue';
import debounce from 'lodash/debounce';
import { DebouncedFunc } from 'lodash';

@Options({
  methods: {
    ...mapActions(['fetchBeers']),
  },
  computed: {
    ...mapGetters(['getSimplifiedBeersData']),
  },
  components: {
    BeerTable,
    FetchButton,
    NoData,
    Loader,
  },
})
export default class BeerTableView extends Vue {
  fetchBeers!: () => void;
  getSimplifiedBeersData!: BeerSimplified[];
  wasFetchButtonEverClicked: boolean = false;
  debouncedFetchClick: DebouncedFunc<() => void> = debounce(
    this.downloadBeers,
    300
  );

  get simplifiedBeersData(): BeerSimplified[] {
    return this.getSimplifiedBeersData;
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

  async downloadBeers(): Promise<void> {
    await this.fetchBeers();
    if (!this.wasFetchButtonEverClicked) {
      this.wasFetchButtonEverClicked = true;
    }
  }
}
</script>

<style scoped lang="scss" module="style"></style>
